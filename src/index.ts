/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Bot } from "grammy";
import type { Message } from "@grammyjs/types";
import { afterEach } from "vitest";
import "./matchers.ts";
import { BadRequest } from "./methods/bad-request.ts";
import { methodMap } from "./methods/map.ts";
import {
  findByText,
  getByText,
  matches,
  prettyChat,
  type TextMatch,
} from "./queries.ts";
import { addMessage, createChatStore, type ChatStore } from "./store.ts";

interface ClearOptions {
  keepLast?: boolean;
}

interface UserEvent {
  sendMessage: (message: string) => Promise<void>;
  pressInlineButton: (message: Message, buttonText: TextMatch) => Promise<void>;
}

interface RenderReturn {
  userEvent: UserEvent;
  clear: (opts?: ClearOptions) => void;
  getByText: (text: TextMatch) => Message;
  findByText: (text: TextMatch) => Promise<Message>;
}

interface Session {
  store: ChatStore;
}

// grammY can't uninstall transformers, so each bot gets one that reads the latest render's store
const sessions = new WeakMap<Bot<any>, Session>();

function getSession(bot: Bot<any>): Session {
  const existing = sessions.get(bot);
  if (existing) return existing;

  const session: Session = { store: createChatStore() };
  bot.api.config.use(async (_prev, method, payload) => {
    const handler = methodMap[method] as (
      props: unknown,
      store: ChatStore,
    ) => unknown;
    try {
      return { ok: true, result: handler(payload, session.store) } as any;
    } catch (error) {
      if (!(error instanceof BadRequest)) throw error;
      return { ok: false, error_code: 400, description: error.message } as any;
    }
  });
  sessions.set(bot, session);
  return session;
}

const commandPattern = /^\/[A-Za-z0-9_]+(?:@[A-Za-z0-9_]+)?/;

const mountedStores = new Set<ChatStore>();

export function cleanup(): void {
  for (const store of mountedStores) store.mounted = false;
  mountedStores.clear();
}

afterEach(cleanup);

export function render(bot: Bot<any>): RenderReturn {
  const session = getSession(bot);
  session.store.mounted = false;
  mountedStores.delete(session.store);
  const store = createChatStore();
  session.store = store;
  mountedStores.add(store);

  const userEvent: UserEvent = {
    sendMessage: async (text) => {
      await bot.init();
      const command = commandPattern.exec(text);
      const message = addMessage(store, {
        from: store.user,
        text,
        // Telegram clients mark commands with an entity, which `bot.command()` relies on
        ...(command
          ? {
              entities: [
                { type: "bot_command", offset: 0, length: command[0].length },
              ],
            }
          : {}),
      });
      await bot.handleUpdate({
        update_id: store.nextUpdateId++,
        message: structuredClone(message),
      });
    },
    pressInlineButton: async (message, buttonText) => {
      if (!store.messages.includes(message)) {
        throw new Error(
          `Unable to press "${buttonText}": the message is no longer in the chat\n\n${prettyChat(store)}`,
        );
      }
      const buttons = (message.reply_markup?.inline_keyboard ?? [])
        .flat()
        .filter((button) => matches(button.text, buttonText));
      if (buttons.length !== 1) {
        throw new Error(
          `${buttons.length === 0 ? "Unable to find a button" : "Found multiple buttons"} with the text: ${buttonText}\n\n${prettyChat(store)}`,
        );
      }
      const [button] = buttons;
      if (!("callback_data" in button)) {
        throw new Error(
          `Not implemented: pressing "${button.text}", which isn't a callback button`,
        );
      }

      await bot.init();
      await bot.handleUpdate({
        update_id: store.nextUpdateId++,
        callback_query: {
          id: String(store.nextCallbackQueryId++),
          from: store.user,
          chat_instance: String(store.chat.id),
          message: structuredClone(message),
          data: button.callback_data,
        },
      });
    },
  };

  const clear: RenderReturn["clear"] = ({ keepLast = false } = {}) => {
    store.messages.splice(
      0,
      keepLast ? store.messages.length - 1 : store.messages.length,
    );
  };

  return {
    userEvent,
    clear,
    getByText: (text) => getByText(store, text),
    findByText: (text) => findByText(store, text),
  };
}
