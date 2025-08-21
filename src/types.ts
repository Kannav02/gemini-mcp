// src/types.ts

// Command execution result type
export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

// Tool response types
export interface ToolResponse {
  [x: string]: unknown;
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

// Tool input parameters
export interface GeminiCommandParams {
  command: string;
  workingDir?: string;
}
export interface GemininCustomCommandParams extends GeminiCommandParams {
  args: string;
}

// Error types for better error handling
export interface GeminiError extends Error {
  code?: string;
  exitCode?: number;
  stderr?: string;
}

// Configuration types
export interface ServerConfig {
  [x: string]: unknown;
  name: string;
  version: string;
  description?: string;
  capabilities?: {
    tools?: {
      listChanged?: boolean;
    };
  };
}
