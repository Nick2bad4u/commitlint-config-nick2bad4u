import type { ParserPreset } from "@commitlint/types";

/**
 * Hybrid header grammar: `emoji [type](optional-scope)! optional subject`.
 *
 * Capture groups correspond to emoji, type, scope, breaking marker, and
 * subject.
 */
export const hybridHeaderPattern: Readonly<RegExp> =
    /^(?<emoji>\S+) \[(?<type>[a-z][\-0-9a-z]*)\](?:\((?<scope>[0-9a-z][\-.\/0-9a-z]*)\))?(?<breaking>!)? (?<subject>.+)$/v;

/** Parser correspondence consumed by conventional-commits-parser. */
export const hybridHeaderCorrespondence: readonly string[] = Object.freeze([
    "emoji",
    "type",
    "scope",
    "breaking",
    "subject",
]);

/** Inline parser preset that makes Commitlint's built-in rules see real fields. */
export const hybridParserPreset: ParserPreset = Object.freeze({
    name: "commitlint-config-nick2bad4u",
    parserOpts: {
        headerCorrespondence: hybridHeaderCorrespondence,
        headerPattern: hybridHeaderPattern,
        noteKeywords: ["BREAKING CHANGE", "BREAKING-CHANGE"],
    },
});

export default hybridParserPreset;
