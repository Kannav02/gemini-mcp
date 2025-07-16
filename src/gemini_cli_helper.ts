import "dotenv/config";
import { $ } from "bun";
import { existsSync } from "fs";
import { resolve } from "path";
import type { GeminiCommandParams, CommandResult, GeminiError } from "./types.ts";

const gemini_cli_helper = async ({ command, workingDir }: GeminiCommandParams): Promise<CommandResult> => {
  const originalDir = process.cwd();

  try {
    if (workingDir) {
      const resolvedDir = resolve(workingDir);
      if (!existsSync(resolvedDir)) {
        const dirError: GeminiError = new Error(`Directory does not exist: ${resolvedDir}`) as GeminiError;
        dirError.code = 'DIRECTORY_NOT_FOUND';
        throw dirError;
      }
      process.chdir(resolvedDir);
    }

    if (!/^[a-zA-Z0-9\s\-_.,/!?'"()\[\]{}@#$%^&*+=<>:;]+$/.test(command)) {
      const invalidError: GeminiError = new Error("Command contains invalid characters") as GeminiError;
      invalidError.code = 'INVALID_COMMAND';
      throw invalidError;
    }

    const result = await $`gemini -p ${command}`.quiet();

    const stdout = result.stdout.toString();
    const stderr = result.stderr.toString();
    const exitCode = result.exitCode || 0;

    const lines = stdout.split("\n");
    const filteredLines = lines.filter(
      (line) =>
        !line.includes("Loaded cached credentials") &&
        !line.includes("Loading credentials") &&
        !line.includes("Authenticating") &&
        !line.includes("Error flushing log events") &&
        line.trim() !== ""
    );

    return {
      stdout: filteredLines.join("\n").trim(),
      stderr,
      exitCode
    };
  } catch (error) {
    const geminiError: GeminiError = new Error(`Failed to execute command: ${(error as Error).message}`) as GeminiError;
    geminiError.code = 'EXECUTION_FAILED';
    throw geminiError;
  } finally {
    process.chdir(originalDir);
  }
};

export default gemini_cli_helper;
