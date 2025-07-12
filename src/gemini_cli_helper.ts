import { $ } from "bun";
import { existsSync } from "fs";
import { resolve } from "path";

const gemini_cli_helper = async (command: string, workingDir?: string) => {
    
    const originalDir = process.cwd();
    
    try {
        if (workingDir) {
            const resolvedDir = resolve(workingDir);
            if (!existsSync(resolvedDir)) {
                throw new Error(`Directory does not exist: ${resolvedDir}`);
            }
            process.chdir(resolvedDir);
        }
        
        // Basic command sanitization - only allow alphanumeric, spaces, and safe characters
        if (!/^[a-zA-Z0-9\s\-_.,/]+$/.test(command)) {
            throw new Error("Command contains invalid characters");
        }
        
        const result = await $`gemini -p ${command}`;
        return result.stdout.toString();
    } catch (error) {
        throw new Error(`Failed to execute command: ${error.message}`);
    } finally {
        // Always restore original directory
        process.chdir(originalDir);
    }
}

export default gemini_cli_helper;


