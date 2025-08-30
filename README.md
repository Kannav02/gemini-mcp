# Gemini MCP Server

A Model Context Protocol (MCP) server that exposes the Gemini CLI as a tool for AI assistants like Claude.

## What This Tool Does

This MCP server provides a `gemini_cli_helper` tool that allows AI assistants to execute Gemini CLI commands directly. It acts as a bridge between MCP clients and the Gemini AI CLI, enabling seamless integration of Gemini's capabilities into your AI workflows.

## Prerequisites

Before using this tool, you need to have the following installed on your machine:

1. **Node.js** (v18 or higher)
2. **Bun** package manager
3. **Gemini CLI** - Install using: `npm install -g @google/generative-ai-cli`
4. **Gemini API Key** - Set up authentication with Google AI Studio

## Installation

1. Clone this repository:

```bash
git clone <repository-url>
cd gemini-mcp
```

2. Install dependencies:

```bash
bun install
```

3. Build the project:

```bash
bun run build
```

## Running Locally

To run the MCP server locally:

```bash
bun run start
```

The server will start and listen for MCP connections via stdio.

## MCP Configuration

To connect this server to your MCP client (like Claude Desktop), add the following configuration to your MCP settings file:

### For Claude Desktop (Using Bun - Recommended)

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "gemini_cli": {
      "command": "bun",
      "args": ["<path-to-gemini-mcp>/src/index.ts"]
    }
  }
}
```

Note: Replace `<path-to-gemini-mcp>` with the actual path to your cloned repository.

### For Claude Desktop (Using Node - Build Required)

If you prefer using Node.js, first build the project with `bun run build`, then add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "gemini-mcp": {
      "command": "node",
      "args": ["<path-to-gemini-mcp>/dist/index.js"],
      "env": {
        "NODE_PATH": "<path-to-gemini-mcp>/node_modules"
      }
    }
  }
}
```

### For other MCP clients

Configure your MCP client to connect to this server using the stdio transport with one of these commands:

**Using Bun (No build required):**

```bash
bun <path-to-gemini-mcp>/src/index.ts
```

**Using Node (Build required):**

```bash
node <path-to-gemini-mcp>/dist/index.js
```

## Available Tools

### `gemini_cli_helper`

**Description:** Run any `gemini` command and stream back stdout/stderr

**Parameters:**

- `command` (required): Full Gemini CLI command line (e.g., "What is the capital of France?")
- `workingDir` (optional): Directory to run the command in

**Example Usage:**

```javascript
// Simple prompt
gemini_cli_helper('Explain quantum computing in simple terms');

// With working directory
gemini_cli_helper('Analyze the code in this repository', '/path/to/project');
```

### Custom Command Tools

The server provides specialized tools powered by custom prompts for specific use cases:

#### `gemini_research`

**Description:** Conducts thorough research and investigation on any topic or question

- **Parameters:** `args` (research topic), `workingDir` (optional)

#### `gemini_plan_codebase`

**Description:** Investigates and creates a strategic plan to accomplish a task

- **Parameters:** `args` (task/objective), `workingDir` (optional)

#### `gemini_documentation`

**Description:** Analyzes and creates comprehensive documentation strategies

- **Parameters:** `args` (subject/project), `workingDir` (optional)

#### `gemini_system_design`

**Description:** Analyzes system architecture and designs solutions at the system level

- **Parameters:** `args` (system requirements), `workingDir` (optional)

### Custom Command Configuration

Custom commands use TOML files in the `toml_files/` directory to define their prompts and behavior. Each TOML file contains:

- `description`: Brief description of the command's purpose
- `prompt`: The specialized prompt template that guides Gemini's behavior

You can modify these TOML files to customize the behavior of each command or create new ones by following the existing pattern and then add it to gemin cli for custom commands that can be run easily and also accessed by the agent via the MCP Server

## Authentication

Make sure you have authenticated with the Gemini CLI before using this tool:

```bash
gemini auth login
```

## Development

To contribute to this project:

1. Make changes to the source code in the `src/` directory
2. Run `bun run build` to compile TypeScript
3. Test your changes locally

## License

MIT License - see LICENSE file for details.
