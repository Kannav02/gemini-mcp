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
  return {
    tools: [
      {
        name: "gemini_cli_helper",
        description: "Execute Gemini CLI commands",
        parameters: z.object({
          command: z.string().describe("The command to execute"),
          workingDir: z
            .string()
            .optional()
            .describe("The working directory to execute the command in"),
        }),
      },
    ],
  };
});
// intercept any request to call a tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "gemini_cli_helper") {
    try {
      const { arguments: args } = request.params;

      if (!args || typeof args !== "object") {
        throw new McpError(ErrorCode.InvalidParams, "Invalid arguments");
      }

      const { command, workingDir } = args;

      if (typeof command !== "string" || !command.trim()) {
        throw new McpError(ErrorCode.InvalidParams, "Prompt is wrong");
      }
      if (typeof workingDir !== "string" || !workingDir.trim()) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Working directory is wrong"
        );
      }

      const result = await gemini_cli_helper(command, workingDir);
      return {
        result: result,
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        "Couldn't Execute Gemini CLI command"
      );
    }
  }
  throw new McpError(ErrorCode.InternalError, "Internal Error");
});

const transport = new StdioServerTransport();

await server.connect(transport);
