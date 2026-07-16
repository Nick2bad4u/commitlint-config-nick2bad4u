import nickTwoBadFourU from "eslint-config-nick2bad4u";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nickTwoBadFourU.configs.all,

    // This is a Commitlint rule, not an ESLint rule implementation.
    {
        files: ["src/config.ts"],
        rules: {
            "eslint-plugin/prefer-message-ids": "off",
            "eslint-plugin/prefer-object-rule": "off",
            "eslint-plugin/require-meta-docs-description": "off",
            "eslint-plugin/require-meta-docs-recommended": "off",
            "eslint-plugin/require-meta-docs-url": "off",
            "eslint-plugin/require-meta-schema": "off",
            "eslint-plugin/require-meta-type": "off",
        },
    },
    // Commitlint's parser API requires positional capture groups.
    {
        files: ["src/parser.ts"],
        rules: {
            "security/detect-unsafe-regex": "off",
        },
    },
];

export default config;
