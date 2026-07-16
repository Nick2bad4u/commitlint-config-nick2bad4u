# Repository Instructions

This repository publishes `commitlint-config-nick2bad4u`.
Treat the hybrid header grammar, parser correspondence, type list, preset rules, and factory options as public package surfaces.

## Priorities

- Keep `emoji [type] Subject` compatible with established Nick2bad4u commit history.
- Parse `type`, optional `scope`, breaking marker, and `subject` before applying built-in rules.
- Let the flexible preset accept meaningful alternate Gitmoji while the strict preset enforces canonical mappings.
- Keep repository-specific scope enums in consumer factories, not the package default.
- Validate the packed config through the real commitlint loader and CLI before release.

## Commands

```sh
npm run build:runtime
npm run typecheck
npm test
npm run release:verify
```
