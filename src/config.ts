import type {
    Plugin,
    Rule,
    RuleConfigCondition,
    UserConfig,
} from "@commitlint/types";

import { arrayIncludes, isDefined } from "ts-extras";

import { hybridHeaderPattern, hybridParserPreset } from "./parser.js";

/** Conventional types supported by the hybrid default. */
export const hybridCommitTypes: readonly string[] = Object.freeze([
    "build",
    "chore",
    "ci",
    "config",
    "deps",
    "docs",
    "feat",
    "fix",
    "lint",
    "perf",
    "refactor",
    "release",
    "revert",
    "security",
    "style",
    "test",
]);

/** Canonical emoji choices used by the strict preset. */
export const canonicalTypeEmoji: Readonly<Record<string, string>> =
    Object.freeze({
        build: "🔧",
        chore: "🧹",
        ci: "👷",
        config: "⚙️",
        deps: "⬆️",
        docs: "📝",
        feat: "✨",
        fix: "🛠️",
        lint: "🧹",
        perf: "⚡",
        refactor: "🚜",
        release: "🚀",
        revert: "⏪",
        security: "🔒",
        style: "🎨",
        test: "🧪",
    });

/** Customization accepted by the hybrid config factory. */
export interface HybridCommitlintOptions {
    readonly allowedScopes?: readonly string[];
    readonly headerMaxLength?: number;
    readonly helpUrl?: string;
    readonly strictEmoji?: boolean;
    readonly typeEmoji?: Readonly<Record<string, string>>;
    readonly types?: readonly string[];
}

const emojiPattern = /^[\p{Extended_Pictographic}\p{Regional_Indicator}]/v;

const validateList = (values: readonly string[], label: string): string[] => {
    const normalized = values.map((value) => value.trim());
    if (normalized.some((value) => !value)) {
        throw new TypeError(`${label} must not contain empty values.`);
    }
    return [...new Set(normalized)];
};

const hasListValue = (values: readonly string[], value: string): boolean =>
    arrayIncludes(values, value);

const createHybridHeaderRule =
    (
        types: readonly string[],
        scopes: readonly string[] | undefined,
        requiresStrictEmoji: boolean,
        typeEmoji: Readonly<Record<string, string>>
    ): Rule =>
    (
        parsed,
        when: RuleConfigCondition = "always"
    ): readonly [boolean, string] => {
        const header = parsed.header ?? "";
        const match = hybridHeaderPattern.exec(header);
        let isValid = match !== null;
        let message =
            "Header must use `emoji [type] Subject` or `emoji [type](scope)! Subject`.";

        if (match) {
            const emoji = match[1] ?? "";
            const type = match[2] ?? "";
            const scope = match[3];

            if (!emojiPattern.test(emoji)) {
                isValid = false;
                message = "Header must start with a Unicode emoji token.";
            } else if (!hasListValue(types, type)) {
                isValid = false;
                message = `Unknown commit type '${type}'.`;
            } else if (
                isDefined(scopes) &&
                isDefined(scope) &&
                !hasListValue(scopes, scope)
            ) {
                isValid = false;
                message = `Unknown commit scope '${scope}'.`;
            } else if (isDefined(scope) && scopes?.length === 0) {
                isValid = false;
                message = "This preset does not permit a commit scope.";
            } else if (requiresStrictEmoji && typeEmoji[type] !== emoji) {
                isValid = false;
                message = `Type '${type}' must use ${typeEmoji[type] ?? "its configured emoji"}.`;
            }
        }

        return [when === "never" ? !isValid : isValid, message];
    };

/** Create a fully parsed Gitmoji/Conventional Commit configuration. */
export function createHybridCommitlintConfig(
    options: HybridCommitlintOptions = {}
): UserConfig {
    const types = validateList(
        options.types ?? hybridCommitTypes,
        "Commit types"
    );
    const scopes = isDefined(options.allowedScopes)
        ? validateList(options.allowedScopes, "Commit scopes")
        : undefined;
    const requiresStrictEmoji = options.strictEmoji ?? false;
    const typeEmoji = options.typeEmoji ?? canonicalTypeEmoji;
    const plugin: Plugin = {
        rules: {
            "hybrid-header-format": createHybridHeaderRule(
                types,
                scopes,
                requiresStrictEmoji,
                typeEmoji
            ),
        },
    };

    return {
        defaultIgnores: true,
        extends: ["@commitlint/config-conventional"],
        helpUrl:
            options.helpUrl ??
            "https://github.com/Nick2bad4u/commitlint-config-nick2bad4u#commit-format",
        parserPreset: hybridParserPreset,
        plugins: [plugin],
        rules: {
            "body-leading-blank": [1, "always"],
            "body-max-line-length": [
                2,
                "always",
                160,
            ],
            "footer-leading-blank": [1, "always"],
            "footer-max-line-length": [
                2,
                "always",
                120,
            ],
            "header-max-length": [
                2,
                "always",
                options.headerMaxLength ?? 100,
            ],
            "header-min-length": [
                2,
                "always",
                10,
            ],
            "header-trim": [2, "always"],
            "hybrid-header-format": [2, "always"],
            "scope-case": [
                2,
                "always",
                "kebab-case",
            ],
            "subject-case": [0],
            "subject-empty": [2, "never"],
            "subject-full-stop": [
                2,
                "never",
                ".",
            ],
            "subject-max-length": [
                2,
                "always",
                100,
            ],
            "subject-min-length": [
                2,
                "always",
                3,
            ],
            "type-case": [
                2,
                "always",
                "lower-case",
            ],
            "type-empty": [2, "never"],
            "type-enum": [
                2,
                "always",
                types,
            ],
        },
    };
}

export default createHybridCommitlintConfig;
