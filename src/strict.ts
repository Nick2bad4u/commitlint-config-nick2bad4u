import type { UserConfig } from "@commitlint/types";

import { createHybridCommitlintConfig } from "./config.js";

/** Canonical emoji-to-type mapping plus the full hybrid rule set. */
const strictHybridCommitlintConfig: UserConfig = createHybridCommitlintConfig({
    strictEmoji: true,
});

export default strictHybridCommitlintConfig;
