import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import gemini_cli_helper from "./gemini_cli_helper.ts";
import type { ToolResponse, GeminiError } from "./types.ts";

const registerTools = (server: McpServer) => {
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
};

export default registerTools;
