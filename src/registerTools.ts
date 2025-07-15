import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import gemini_cli_helper from "./gemini_cli_helper.ts";

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
    async ({ command, workingDir }) => {
      try {
        const output = await gemini_cli_helper(command, workingDir);

        if (!output) {
          return { content: [{ type: "text", text: "No output" }] };
        }

        return { content: [{ type: "text", text: output }] };
      } catch (err: unknown) {
        const e = err as Error;
        return {
          content: [{ type: "text", text: `Error: ${e.message}` }],
          isError: true,
        };
      }
    }
  );
};

export default registerTools;
