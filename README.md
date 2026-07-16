# commitlint-config-nick2bad4u

[![Continuous Integration](https://github.com/Nick2bad4u/commitlint-config-nick2bad4u/actions/workflows/ci.yml/badge.svg)](https://github.com/Nick2bad4u/commitlint-config-nick2bad4u/actions/workflows/ci.yml)

A parsed, enforceable [Commitlint](https://commitlint.js.org/) configuration for Nick2bad4u's hybrid Gitmoji and Conventional Commit style.

## Install

```sh
npm install --save-dev @commitlint/cli commitlint-config-nick2bad4u
```

```js
// commitlint.config.mjs
export default {
 extends: ["commitlint-config-nick2bad4u"],
};
```

## Commit format

```text
<emoji> [<type>] Subject
<emoji> [<type>](<scope>) Subject
<emoji> [<type>](<scope>)! Breaking subject
```

Examples:

```text
✨ [feat] Add dark mode
🛡️ [fix] Preserve durable credentials
🔒 [security](release) Require signed artifacts
✨ [feat](api)! Replace the public response contract
```

The parser maps the bracketed value to Commitlint's real `type`, the optional parenthesized value to `scope`, and the remaining text to `subject`. Built-in type, scope, subject, length, body, and footer rules therefore validate the documented syntax instead of silently receiving empty fields.

## Presets

| Export                                 | Behavior                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| Package root                           | Flexible Gitmoji: valid types are fixed, meaningful alternate emoji are allowed |
| `commitlint-config-nick2bad4u/strict`  | Requires the canonical emoji for each type                                      |
| `commitlint-config-nick2bad4u/relaxed` | Keeps header grammar/type validation but disables body/footer style warnings    |
| `commitlint-config-nick2bad4u/factory` | Builds a consumer-specific type, scope, length, and emoji policy                |
| `commitlint-config-nick2bad4u/parser`  | Exposes the parser preset and grammar                                           |

The flexible root is intentional. Established repositories often use multiple meaningful Gitmoji with the same conventional type, such as both `🛠️ [fix]` and `🛡️ [fix]`.

## Types

The default supports:

`build`, `chore`, `ci`, `config`, `deps`, `docs`, `feat`, `fix`, `lint`, `perf`, `refactor`, `release`, `revert`, `security`, `style`, and `test`.

## Repository scopes

Scope enums are repository-specific, so the shared default accepts any kebab-case scope. Use the factory when a repository has a closed vocabulary:

```js
// commitlint.config.mjs
import { createHybridCommitlintConfig } from "commitlint-config-nick2bad4u/factory";

export default createHybridCommitlintConfig({
 allowedScopes: ["api", "build", "database", "docs", "release", "ui"],
 headerMaxLength: 110,
});
```

An explicit empty `allowedScopes` array forbids scoped headers. Omitting the option allows any kebab-case scope.

## Strict emoji mapping

The strict preset uses these canonical pairs:

| Type       | Emoji | Type       | Emoji |
| ---------- | ----- | ---------- | ----- |
| `build`    | 🔧    | `chore`    | 🧹    |
| `ci`       | 👷    | `config`   | ⚙️    |
| `deps`     | ⬆️    | `docs`     | 📝    |
| `feat`     | ✨    | `fix`      | 🛠️    |
| `lint`     | 🧹    | `perf`     | ⚡    |
| `refactor` | 🚜    | `release`  | 🚀    |
| `revert`   | ⏪    | `security` | 🔒    |
| `style`    | 🎨    | `test`     | 🧪    |

## Validation

```sh
npm run release:verify
```

The suite checks flexible and strict emoji policy, parsing, optional/breaking scopes, invalid headers, custom scope/type options, public types and exports, and a real Commitlint CLI consumer load.
