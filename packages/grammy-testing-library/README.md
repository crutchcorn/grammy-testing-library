# grammy-testing-library

Test your [grammY](https://grammy.dev) bots the way people actually use them: send a message, press a button, and check what shows up in the chat.

```ts
import { expect, test } from "vitest";
import { render } from "grammy-testing-library";
import { bot } from "../src/bot.ts";

test("Greets the user", async () => {
  const { userEvent, findByText } = render(bot);

  await userEvent.sendMessage("/start");

  expect(await findByText("Hello World")).toBeInTheChat();
});
```

If you've used [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro), this should feel familiar. Your tests don't need to know which grammY middleware handled an update or which Bot API method it called. They only describe what the user did and what they saw. That way, refactoring your bot's internals won't break your tests unless the conversation itself changes.

## Installation

The library runs on [Vitest](https://vitest.dev), so install both as dev dependencies alongside `grammy`:

```shell
npm install --save-dev grammy-testing-library vitest
```

## How it works

`render(bot)` puts a fake Telegram server in front of your bot. Bot API calls like `sendMessage` never reach the network. Instead, they update an in-memory chat your tests can look at. This means you don't need a real bot token, but grammY still requires a non-empty one:

```ts
export const bot = new Bot("test-token");
```

Export the bot without calling `bot.start()` so your tests can import it without starting long polling.

Each `render()` call creates a new user and a private chat between them and your bot. Messages from one render never show up in another, so tests can safely share a single `bot`.

## Acting as the user

`render()` returns a `userEvent` object for the things a user can do:

- `sendMessage(text)` sends a text message to the bot. Text starting with a command like `/start` gets a `bot_command` entity, just like a Telegram client adds, so `bot.command()` handlers run.
- `pressInlineButton(message, text)` presses the inline keyboard button labelled `text` on `message`, sending your bot a `callback_query`.

```ts
test("Choosing a language", async () => {
  const { userEvent, findByText } = render(bot);

  await userEvent.sendMessage("/language");
  const question = await findByText("What language are you trying to learn?");
  await userEvent.pressInlineButton(question, "Spanish");

  expect(await findByText("¡Vamos!")).toBeInTheChat();
});
```

Both return a promise that resolves once your bot has finished handling the update. If your bot throws while handling it, the promise rejects with grammY's `BotError` wrapping that error.

## Finding messages

Queries search the messages in the chat by their text:

- `getByText(text)` returns the matching message right away, or throws if no message, or more than one, matches.
- `findByText(text)` waits for exactly one match to appear, which is handy when your bot replies after the update handler has returned.

`text` can be a string or a regular expression. Strings must match the whole message, after trimming it and collapsing any runs of whitespace into a single space. Use a regular expression to match part of a message:

```ts
await findByText(/Vamos/);
```

When a query fails, the error shows the whole chat so you can see what the bot sent instead:

```
Unable to find a message with the text: Goodbye

User: /start
Bot: Hello World
```

## Checking the chat

Importing the library adds a `toBeInTheChat()` matcher to Vitest's `expect`. It passes while a message is still in the chat, which makes it useful for checking deletions:

```ts
test("Destroying a secret", async () => {
  const { userEvent, findByText } = render(bot);

  await userEvent.sendMessage("/secret");
  const secret = await findByText("This message will self-destruct");
  await userEvent.pressInlineButton(secret, "Destroy");

  expect(secret).not.toBeInTheChat();
});
```

Messages are updated in place when your bot edits them, so a message you queried earlier always shows its current text and keyboard.

## Clearing the chat

Long conversations can make it hard to query a message whose text repeats. `clear()` removes every message from the chat, while `clear({ keepLast: true })` keeps only the most recent one:

```ts
await userEvent.sendMessage("/start");
await userEvent.sendMessage("/start");
clear({ keepLast: true });

expect(await findByText("Hello World")).toBeInTheChat();
```

## Formatted messages

When your bot sends a message with `parse_mode: "MarkdownV2"`, the chat stores the text the user would actually see, along with its formatting entities. Query the visible text, not the Markdown:

```ts
bot.command("welcome", (ctx) =>
  ctx.reply("*Welcome*, I'm Ida\\!", { parse_mode: "MarkdownV2" }),
);

test("Welcomes the user", async () => {
  const { userEvent, findByText } = render(bot);

  await userEvent.sendMessage("/welcome");

  expect(await findByText("Welcome, I'm Ida!")).toBeInTheChat();
});
```

Invalid MarkdownV2 fails just like it would on Telegram, with a `GrammyError` such as `Bad Request: can't parse entities: Character '!' is reserved and must be escaped with the preceding '\'`. Parsing is handled by [`grammy-markdown-v2-parser`](../grammy-markdown-v2-parser), which you can also use on its own.

The `HTML` and legacy `Markdown` parse modes aren't supported yet.

## Concurrent tests

Since every render gets its own chat, tests can run with `test.concurrent`. Call `cleanup()` when a test finishes to delete its chat. Any later API calls your bot makes to that chat fail with `chat not found`, which surfaces work that's still running after the test ended.

Register `cleanup` with the `onTestFinished` from the test's context rather than the one imported from `vitest`, as the imported one can't tell concurrent tests apart:

```ts
describe.concurrent("Languages", () => {
  test("Choosing Spanish", async ({ expect, onTestFinished }) => {
    const { userEvent, cleanup, findByText } = render(bot);
    onTestFinished(cleanup);

    await userEvent.sendMessage("/language");
    const question = await findByText("What language are you trying to learn?");
    await userEvent.pressInlineButton(question, "Spanish");

    expect(await findByText("¡Vamos!")).toBeInTheChat();
  });
});
```

Concurrent tests should also use the `expect` from the test's context, so that each assertion is reported against the right test.

## Supported Bot API methods

The fake server currently implements:

- `getMe`
- `sendMessage`
- `editMessageText`
- `editMessageReplyMarkup`
- `deleteMessage`
- `answerCallbackQuery`

Calling any other method throws a `Not implemented` error, so a test never silently passes against behavior the library can't simulate yet.
