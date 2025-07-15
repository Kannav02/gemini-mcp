import "dotenv/config";
import { $ } from "bun";
import { existsSync } from "fs";
import { resolve } from "path";

const gemini_cli_helper = async (command: string, workingDir?: string) => {
  const originalDir = process.cwd();

  try {
    if (workingDir) {
      const resolvedDir = resolve(workingDir);
      if (!existsSync(resolvedDir)) {
        throw new Error(`Directory does not exist: ${resolvedDir}`);
      }
      process.chdir(resolvedDir);
    }

    if (!/^[a-zA-Z0-9\s\-_.,/!?'"()\[\]{}@#$%^&*+=<>:;]+$/.test(command)) {
      throw new Error("Command contains invalid characters");
    }

    const result = await $`gemini -p ${command}`.quiet();

    const output = result.stdout.toString();
    const lines = output.split("\n");

    const filteredLines = lines.filter(
      (line) =>
        !line.includes("Loaded cached credentials") &&
        !line.includes("Loading credentials") &&
        !line.includes("Authenticating") &&
        !line.includes("Error flushing log events") &&
        line.trim() !== ""
    );

    return filteredLines.join("\n").trim();
  } catch (error) {
    throw new Error(`Failed to execute command: ${(error as Error).message}`);
  } finally {
    process.chdir(originalDir);
  }
};

export default gemini_cli_helper;
