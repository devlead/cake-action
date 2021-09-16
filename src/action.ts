import * as core from '@actions/core';
import * as script from "./cakeParameter";

interface CakeInputs {
  readonly scriptPath?: string,
  readonly cakeVersion?: string,
  readonly cakeBootstrap?: boolean,
  readonly cakeToolManifest?: boolean;
}

interface ScriptInputs {
  readonly scriptArguments: script.CakeParameter[];
}

export function getInputs(): CakeInputs & ScriptInputs {
  return {
    scriptPath: core.getInput('script-path'),
    cakeVersion: core.getInput('cake-version'),
    cakeBootstrap: getBooleanInput('cake-bootstrap'),
    cakeToolManifest: getBooleanInput('cake-tool-manifest'),
    scriptArguments: getScriptInputs()
  };
}

function getBooleanInput(name: string): boolean {
  return core.getInput(name).toLowerCase() === 'true';
}

function getScriptInputs(): script.CakeParameter[] {
  return [
    new script.CakeArgument('target', core.getInput('target')),
    new script.CakeArgument('verbosity', core.getInput('verbosity')),
    ...parseDryRunSwitch(),
    ...parseCustomArguments()
  ];
}

function parseDryRunSwitch(): script.CakeParameter[] {
  return getBooleanInput('dry-run')
    ? [new script.CakeSwitch('dryrun')]
    : [];
}

function parseCustomArguments(): script.CakeParameter[] {
  return core.getInput('arguments')
    .split(/\r?\n/)
    .filter(line => containsArgumentDefinition(line))
    .map(line => parseNameAndValue(line))
    .map(([name, value]) => new script.CakeArgument(name, value));
}

function containsArgumentDefinition(line: string): boolean {
  return /.+:.+/.test(line);
}

function parseNameAndValue(line: string): [string, string] {
  const nameValue = line.split(':');
  return [nameValue[0].trim(), nameValue[1].trim()];
}
