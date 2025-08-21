import "dotenv/config";
import { $ } from "bun";
import { existsSync } from "fs";
import { resolve } from "path";
import type { CommandResult, GeminiError, GemininCustomCommandParams } from "./types.ts";

export class GeminiCustomCommand {
  private readonly executeCustomCommand = async ({ command, args, workingDir }: GemininCustomCommandParams): Promise<CommandResult> => {
    const originalDir = process.cwd();
    try {
      // Change directory if specified
      if (workingDir) {
        const resolvedDir = resolve(workingDir);
        if (!existsSync(resolvedDir)) {
          const dirError: GeminiError = new Error(`Directory does not exist: ${resolvedDir}`) as GeminiError;
          dirError.code = 'DIRECTORY_NOT_FOUND';
          throw dirError;
        }
        process.chdir(resolvedDir);
      }

      // Validate command arguments
      if (!/^[a-zA-Z0-9\s\-_.,/!?'"()\[\]{}@#$%^&*+=<>:;]+$/.test(args)) {
        const invalidError: GeminiError = new Error("Command arguments contain invalid characters") as GeminiError;
        invalidError.code = 'INVALID_ARGUMENTS';
        throw invalidError;
      }

      // Execute custom command using printf pipe approach
      const fullCommand = `/${command} ${args}`;
      const result = await $`printf ${fullCommand + '\n'} | gemini`.timeout(30000).quiet();

      const stdout = result.stdout.toString();
      const stderr = result.stderr.toString();
      const exitCode = result.exitCode || 0;

      // Filter out common noise from stdout
      const lines = stdout.split("\n");
      const filteredLines = lines.filter(
        (line) =>
          !line.includes("Loaded cached credentials") &&
          !line.includes("Loading credentials") &&
          !line.includes("Authenticating") &&
          !line.includes("Error flushing log events") &&
          !line.includes("Data collection is disabled") &&
          !line.includes("DeprecationWarning") &&
          line.trim() !== ""
      );

      return {
        stdout: filteredLines.join("\n").trim(),
        stderr,
        exitCode
      };
    } catch (error) {
      const geminiError: GeminiError = new Error(`Failed to execute custom command: ${(error as Error).message}`) as GeminiError;
      geminiError.code = 'EXECUTION_FAILED';
      throw geminiError;
    } finally {
      process.chdir(originalDir);
    }
  };

  /**
   * Conducts thorough research and investigation on any topic or question
   */
  async research(args: string, workingDir?: string): Promise<CommandResult> {
    return this.executeCustomCommand({ command: 'research', args, workingDir });
  }

  /**
   * Investigates and creates a strategic plan to accomplish a task
   */
  async planCodebase(args: string, workingDir?: string): Promise<CommandResult> {
    return this.executeCustomCommand({ command: 'plan_codebase', args, workingDir });
  }

  /**
   * Analyzes and creates comprehensive documentation strategies
   */
  async documentation(args: string, workingDir?: string): Promise<CommandResult> {
    return this.executeCustomCommand({ command: 'documentation', args, workingDir });
  }

  /**
   * Analyzes system architecture and designs solutions at the system level
   */
  async systemDesign(args: string, workingDir?: string): Promise<CommandResult> {
    return this.executeCustomCommand({ command: 'system-design', args, workingDir });
  }
}

export default GeminiCustomCommand;