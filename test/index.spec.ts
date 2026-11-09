import { test, expect } from "vitest";
import { render } from "../src/index.ts";
import { Bot, InlineKeyboard } from "grammy";

const bot = new Bot("test-token");

bot.command("start", async (ctx) => {
  await ctx.reply("Hello World");
});

bot.command("language", async (ctx) => {
  await ctx.reply("What language are you trying to learn?", {
    reply_markup: new InlineKeyboard()
      .text("Spanish", "language:es")
      .text("French", "language:fr"),
  });
});

bot.callbackQuery(/^language:/, async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(
    ctx.callbackQuery.data === "language:es" ? "¡Vamos!" : "Allons-y !",
  );
});

bot.command("secret", async (ctx) => {
  await ctx.reply("This message will self-destruct", {
    reply_markup: new InlineKeyboard().text("Destroy", "destroy"),
  });
});

bot.callbackQuery("destroy", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.deleteMessage();
});

test("Replies to the `/start` command", async () => {
  const { userEvent, findByText } = render(bot);

  await userEvent.sendMessage("/start");

  expect(await findByText("Hello World")).toBeInTheChat();
});

test("Pressing an inline button edits the message and removes its keyboard", async () => {
  const { userEvent, findByText } = render(bot);

  await userEvent.sendMessage("/language");
  const question = await findByText("What language are you trying to learn?");
  await userEvent.pressInlineButton(question, "Spanish");

  expect(await findByText("¡Vamos!")).toBeInTheChat();
  await expect(
    userEvent.pressInlineButton(question, "Spanish"),
  ).rejects.toThrow(/Unable to find a button/);
});

test("Pressing an inline button can delete the message", async () => {
  const { userEvent, findByText } = render(bot);

  await userEvent.sendMessage("/secret");
  const secret = await findByText("This message will self-destruct");
  await userEvent.pressInlineButton(secret, "Destroy");

  expect(secret).not.toBeInTheChat();
});

test("`clear` hides earlier messages from queries", async () => {
  const { userEvent, clear, findByText } = render(bot);

  await userEvent.sendMessage("/start");
  const firstGreeting = await findByText("Hello World");
  await userEvent.sendMessage("/start");
  clear({ keepLast: true });

  expect(firstGreeting).not.toBeInTheChat();
  expect(await findByText("Hello World")).toBeInTheChat();
});

test("Messages from an earlier render are no longer in the chat", async () => {
  const first = render(bot);
  await first.userEvent.sendMessage("/start");
  const greeting = await first.findByText("Hello World");

  render(bot);

  expect(greeting).not.toBeInTheChat();
});

test.skip("Is able to handle `/start` command", async () => {
  const { userEvent, clear, findByText } = render(bot);

  // TODO: Should this be `sendCommand` or `sendMessage`?
  await userEvent.sendMessage("/start");

  // TODO: How does Markdown work in this instance?
  expect(await findByText(/I'm Ida/)).toBeInTheChat();

  const langLearnMessage = await findByText(
    /What language are you trying to learn\?/,
  );

  await userEvent.pressInlineButton(langLearnMessage, "Spanish");

  expect(await findByText(/¡Vamos!/)).toBeInTheChat();

  clear({ keepLast: true });

  const howOftenCorrectMessage = await findByText(
    /How often should I correct your spelling and grammar\?/,
  );

  await userEvent.pressInlineButton(howOftenCorrectMessage, "Never");

  expect(await findByText(/¡Vamos!/)).toBeInTheChat();

  clear({ keepLast: true });
});
