import * as core from '@actions/core';
import { ToolsDirectory } from './toolsDirectory';
import { DotNet } from './dotnet';
import { CakeTool } from './cake';
import { CakeArgument } from './cakeParameter';

export async function run() {
  try {
    const cakeVersion = core.getInput('cake-version');
    const scriptPath = core.getInput('script-path');
    const target = new CakeArgument('target', core.getInput('target'));

    const toolsDir = new ToolsDirectory();
    await toolsDir.create();

    DotNet.disableTelemetry();

    await DotNet.installLocalCakeTool(toolsDir, cakeVersion);
    await CakeTool.runScript(scriptPath, toolsDir, target);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
