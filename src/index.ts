import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import gemini_cli_helper from "./gemini_cli_helper.ts";

// 1 – Plain server metadata only ↓
const server = new McpServer({
  name:        "gemini-mcp",
  version:     "1.0.0",
  description: "Expose Gemini-CLI as an MCP tool"
});

// 2 – Tell the SDK about the tool.
//    registerTool() ↔ adds the schema to capabilities.tools automatically
server.registerTool(
  "gemini_cli_helper",
  {
    title:       "Gemini CLI helper",
    description: "Run any `gemini` command and stream back stdout/stderr",
    inputSchema: {
      command:    z.string().describe("Full Gemini CLI command line"),
      workingDir: z.string().optional().describe("Directory to run the command in")
    }
  },
  async ({ command, workingDir }) => {
    try {
      const output = await gemini_cli_helper(command, workingDir);
      return { content: [{ type: "text", text: output }] };
    } catch (err: unknown) {
      const e = err as Error;
      return {
        content: [{ type: "text", text: `Error: ${e.message}` }],
        isError: true
      };
    }
  }
);

// 3 – Wire up stdio transport
await server.connect(new StdioServerTransport());
