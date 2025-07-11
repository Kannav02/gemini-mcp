import { $ } from "bun";

const gemini_cli_helper = async (command:string,workingDir:string) => {
    if (workingDir) {
        process.chdir(workingDir);
    }
    const result = await $`gemini -p ${command}`;
    return result.stdout;

}

export default gemini_cli_helper;


