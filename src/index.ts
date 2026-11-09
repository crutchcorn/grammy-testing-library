/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-empty-object-type */
import type { Bot } from "grammy";
import type {
  Message,
  InlineKeyboardButton as _InlineKeyboardButton,
} from "@grammyjs/types";

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
  findByText: (text: RegExp | string) => Promise<Message.TextMessage>;
}

const botTransformer: Parameters<Bot<any>["api"]["config"]["use"]>[0] = (
  _prev,
  _method,
  _payload,
  _signal,
) => {
  return { ok: true } as any;
};

export function render(bot: Bot<any>) {
  bot.api.config.use(botTransformer);

  const userEvent: UserEvent = {
    sendMessage: async (_message) => {},
    pressInlineButton: async (_replyMarkup, _buttonText) => {},
  };

  const clear: RenderReturn["clear"] = ({ keepLast: _keepLast } = {}) => {};

  const findByText: RenderReturn["findByText"] = async (_text) => {
    return 0 as never;
  };

  return {
    userEvent,
    clear,
    findByText,
  } as RenderReturn;
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
