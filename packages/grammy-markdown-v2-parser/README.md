# grammy-markdown-v2-parser

Turn Telegram's [MarkdownV2](https://core.telegram.org/bots/api#markdownv2-style) into plain text and [message entities](https://core.telegram.org/bots/api#messageentity), the same way Telegram does.

```ts
import { parseMarkdownV2 } from "grammy-markdown-v2-parser";

parseMarkdownV2("*Welcome*, I'm Ida\\!");
// {
//   text: "Welcome, I'm Ida!",
//   entities: [{ type: "bold", offset: 0, length: 7 }],
// }
```

## Why not use a Markdown parser?

MarkdownV2 looks like Markdown, but it follows its own rules. `*text*` is bold rather than italic, `__text__` is underlined, and characters like `.` and `!` must be escaped even when they mean nothing special. A CommonMark parser such as `remark` happily accepts text that Telegram would reject, and formats other text differently than Telegram would.

Rather than approximating those rules, this package ports Telegram's own parser: `parse_markdown_v2` from [tdlib](https://github.com/tdlib/td)'s `td/telegram/MessageEntity.cpp`, the code the Bot API server runs when you send a message with `parse_mode: "MarkdownV2"`.

That makes it useful whenever you need to know what Telegram will do with a message before sending it, such as:

- Checking that a message is valid MarkdownV2.
- Counting its length against Telegram's limits, which apply to the text after parsing.
- Previewing or testing a bot's formatted messages. [`grammy-testing-library`](../grammy-testing-library) uses it for exactly this.

Despite the name, it doesn't depend on grammY. Its only dependency is [`@grammyjs/types`](https://github.com/grammyjs/types), for the Bot API's type definitions.

## Installation

```shell
npm install grammy-markdown-v2-parser
```

## Usage

`parseMarkdownV2(markdown)` returns an object with:

- `text`: the message as the user would see it, without any formatting characters.
- `entities`: the formatting, as Bot API `MessageEntity` objects sorted by `offset`.

You can pass the result straight to the Bot API in place of `parse_mode`:

```ts
const { text, entities } = parseMarkdownV2("*Hello* _world_");
await bot.api.sendMessage(chatId, text, { entities });
```

Like the Bot API, `offset` and `length` count UTF-16 code units, which is how JavaScript measures string length. An emoji like `👍` has a length of 2.

The parser supports everything MarkdownV2 does, including nested entities:

| Markdown                                      | Entity                  |
| --------------------------------------------- | ----------------------- |
| `*bold*`                                      | `bold`                  |
| `_italic_`                                    | `italic`                |
| `__underline__`                               | `underline`             |
| `~strikethrough~`                             | `strikethrough`         |
| `\|\|spoiler\|\|`                             | `spoiler`               |
| `` `code` ``                                  | `code`                  |
| ` ```language\ncode``` `                      | `pre`                   |
| `[text](https://example.com)`                 | `text_link`             |
| `[text](tg://user?id=123456789)`              | `text_mention`          |
| `![👍](tg://emoji?id=5368324170671202286)`    | `custom_emoji`          |
| `![22:45](tg://time?unix=1647531900&format=t)` | `date_time`             |
| `>quote`                                      | `blockquote`            |
| `**>quote\|\|`                                | `expandable_blockquote` |

A `text_mention` entity only knows the ID from its link, so its `user` is `{ id }` rather than a full Bot API `User`.

Links that Telegram wouldn't accept, such as `javascript:` URLs, keep their text but lose the link, just as they would on Telegram.

## Errors

When Telegram would reject the text, `parseMarkdownV2` throws a `MarkdownV2ParseError` with the same message Telegram gives:

```ts
import { MarkdownV2ParseError, parseMarkdownV2 } from "grammy-markdown-v2-parser";

try {
  parseMarkdownV2("Hello.");
} catch (error) {
  if (error instanceof MarkdownV2ParseError) {
    console.log(error.message);
    // Character '.' is reserved and must be escaped with the preceding '\'
  }
}
```

Telegram reports positions as UTF-8 byte offsets, so these messages do too. `👍 *bold` fails with `Can't find end of Bold entity at byte offset 5`, since `👍` takes 4 bytes in UTF-8.

## Differences from Telegram

The parser matches Telegram's in what it accepts and how it formats text. That said, there are a few places where the result can still differ from the message Telegram stores:

- After parsing, Telegram cleans up the result, for example trimming leading and trailing whitespace. This package returns the parser's output without that step, so a message ending in a code block keeps its final newline here.
- Telegram normalizes link URLs with its own URL checker. This package uses the standard `URL` class instead, so unusual URLs may be written differently in the resulting `text_link`.
