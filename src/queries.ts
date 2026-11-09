import type { Message } from "@grammyjs/types";
import { vi } from "vitest";
import type { ChatStore } from "./store.ts";

export type TextMatch = string | RegExp;

function matches(content: string | undefined, matcher: TextMatch): boolean {
  if (content === undefined) return false;
  const normalized = content.trim().replace(/\s+/g, " ");
  return typeof matcher === "string"
    ? normalized === matcher
    : matcher.test(normalized);
}

export function prettyChat(store: ChatStore): string {
  if (store.messages.length === 0) return "(the chat is empty)";
  return store.messages
    .map((message) => {
      const author = message.from?.id === store.bot.id ? "Bot" : "User";
      const content = message.text ?? message.caption ?? "(unsupported message)";
      const keyboard = (message.reply_markup?.inline_keyboard ?? []).map(
        (row) => `  ${row.map((button) => `[${button.text}]`).join(" ")}`,
      );
      return [`${author}: ${content}`, ...keyboard].join("\n");
    })
    .join("\n");
}

export function queryAllByText(store: ChatStore, text: TextMatch): Message[] {
  return store.messages.filter((message) =>
    matches(message.text ?? message.caption, text),
  );
}

export function getByText(store: ChatStore, text: TextMatch): Message {
  const found = queryAllByText(store, text);
  if (found.length === 0) {
    throw new Error(
      `Unable to find a message with the text: ${text}\n\n${prettyChat(store)}`,
    );
  }
  if (found.length > 1) {
    throw new Error(
      `Found multiple messages with the text: ${text}\n\n${prettyChat(store)}`,
    );
  }
  return found[0];
}

export function findByText(
  store: ChatStore,
  text: TextMatch,
): Promise<Message> {
  return vi.waitFor(() => getByText(store, text));
}
