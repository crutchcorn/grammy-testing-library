/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Bot } from "grammy";
import type { Message } from "@grammyjs/types";
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
import {
  addMessage,
  createBotServer,
  createChat,
  type BotServer,
} from "./store.ts";

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

// grammY can't uninstall transformers, so each bot gets one shared by all of its renders
const servers = new WeakMap<Bot<any>, BotServer>();

function getServer(bot: Bot<any>): BotServer {
  const existing = servers.get(bot);
  if (existing) return existing;

  const server = createBotServer();
  bot.api.config.use(async (_prev, method, payload) => {
    const handler = methodMap[method] as (
      props: unknown,
      server: BotServer,
    ) => unknown;
    try {
      return { ok: true, result: handler(payload, server) } as any;
    } catch (error) {
      if (!(error instanceof BadRequest)) throw error;
      return { ok: false, error_code: 400, description: error.message } as any;
    }
  });
  servers.set(bot, server);
  return server;
}

const commandPattern = /^\/[A-Za-z0-9_]+(?:@[A-Za-z0-9_]+)?/;

// Each render is a different user in their own chat, so renders can't see each other's messages
export function render(bot: Bot<any>): RenderReturn {
  const server = getServer(bot);
  const store = createChat(server);

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
        update_id: server.nextUpdateId++,
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
        update_id: server.nextUpdateId++,
        callback_query: {
          id: String(server.nextCallbackQueryId++),
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
