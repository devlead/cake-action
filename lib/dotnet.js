"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const core = __importStar(require("@actions/core"));
const exec_1 = require("@actions/exec");
const toolsDirectory_1 = require("./toolsDirectory");
const platform_1 = require("./platform");
const dotnetToolInstall = 'dotnet tool install';
const dotnetToolUnInstall = 'dotnet tool uninstall';
const dotnetCake = 'dotnet-cake';
class DotNet {
    static disableTelemetry() {
        core.exportVariable('DOTNET_CLI_TELEMETRY_OPTOUT', '1');
    }
    static installLocalCakeTool(targetDirectory = new toolsDirectory_1.ToolsDirectory(), version) {
        return __awaiter(this, void 0, void 0, function* () {
            return DotNet.installLocalTool('Cake.Tool', dotnetCake, targetDirectory, version);
        });
    }
    static installLocalTool(packageId, toolName, targetDirectory = new toolsDirectory_1.ToolsDirectory(), version) {
        return __awaiter(this, void 0, void 0, function* () {
            const toolExecutable = `${toolName}${platform_1.Platform.isWindows() ? '.exe' : ''}`;
            if (targetDirectory.containsFile(toolExecutable)) {
                if (version) {
                    const toolInstallPath = path.join('.store', packageId.toLowerCase(), version.toLowerCase(), 'project.assets.json');
                    if (targetDirectory.containsFile(toolInstallPath)) {
                        core.info(`The ${packageId} version ${version} already exists in ${targetDirectory}, skipping installation`);
                        return;
                    }
                    const uninstallExitCode = yield exec_1.exec(dotnetToolUnInstall, ['--tool-path', targetDirectory.path, packageId]);
                    if (uninstallExitCode != 0) {
                        throw new Error(`Failed to uninstall previous version of ${packageId}. Exit code: ${uninstallExitCode}`);
                    }
                }
                else {
                    core.info(`The ${packageId} already exists in ${targetDirectory}, skipping installation`);
                    return;
                }
            }
            const installArgs = ((version)
                ? ['--version', version]
                : []).concat(['--tool-path', targetDirectory.path, packageId]);
            const exitCode = yield exec_1.exec(dotnetToolInstall, installArgs);
            if (exitCode != 0) {
                throw new Error(`Failed to install ${packageId}. Exit code: ${exitCode}`);
            }
        });
    }
}
exports.DotNet = DotNet;
