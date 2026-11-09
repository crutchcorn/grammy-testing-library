import { describe, expect, test } from "vitest";
import { MarkdownV2ParseError, parseMarkdownV2 } from "../src/index.ts";

describe("inline formatting", () => {
  test("bold with an escaped asterisk", () => {
    expect(parseMarkdownV2("*bold \\*text*")).toEqual({
      text: "bold *text",
      entities: [{ type: "bold", offset: 0, length: 10 }],
    });
  });

  test("italic, underline, strikethrough, and spoiler", () => {
    expect(
      parseMarkdownV2("_italic_ __underline__ ~strike~ ||spoiler||"),
    ).toEqual({
      text: "italic underline strike spoiler",
      entities: [
        { type: "italic", offset: 0, length: 6 },
        { type: "underline", offset: 7, length: 9 },
        { type: "strikethrough", offset: 17, length: 6 },
        { type: "spoiler", offset: 24, length: 7 },
      ],
    });
  });

  test("nested entities from Telegram's documentation", () => {
    expect(
      parseMarkdownV2(
        "*bold _italic bold ~italic bold strikethrough ||italic bold strikethrough spoiler||~ __underline italic bold___ bold*",
      ),
    ).toEqual({
      text: "bold italic bold italic bold strikethrough italic bold strikethrough spoiler underline italic bold bold",
      entities: [
        { type: "bold", offset: 0, length: 103 },
        { type: "italic", offset: 5, length: 93 },
        { type: "strikethrough", offset: 17, length: 59 },
        { type: "spoiler", offset: 43, length: 33 },
        { type: "underline", offset: 77, length: 21 },
      ],
    });
  });

  test("escaped reserved characters are plain text", () => {
    expect(parseMarkdownV2("1 \\+ 1 \\= 2\\!")).toEqual({
      text: "1 + 1 = 2!",
      entities: [],
    });
  });
});

describe("links", () => {
  test("inline URL", () => {
    expect(parseMarkdownV2("[inline URL](http://www.example.com/)")).toEqual({
      text: "inline URL",
      entities: [
        {
          type: "text_link",
          offset: 0,
          length: 10,
          url: "http://www.example.com/",
        },
      ],
    });
  });

  test("inline mention of a user", () => {
    expect(
      parseMarkdownV2("[inline mention of a user](tg://user?id=123456789)"),
    ).toEqual({
      text: "inline mention of a user",
      entities: [
        {
          type: "text_mention",
          offset: 0,
          length: 24,
          user: { id: 123456789 },
        },
      ],
    });
  });

  test("an unsupported link scheme keeps the text without a link", () => {
    expect(parseMarkdownV2("[click](javascript:alert\\(1\\))")).toEqual({
      text: "click",
      entities: [],
    });
  });
});

describe("custom emoji and dates", () => {
  test("custom emoji", () => {
    expect(parseMarkdownV2("![👍](tg://emoji?id=5368324170671202286)")).toEqual(
      {
        text: "👍",
        entities: [
          {
            type: "custom_emoji",
            offset: 0,
            length: 2,
            custom_emoji_id: "5368324170671202286",
          },
        ],
      },
    );
  });

  test("date and time", () => {
    expect(
      parseMarkdownV2(
        "![22:45 tomorrow](tg://time?unix=1647531900&format=wDT)",
      ),
    ).toEqual({
      text: "22:45 tomorrow",
      entities: [
        {
          type: "date_time",
          offset: 0,
          length: 14,
          unix_time: 1647531900,
          date_time_format: "wDT",
        },
      ],
    });
  });
});

describe("code", () => {
  test("inline code", () => {
    expect(parseMarkdownV2("`inline fixed-width code`")).toEqual({
      text: "inline fixed-width code",
      entities: [{ type: "code", offset: 0, length: 23 }],
    });
  });

  test("a code block with a language doesn't need escaping inside", () => {
    expect(parseMarkdownV2("```python\nprint('hi')\n```")).toEqual({
      text: "print('hi')\n",
      entities: [{ type: "pre", offset: 0, length: 12, language: "python" }],
    });
  });
});

describe("block quotations", () => {
  test("multi-line block quotation", () => {
    expect(
      parseMarkdownV2(">Block quotation started\n>Block quotation continued"),
    ).toEqual({
      text: "Block quotation started\nBlock quotation continued",
      entities: [{ type: "blockquote", offset: 0, length: 49 }],
    });
  });

  test("a block quotation ends at a line without `>`", () => {
    expect(parseMarkdownV2(">Quote\nNot quoted")).toEqual({
      text: "Quote\nNot quoted",
      entities: [{ type: "blockquote", offset: 0, length: 6 }],
    });
  });

  test("expandable block quotation", () => {
    expect(parseMarkdownV2("**>Expandable quotation\n>Hidden part||")).toEqual({
      text: "Expandable quotation\nHidden part",
      entities: [{ type: "expandable_blockquote", offset: 0, length: 32 }],
    });
  });
});

describe("errors match Telegram's", () => {
  test("unescaped reserved character", () => {
    expect(() => parseMarkdownV2("Hello.")).toThrow(
      new MarkdownV2ParseError(
        "Character '.' is reserved and must be escaped with the preceding '\\'",
      ),
    );
  });

  test("unclosed entity reports its byte offset", () => {
    expect(() => parseMarkdownV2("👍 *bold")).toThrow(
      new MarkdownV2ParseError(
        "Can't find end of Bold entity at byte offset 5",
      ),
    );
  });

  test("unclosed URL", () => {
    expect(() => parseMarkdownV2("[link](http://example.com")).toThrow(
      new MarkdownV2ParseError("Can't find end of a URL at byte offset 7"),
    );
  });
});
