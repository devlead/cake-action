import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { ToolsDirectory } from './toolsDirectory';

const dotnetToolInstall = 'dotnet tool install';

export class DotNet {
  static disableTelemetry() {
    core.exportVariable('DOTNET_CLI_TELEMETRY_OPTOUT', '1');
  }

  static async installLocalCakeTool(targetDirectory: ToolsDirectory = new ToolsDirectory(), version?: string) {
    return DotNet.installLocalTool('Cake.Tool', targetDirectory, version);
  }

  static async installLocalTool(toolName: string, targetDirectory: ToolsDirectory = new ToolsDirectory(), version?: string) {
    let parameters = ['--tool-path', targetDirectory.path, toolName];
    
    if(version != undefined && version != '')
    {
      parameters = ['--version', version].concat(parameters);
    }
    
    const exitCode = await exec(dotnetToolInstall, parameters);

    if (exitCode != 0) {
      throw new Error(`Failed to install ${toolName}. Exit code: ${exitCode}`);
    }
  }
}
