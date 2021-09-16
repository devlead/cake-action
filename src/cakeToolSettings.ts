
/* eslint @typescript-eslint/no-unused-vars: off */
import { ToolsDirectory } from './toolsDirectory';
/* eslint @typescript-eslint/no-unused-vars: error */

export class CakeToolSettings {
    readonly workingDirectory?: ToolsDirectory;
    readonly toolManifest: boolean;

    constructor(
        workingDirectory: ToolsDirectory | undefined,
        toolManifest: boolean = false
        ) {
        this.workingDirectory = workingDirectory;
        this.toolManifest = toolManifest;
      }
}
