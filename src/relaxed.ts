import type { UserConfig } from "@commitlint/types";

import { createHybridCommitlintConfig } from "./config.js";

const base = createHybridCommitlintConfig({ headerMaxLength: 120 });

/** Hybrid syntax and type validation with body/footer style warnings disabled. */
const relaxedHybridCommitlintConfig: UserConfig = {
    ...base,
    rules: {
        ...base.rules,
        "body-leading-blank": [0],
        "body-max-line-length": [0],
        "footer-leading-blank": [0],
        "footer-max-line-length": [0],
    },
};

export default relaxedHybridCommitlintConfig;
