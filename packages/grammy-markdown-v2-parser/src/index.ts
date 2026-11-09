import type { MessageEntity, User } from "@grammyjs/types";
import {
  getCheckedLink,
  getLinkCustomEmojiId,
  getLinkDateTime,
  getLinkUserId,
} from "./links.ts";

// The parser only knows a mentioned user's ID, not the rest of their profile
export type ParsedMessageEntity =
  | Exclude<MessageEntity, MessageEntity.TextMentionMessageEntity>
  | (Omit<MessageEntity.TextMentionMessageEntity, "user"> & {
      user: Pick<User, "id">;
    });

export interface FormattedText {
  text: string;
  entities: ParsedMessageEntity[];
}

export class MarkdownV2ParseError extends Error {
  name = "MarkdownV2ParseError";
}

// Names match tdlib's, which appear in Telegram's error messages
type EntityKind =
  | "Bold"
  | "Italic"
  | "Underline"
  | "Strikethrough"
  | "Spoiler"
  | "Code"
  | "Pre"
  | "PreCode"
  | "TextUrl"
  | "CustomEmoji"
  | "BlockQuote";

interface OpenEntity {
  kind: EntityKind;
  argument: string;
  offset: number;
  markdownIndex: number;
}

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

const reservedCharacters = "_*[]()~`>#+-=|{}.!\n";

function byteOffset(markdown: string, index: number): number {
  return new TextEncoder().encode(markdown.slice(0, index)).length;
}

function isEscapable(markdown: string, index: number): boolean {
  const code = markdown.charCodeAt(index);
  return code >= 1 && code <= 126;
}

function isSpace(character: string | undefined): boolean {
  return (
    character === undefined ||
    character === " " ||
    character === "\t" ||
    character === "\r" ||
    character === "\n" ||
    character === "\v"
  );
}

function reservedCharacterError(character: string): MarkdownV2ParseError {
  return new MarkdownV2ParseError(
    `Character '${character}' is reserved and must be escaped with the preceding '\\'`,
  );
}

function missingEndError(
  markdown: string,
  entity: OpenEntity,
): MarkdownV2ParseError {
  return new MarkdownV2ParseError(
    `Can't find end of ${entity.kind} entity at byte offset ${byteOffset(markdown, entity.markdownIndex)}`,
  );
}

function isEndOfEntity(
  markdown: string,
  index: number,
  entity: OpenEntity,
  haveBlockquote: boolean,
): boolean {
  const character = markdown[index];
  if (haveBlockquote && character === "\n" && markdown[index + 1] !== ">") {
    return true;
  }
  switch (entity.kind) {
    case "Bold":
      return character === "*";
    case "Italic":
      return character === "_" && markdown[index + 1] !== "_";
    case "Code":
      return character === "`";
    case "Pre":
    case "PreCode":
      return (
        character === "`" &&
        markdown[index + 1] === "`" &&
        markdown[index + 2] === "`"
      );
    case "TextUrl":
    case "CustomEmoji":
      return character === "]";
    case "Underline":
      return character === "_" && markdown[index + 1] === "_";
    case "Strikethrough":
      return character === "~";
    case "Spoiler":
      return character === "|" && markdown[index + 1] === "|";
    case "BlockQuote":
      return false;
  }
}

function readUrl(markdown: string, start: number): { url: string; end: number } {
  let url = "";
  let index = start;
  while (index < markdown.length && markdown[index] !== ")") {
    if (markdown[index] === "\\" && isEscapable(markdown, index + 1)) {
      url += markdown[index + 1];
      index += 2;
      continue;
    }
    url += markdown[index++];
  }
  if (markdown[index] !== ")") {
    throw new MarkdownV2ParseError(
      `Can't find end of a URL at byte offset ${byteOffset(markdown, start)}`,
    );
  }
  return { url, end: index };
}

// tdlib sorts by offset, then longest first, then by these type priorities
function getPriority(entity: ParsedMessageEntity): number {
  switch (entity.type) {
    case "blockquote":
    case "expandable_blockquote":
      return 0;
    case "pre":
      return entity.language ? 10 : 11;
    case "code":
      return 20;
    case "date_time":
      return 30;
    case "text_link":
    case "text_mention":
      return 49;
    case "mention":
    case "hashtag":
    case "cashtag":
    case "bot_command":
    case "url":
    case "email":
    case "phone_number":
      return 50;
    case "bold":
      return 90;
    case "italic":
      return 91;
    case "underline":
      return 92;
    case "strikethrough":
      return 93;
    case "spoiler":
      return 94;
    case "custom_emoji":
      return 99;
  }
}

function compareEntities(
  a: ParsedMessageEntity,
  b: ParsedMessageEntity,
): number {
  return (
    a.offset - b.offset || b.length - a.length || getPriority(a) - getPriority(b)
  );
}

/**
 * Parses Telegram's MarkdownV2 into plain text and message entities, following tdlib's `parse_markdown_v2`.
 * Throws a `MarkdownV2ParseError` with Telegram's wording when the Bot API would reject the text.
 */
export function parseMarkdownV2(markdown: string): FormattedText {
  let text = "";
  const entities: ParsedMessageEntity[] = [];
  const nested: OpenEntity[] = [];
  let haveBlockquote = false;
  let canStartBlockquote = true;

  for (let i = 0; i < markdown.length; i++) {
    const character = markdown[i];
    if (character === "\\" && isEscapable(markdown, i + 1)) {
      i++;
      text += markdown[i];
      if (markdown[i] !== "\r") canStartBlockquote = markdown[i] === "\n";
      continue;
    }

    const top = nested.at(-1);
    const reserved =
      top?.kind === "Code" || top?.kind === "Pre" || top?.kind === "PreCode"
        ? "`"
        : reservedCharacters;
    if (!reserved.includes(character)) {
      text += character;
      if (character !== "\r") canStartBlockquote = false;
      continue;
    }

    if (!top || !isEndOfEntity(markdown, i, top, haveBlockquote)) {
      const markdownIndex = i;
      let kind: EntityKind | undefined;
      let argument = "";
      switch (character) {
        case "_":
          if (markdown[i + 1] === "_") {
            kind = "Underline";
            i++;
          } else {
            kind = "Italic";
          }
          break;
        case "*":
          kind = "Bold";
          break;
        case "~":
          kind = "Strikethrough";
          break;
        case "|":
          if (markdown[i + 1] !== "|") throw reservedCharacterError(character);
          i++;
          kind = "Spoiler";
          break;
        case "[":
          kind = "TextUrl";
          break;
        case "`":
          if (markdown[i + 1] === "`" && markdown[i + 2] === "`") {
            i += 3;
            kind = "Pre";
            let languageEnd = i;
            while (
              !isSpace(markdown[languageEnd]) &&
              markdown[languageEnd] !== "`"
            ) {
              languageEnd++;
            }
            if (
              i !== languageEnd &&
              languageEnd < markdown.length &&
              markdown[languageEnd] !== "`"
            ) {
              kind = "PreCode";
              argument = markdown.slice(i, languageEnd);
              i = languageEnd;
            }
            // Skip one line break after the opening fence
            if (markdown[i] === "\n" || markdown[i] === "\r") {
              if (
                (markdown[i + 1] === "\n" || markdown[i + 1] === "\r") &&
                markdown[i] !== markdown[i + 1]
              ) {
                i += 2;
              } else {
                i++;
              }
            }
            i--;
          } else {
            kind = "Code";
          }
          break;
        case "!":
          if (markdown[i + 1] !== "[") throw reservedCharacterError(character);
          i++;
          kind = "CustomEmoji";
          break;
        case "\n":
          text += "\n";
          canStartBlockquote = true;
          break;
        case ">":
          if (!canStartBlockquote) throw reservedCharacterError(character);
          if (!haveBlockquote) {
            kind = "BlockQuote";
            haveBlockquote = true;
          }
          break;
        default:
          throw reservedCharacterError(character);
      }
      if (kind) {
        nested.push({ kind, argument, offset: text.length, markdownIndex });
      }
      continue;
    }

    let kind: EntityKind | "ExpandableBlockQuote" = top.kind;
    if (character === "\n" && kind !== "BlockQuote") {
      // A spoiler right before the line break is the expandable blockquote's `||` mark
      const isExpandableMark =
        kind === "Spoiler" &&
        (top.markdownIndex === i - 2 ||
          (top.markdownIndex === i - 3 && text.endsWith("\r")));
      if (!isExpandableMark) throw missingEndError(markdown, top);
      nested.pop();
      const parent = nested.at(-1);
      if (parent?.kind !== "BlockQuote") {
        throw missingEndError(markdown, parent ?? top);
      }
      kind = "ExpandableBlockQuote";
    }

    const open = nested[nested.length - 1];
    let skip = text.length === open.offset;
    let entity: DistributiveOmit<ParsedMessageEntity, "offset" | "length"> | undefined;
    switch (kind) {
      case "Bold":
        entity = { type: "bold" };
        break;
      case "Italic":
        entity = { type: "italic" };
        break;
      case "Code":
        entity = { type: "code" };
        break;
      case "Strikethrough":
        entity = { type: "strikethrough" };
        break;
      case "Underline":
        i++;
        entity = { type: "underline" };
        break;
      case "Spoiler":
        i++;
        entity = { type: "spoiler" };
        break;
      case "Pre":
        i += 2;
        entity = { type: "pre" };
        break;
      case "PreCode":
        i += 2;
        entity = { type: "pre", language: open.argument };
        break;
      case "TextUrl": {
        let url = text.slice(open.offset);
        if (markdown[i + 1] === "(") {
          ({ url, end: i } = readUrl(markdown, i + 2));
        }
        const userId = getLinkUserId(url);
        const checkedUrl = getCheckedLink(url);
        if (userId !== undefined) {
          entity = { type: "text_mention", user: { id: userId } };
        } else if (checkedUrl === undefined) {
          skip = true;
        } else {
          entity = { type: "text_link", url: checkedUrl };
        }
        break;
      }
      case "CustomEmoji": {
        if (markdown[i + 1] !== "(") {
          throw new MarkdownV2ParseError(
            "The entity must contain a tg://emoji or tg://time URL",
          );
        }
        const { url, end } = readUrl(markdown, i + 2);
        i = end;
        const customEmojiId = getLinkCustomEmojiId(url);
        const dateTime = getLinkDateTime(url);
        if (customEmojiId !== undefined) {
          // Telegram drops custom emoji with an ID of 0
          if (customEmojiId === "0") skip = true;
          entity = { type: "custom_emoji", custom_emoji_id: customEmojiId };
        } else if (dateTime) {
          entity = { type: "date_time", ...dateTime };
        } else {
          throw new MarkdownV2ParseError(
            "Invalid tg://emoji or tg://time URL specified",
          );
        }
        break;
      }
      case "BlockQuote":
      case "ExpandableBlockQuote":
        haveBlockquote = false;
        text += character;
        canStartBlockquote = true;
        skip = false;
        entity = {
          type: kind === "BlockQuote" ? "blockquote" : "expandable_blockquote",
        };
        break;
    }

    if (!skip && entity) {
      entities.push({
        ...entity,
        offset: open.offset,
        length: text.length - open.offset,
      });
    }
    nested.pop();
  }

  if (haveBlockquote) {
    let type: "blockquote" | "expandable_blockquote" = "blockquote";
    const top = nested[nested.length - 1];
    if (
      top.kind === "Spoiler" &&
      top.markdownIndex === markdown.length - 2
    ) {
      nested.pop();
      type = "expandable_blockquote";
    }
    const blockquote = nested[nested.length - 1];
    if (blockquote.kind === "BlockQuote") {
      if (text.length !== blockquote.offset) {
        entities.push({
          type,
          offset: blockquote.offset,
          length: text.length - blockquote.offset,
        });
      }
      nested.pop();
    }
  }

  const unclosed = nested.at(-1);
  if (unclosed) throw missingEndError(markdown, unclosed);

  return { text, entities: entities.sort(compareEntities) };
}
