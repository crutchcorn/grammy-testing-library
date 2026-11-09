# AGENTS.md

`grammy-testing-library` tests grammY bots in the style of DOM Testing Library: tests act as a user, and assertions check what appears in the chat.

## Checks

- Typecheck: `pnpm exec tsc --noEmit -p .`
- Lint: `pnpm exec eslint .`
- Test: `pnpm exec vitest run`

## Conventions

- Keep an explicit stub that throws `new Error("Not implemented")` for every Bot API method in `src/methods/map.ts`. Do not replace them with a proxy or a `Partial` fallback; the stubs make unsupported methods visible.
- Keep `@grammyjs/types` on the same version that grammY depends on (see `node_modules/grammy/package.json`). A mismatch installs duplicate types and leaves `methodMap` missing methods.
- Method handlers have the signature `(props, server: BotServer)`. Resolve the target chat with `findChat(server, props.chat_id)`. `render()` installs a single transformer per bot (a `WeakMap` in `src/index.ts`) that dispatches through the exported `methodMap`.
- Do not name store helpers after Bot API methods (for example, `getChat`). They collide with the stubs in `src/methods/map.ts`.

## Test isolation

- Each `render()` creates a user with a unique ID and that user's private chat, so renders can't see each other's messages and `test.concurrent` is safe.
- Do not use a global `afterEach` or `onTestFinished` for per-test state. Vitest tracks the current test in one global variable, which is unreliable under `test.concurrent`.

## Git

- Never push without explicit permission.
- Never rebase, force push, or otherwise rewrite published history.
