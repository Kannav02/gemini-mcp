import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import gemini_cli_helper from "./gemini_cli_helper.ts";
import type { ToolResponse, GeminiError } from "./types.ts";
import GeminiCustomCommand from "./GeminiCustomCommand.ts";

const registerTools = (server: McpServer) => {
  // Single instance for all custom commands
  const customCommand = new GeminiCustomCommand();

  // Original Gemini CLI helper tool
  server.tool(
    "gemini_cli_helper",
    "Run any `gemini` command and stream back stdout/stderr",
    {
      command: z.string().describe("Full Gemini CLI command line"),
      workingDir: z
        .string()
        .optional()
        .describe("Directory to run the command in"),
    },
    async ({ command, workingDir }): Promise<ToolResponse> => {
      try {
        const result = await gemini_cli_helper({ command, workingDir });

        if (!result.stdout && !result.stderr) {
          return { content: [{ type: "text", text: "No output" }] };
        }

        const outputText = result.stderr ? 
          `${result.stdout}\nstderr: ${result.stderr}` : 
          result.stdout;

        return { content: [{ type: "text", text: outputText }] };
      } catch (err: unknown) {
        const e = err as GeminiError;
        return {
          content: [{ type: "text", text: `Error: ${e.message}${e.code ? ` (${e.code})` : ''}` }],
          isError: true,
        };
      }
    }
  );

  // Research custom command tool
  server.tool(
    "gemini_research",
    "Conducts thorough research and investigation on any topic or question",
    {
      args: z.string().describe("Research topic or question to investigate"),
      workingDir: z
        .string()
        .optional()
        .describe("Directory to run the command in"),
    },
    async ({ args, workingDir }): Promise<ToolResponse> => {
      try {
        const result = await customCommand.research(args, workingDir);
        return { content: [{ type: "text", text: result.stdout }] };
      } catch (err: unknown) {
        const e = err as GeminiError;
        return {
          content: [{ type: "text", text: `Error: ${e.message}${e.code ? ` (${e.code})` : ''}` }],
          isError: true,
        };
      }
    }
  );

  // Plan codebase custom command tool
  server.tool(
    "gemini_plan_codebase",
    "Investigates and creates a strategic plan to accomplish a task",
    {
      args: z.string().describe("Task or objective to create a strategic plan for"),
      workingDir: z
        .string()
        .optional()
        .describe("Directory to run the command in"),
    },
    async ({ args, workingDir }): Promise<ToolResponse> => {
      try {
        const result = await customCommand.planCodebase(args, workingDir);
        return { content: [{ type: "text", text: result.stdout }] };
      } catch (err: unknown) {
        const e = err as GeminiError;
        return {
          content: [{ type: "text", text: `Error: ${e.message}${e.code ? ` (${e.code})` : ''}` }],
          isError: true,
        };
      }
    }
  );

  // Documentation custom command tool
  server.tool(
    "gemini_documentation",
    "Analyzes and creates comprehensive documentation strategies for any subject or project",
    {
      args: z.string().describe("Subject or project to create documentation strategy for"),
      workingDir: z
        .string()
        .optional()
        .describe("Directory to run the command in"),
    },
    async ({ args, workingDir }): Promise<ToolResponse> => {
      try {
        const result = await customCommand.documentation(args, workingDir);
        return { content: [{ type: "text", text: result.stdout }] };
      } catch (err: unknown) {
        const e = err as GeminiError;
        return {
          content: [{ type: "text", text: `Error: ${e.message}${e.code ? ` (${e.code})` : ''}` }],
          isError: true,
        };
      }
    }
  );

  // System design custom command tool
  server.tool(
    "gemini_system_design",
    "Analyzes system architecture and designs solutions at the system level",
    {
      args: z.string().describe("System requirements or design challenge to analyze"),
      workingDir: z
        .string()
        .optional()
        .describe("Directory to run the command in"),
    },
    async ({ args, workingDir }): Promise<ToolResponse> => {
      try {
        const result = await customCommand.systemDesign(args, workingDir);
        return { content: [{ type: "text", text: result.stdout }] };
      } catch (err: unknown) {
        const e = err as GeminiError;
        return {
          content: [{ type: "text", text: `Error: ${e.message}${e.code ? ` (${e.code})` : ''}` }],
          isError: true,
        };
      }
    }
  );
};

export default registerTools;
