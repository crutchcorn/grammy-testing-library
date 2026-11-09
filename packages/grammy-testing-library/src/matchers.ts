/* eslint-disable @typescript-eslint/no-empty-object-type */
import { expect } from "vitest";
import { prettyChat } from "./queries.ts";
import { getMessageStore } from "./store.ts";

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

expect.extend({
  toBeInTheChat(received: unknown) {
    const hint = this.utils.matcherHint(
      `${this.isNot ? ".not" : ""}.toBeInTheChat`,
      "received",
      "",
    );
    const store = getMessageStore(received);

    if (!store) {
      return {
        pass: false,
        message: () =>
          `${hint}\n\nReceived value must be a message from the chat, but got: ${this.utils.printReceived(received)}`,
      };
    }

    const pass = store.messages.some((message) => message === received);
    return {
      pass,
      message: () =>
        pass
          ? `${hint}\n\nExpected the message not to be in the chat, but it is:\n\n${prettyChat(store)}`
          : `${hint}\n\nExpected the message to be in the chat, but it is no longer there:\n\n${prettyChat(store)}`,
    };
  },
});
