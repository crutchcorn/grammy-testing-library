# AGENTS.md

`grammy-testing-library` tests grammY bots in the style of DOM Testing Library: tests act as a user, and assertions check what appears in the chat.

## Layout

An Nx + pnpm workspace monorepo.

- `packages/grammy-testing-library`: the published library, with its source and tests.
- `packages/grammy-markdown-v2-parser`: a standalone port of tdlib's `parse_markdown_v2`, which turns MarkdownV2 into text and message entities. It must not depend on the testing library. When changing its parsing, check tdlib's `td/telegram/MessageEntity.cpp` rather than CommonMark behavior.
- `packages/config` (private): the shared `tsconfig.base.json` and `eslint.base.mjs`. Each project extends them from its own `tsconfig.json` and `eslint.config.mjs`.

## Checks

Run from the repository root; Nx runs each project's script of the same name.

- Format: `pnpm format` (CI runs `pnpm format:check`)
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint`
- Test: `pnpm test`
- Build: `pnpm build`

Published packages build to `dist` with tsdown, and their `exports` point there. Workspace dependents resolve each other through `dist`, so Nx builds dependencies before `lint`, `typecheck`, and `test`.

## Releases

- Add a changeset with `pnpm changeset` for any change that affects a published package's users, choosing the bump and writing a user-facing summary. Skip it for docs, tests, CI, and private packages.
- Don't bump versions or edit changelogs by hand; the release workflow runs `pnpm version-packages`.

## CI

- `.github/workflows/ci.yml` checks formatting, linting, tests, and the build; `.github/workflows/zizmor.yml` audits the workflows with zizmor.
- `.github/workflows/release.yml` uses Changesets to open a version pull request, then publishes to npm through trusted publishing (OIDC) once it merges.
- Keep actions pinned to commit SHAs. Upgrade them with `pnpm update -L --include-github-actions "actions/*" "pnpm/*" "zizmorcore/*" "changesets/*"`.
- Node's version lives in `.node-version` and pnpm's in the root `packageManager` field; CI reads both.

## Conventions

Paths below are relative to `packages/grammy-testing-library`.

- Keep an explicit stub that throws `new Error("Not implemented")` for every Bot API method in `src/methods/map.ts`. Do not replace them with a proxy or a `Partial` fallback; the stubs make unsupported methods visible.
- Keep `@grammyjs/types` on the same version that grammY depends on (see `node_modules/grammy/package.json`). A mismatch installs duplicate types and leaves `methodMap` missing methods.
- Method handlers have the signature `(props, server: BotServer)`. Resolve the target chat with `findChat(server, props.chat_id)`. `render()` installs a single transformer per bot (a `WeakMap` in `src/index.ts`) that dispatches through the exported `methodMap`.
- Do not name store helpers after Bot API methods (for example, `getChat`). They collide with the stubs in `src/methods/map.ts`.

## Test isolation

- Each `render()` creates a user with a unique ID and that user's private chat, so renders can't see each other's messages and `test.concurrent` is safe.
- `render()` returns `cleanup`, which removes that chat. Register it with the test context's `onTestFinished` (`test("...", ({ onTestFinished }) => ...)`), not the global import.
- Do not use a global `afterEach` or `onTestFinished` for per-test state. Vitest tracks the current test in one global variable, which is unreliable under `test.concurrent`.

## Git

- Never push without explicit permission.
- Never rebase, force push, or otherwise rewrite published history.
