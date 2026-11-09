# grammy-testing-library

## 0.0.2

### Patch Changes

- 849a690: Support `parse_mode: "MarkdownV2"` in `sendMessage` and `editMessageText`, so formatted replies appear in the chat as plain text with their message entities.
- d92b758: Publish compiled JavaScript and type declarations, with `exports`, `main`, and `types` pointing at them, so the packages can be imported from `node_modules`. Both now declare Vitest 5's supported Node.js versions in `engines`.
- 849a690: Make `vitest` a peer dependency (`^5.0.0`) so the library's matchers register on your project's own Vitest instance.
- Updated dependencies [d92b758]
  - grammy-markdown-v2-parser@0.0.2
