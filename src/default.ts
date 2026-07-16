import type { UserConfig } from "@commitlint/types";

import { createHybridCommitlintConfig } from "./config.js";

/** Flexible Gitmoji default: types are fixed, meaningful emoji may vary. */
export const hybridCommitlintConfig: UserConfig =
    createHybridCommitlintConfig();

export default hybridCommitlintConfig;
