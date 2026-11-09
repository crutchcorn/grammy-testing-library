/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-empty-object-type */
import type { Bot } from "grammy";
import type {
  Message,
  InlineKeyboardButton as _InlineKeyboardButton,
} from "@grammyjs/types";
import { methodMap } from "./methods/map.ts";
import { findByText, getByText, type TextMatch } from "./queries.ts";
import { addMessage, createChatStore, type ChatStore } from "./store.ts";

interface ClearOptions {
  keepLast?: boolean;
}

interface UserEvent {
  sendMessage: (message: string) => Promise<void>;
  pressInlineButton: (
    replyMarkup: Message.CommonMessage,
    buttonText: string | RegExp, // _InlineKeyboardButton.AbstractInlineKeyboardButton["text"],
  ) => Promise<void>;
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
    return { ok: true, result: handler(payload, session.store) } as any;
  });
  sessions.set(bot, session);
  return session;
}

const commandPattern = /^\/[A-Za-z0-9_]+(?:@[A-Za-z0-9_]+)?/;

export function render(bot: Bot<any>): RenderReturn {
  const session = getSession(bot);
  const store = createChatStore();
  session.store = store;

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
    pressInlineButton: async (_replyMarkup, _buttonText) => {},
  };

  const clear: RenderReturn["clear"] = ({ keepLast: _keepLast } = {}) => {};

  return {
    userEvent,
    clear,
    getByText: (text) => getByText(store, text),
    findByText: (text) => findByText(store, text),
  };
}

interface GrammyTestingLibraryMatchers<R> {
  toBeInTheChat(): R;
}

declare module "vitest" {
  // Vitest 5's Assertion and AsymmetricMatchersContaining both extend Matchers
  interface Matchers<
    R extends void | Promise<void> = void | Promise<void>,
    // Unused, but merged declarations must match Vitest's type parameters exactly
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    T = unknown,
  > extends GrammyTestingLibraryMatchers<R> {}
}
