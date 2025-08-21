import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import registerTools from './registerTools.ts';
import type { ServerConfig } from './types.ts';

// Suppress Node.js deprecation warnings
process.env.NODE_NO_WARNINGS = '1';

// 1 – Plain server metadata only
// mcp servers have the capabilites to prvide the following
// - tools: functions that can be called by the LLM
// - resources: file like data that can be read by the LLM
// - prompts: templates to achieve tasks

const serverConfig: ServerConfig = {
  name: 'gemini-mcp',
  version: '1.0.0',
  description: 'Expose Gemini-CLI as an MCP tool',
  capabilities: {
    tools: {
      listChanged: true,
    },
  },
};

const server = new McpServer(serverConfig);

registerTools(server);

const main = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
