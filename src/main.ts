import * as core from '@actions/core';
import { ToolsDirectory } from './toolsDirectory';
import { CakeToolSettings } from './cakeToolSettings';
import * as dotnet from './dotnet';
import * as cake from './cake';
import * as action from './action';

export async function run() {
  try {
    const inputs = action.getInputs();
    const scriptPath = inputs.scriptPath;
    const version = inputs.cakeVersion;
    const bootstrap = inputs.cakeBootstrap;
    const toolManifest = inputs.cakeToolManifest;

    const toolsDir = new ToolsDirectory();
    toolsDir.create();

    const cakeTookSettings = new CakeToolSettings(toolsDir, toolManifest);

    dotnet.disableTelemetry();
    dotnet.disableWelcomeMessage();

    if (toolManifest) {
      await dotnet.restoreTool();
    } else {
      await dotnet.installLocalCakeTool(toolsDir, version);
    }

    if (bootstrap) {
      await cake.bootstrapScript(scriptPath, cakeTookSettings);
    }

    await cake.runScript(scriptPath, cakeTookSettings, ...inputs.scriptArguments);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
