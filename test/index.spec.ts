import { test, expect } from "vitest";
import { render } from "../src/index.ts";
import { Bot } from "grammy";

const bot = new Bot("");

bot.on("message", async (ctx) => {
  await ctx.reply("Hello World");
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
