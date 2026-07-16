import type { UserConfig } from "@commitlint/types";

import lint from "@commitlint/lint";
import load from "@commitlint/load";
import { spawnSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
    canonicalTypeEmoji,
    createHybridCommitlintConfig,
    hybridCommitTypes,
} from "../src/config.js";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
type CommitlintLintOptions = NonNullable<Parameters<typeof lint>[2]>;

const lintMessage = async (
    message: string,
    config?: UserConfig
): Promise<Awaited<ReturnType<typeof lint>>> => {
    const loaded = await load(config, { cwd: repositoryRoot });
    return lint(message, loaded.rules, {
        defaultIgnores: loaded.defaultIgnores ?? true,
        ignores: loaded.ignores ?? [],
        parserOpts: loaded.parserPreset?.parserOpts as NonNullable<
            CommitlintLintOptions["parserOpts"]
        >,
        plugins: loaded.plugins,
    });
};

describe("hybrid commit parsing", () => {
    it.each([
        "✨ [feat] Add a reusable config factory",
        "🛡️ [fix] Preserve alternate meaningful Gitmoji",
        "🔒 [security](release) Harden artifact publication",
        "✨ [feat](api)! Replace the public contract",
    ])("accepts %s", async (message) => {
        expect.assertions(1);

        const result = await lintMessage(
            message,
            createHybridCommitlintConfig()
        );

        expect(result.valid).toBe(true);
    });

    it.each([
        "feat: conventional-only header",
        "feat [feat] Missing emoji",
        "✨ feat Missing brackets",
        "✨ [unknown] Unknown type",
        "not-an-emoji [feat] Invalid emoji token",
        "✨ [feat] Ends in a period.",
    ])("rejects %s", async (message) => {
        expect.assertions(2);

        const result = await lintMessage(
            message,
            createHybridCommitlintConfig()
        );

        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it("applies consumer-specific scope enums", async () => {
        expect.assertions(2);

        const config = createHybridCommitlintConfig({
            allowedScopes: ["api", "ui"],
        });

        expect(
            (await lintMessage("✨ [feat](api) Add endpoint", config)).valid
        ).toBe(true);
        expect(
            (await lintMessage("✨ [feat](database) Add endpoint", config))
                .valid
        ).toBe(false);
    });

    it("can forbid scopes with an explicit empty list", async () => {
        expect.assertions(1);

        const config = createHybridCommitlintConfig({ allowedScopes: [] });

        expect(
            (await lintMessage("✨ [feat](api) Add endpoint", config)).valid
        ).toBe(false);
    });

    it("validates custom type lists", () => {
        expect.assertions(3);
        expect(hybridCommitTypes).toContain("security");
        expect(canonicalTypeEmoji["fix"]).toBe("🛠️");
        expect(() => createHybridCommitlintConfig({ types: [""] })).toThrow(
            TypeError
        );
    });
});

describe("strict preset", () => {
    it("rejects empty custom types before creating a strict preset", () => {
        expect.assertions(1);

        expect(() =>
            createHybridCommitlintConfig({ strictEmoji: true, types: [" "] })
        ).toThrow(TypeError);
    });

    it("requires the canonical emoji for each type", async () => {
        expect.assertions(2);

        const strict = createHybridCommitlintConfig({ strictEmoji: true });

        expect(
            (await lintMessage("🛠️ [fix] Repair startup", strict)).valid
        ).toBe(true);
        expect(
            (await lintMessage("🛡️ [fix] Repair startup", strict)).valid
        ).toBe(false);
    });
});

describe("published config loading", () => {
    it("loads and validates through the real commitlint CLI", () => {
        expect.assertions(4);

        const cliPath = path.join(
            repositoryRoot,
            "node_modules",
            "@commitlint",
            "cli",
            "cli.js"
        );
        const configPath = path.join(
            repositoryRoot,
            "test",
            "fixtures",
            "commitlint.config.mjs"
        );
        const result = spawnSync(
            process.execPath,
            [
                cliPath,
                "--config",
                configPath,
            ],
            {
                cwd: repositoryRoot,
                encoding: "utf8",
                input: "✨ [feat] Load a published shareable config\n",
            }
        );

        expect(result.error).toBeUndefined();
        expect(result.status).toBe(0);
        expect(result.stdout).not.toContain("problem");
        expect(result.stderr).not.toContain("Cannot find module");
    });
});
