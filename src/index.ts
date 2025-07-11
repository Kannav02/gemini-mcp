import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import gemini_cli_helper from "./gemini_cli_helper.ts";
import { z } from "zod";

// server object
const server = new Server({
  name: "my-mcp-server",
  version: "1.0.0",
  description: "My MCP Server",
  capabilities: {
    resources: {},
    tools: {},
  },
});
// intercept any request to list the tools
server.setRequestHandler(ListToolsRequestSchema, (request) => {
  return { tools: [
    {
        name: "gemini_cli_helper",
        description: "Execute Gemini CLI commands",
        parameters: z.object({
            command: z.string(),
            workingDir: z.string().optional(),
        }),
    }
  ] };
});
// intercept any request to call a tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "name_of_tool") {
      return {};
    }
    throw new McpError(ErrorCode.InternalError, "Internal error");
});

const transport = new StdioServerTransport();

await server.connect(transport);