"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const exec_1 = require("@actions/exec");
const io_1 = require("@actions/io");
/* eslint @typescript-eslint/no-unused-vars: error */
const dotnetCake = 'dotnet-cake';
class CakeTool {
    static runScript(scriptPath = 'build.cake', workingDirectory, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            const cakeToolPath = yield CakeTool.resolveCakeToolPath(workingDirectory);
            const cakeParams = CakeTool.formatParameters(params);
            const exitCode = yield exec_1.exec(cakeToolPath, [scriptPath, ...cakeParams]);
            if (exitCode != 0) {
                throw new Error(`Failed to run the build script. Exit code: ${exitCode}`);
            }
        });
    }
    static bootstrapScript(scriptPath = 'build.cake', workingDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            const cakeToolPath = yield CakeTool.resolveCakeToolPath(workingDirectory);
            const exitCode = yield exec_1.exec(cakeToolPath, [scriptPath, '--bootstrap']);
            if (exitCode != 0) {
                throw new Error(`Failed to bootstrap the build script. Exit code: ${exitCode}`);
            }
        });
    }
    static resolveCakeToolPath(workingDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            return workingDirectory
                ? workingDirectory.appendFileName(dotnetCake)
                : yield io_1.which(dotnetCake);
        });
    }
    static formatParameters(params) {
        return params
            .filter(p => p.isValid())
            .map(p => p.format());
    }
}
exports.CakeTool = CakeTool;
