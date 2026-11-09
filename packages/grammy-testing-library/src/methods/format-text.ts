import type { MessageEntity, ParseMode } from "@grammyjs/types";
import {
  MarkdownV2ParseError,
  parseMarkdownV2,
} from "grammy-markdown-v2-parser";
import type { ChatStore } from "../store.ts";
import { BadRequest } from "./bad-request.ts";

// Like the Bot API, a parse_mode takes precedence over explicit entities
export function formatText(
  store: ChatStore,
  text: string,
  parseMode: ParseMode | undefined,
  entities: MessageEntity[] | undefined,
): { text: string; entities: MessageEntity[] | undefined } {
  const mode = parseMode?.toLowerCase();
  if (!text || !mode || mode === "none") return { text, entities };
  if (mode !== "markdownv2") {
    throw new Error(`Not implemented: parse_mode "${parseMode}"`);
  }

  let parsed;
  try {
    parsed = parseMarkdownV2(text);
  } catch (error) {
    if (!(error instanceof MarkdownV2ParseError)) throw error;
    throw new BadRequest(`can't parse entities: ${error.message}`);
  }

  const resolved = parsed.entities.map((entity): MessageEntity => {
    if (entity.type !== "text_mention") return entity;
    if (entity.user.id !== store.user.id) {
      throw new Error("Not implemented: mentioning users outside the chat");
    }
    return { ...entity, user: store.user };
  });
  return {
    text: parsed.text,
    entities: resolved.length > 0 ? resolved : undefined,
  };
}
