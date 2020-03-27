/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, utils} from '@microsoft/bf-cli-command';
import * as path from 'path';
const fs = require('fs-extra');

const configPrefix = 'orchestrator__';

const filterConfig = (config: any, prefix: string) => {
  return Object.keys(config)
  .filter((key: string) => key.startsWith(prefix))
  .reduce((filteredConfig: any, key: string) => {
    filteredConfig[key] = config[key];
    return filteredConfig;
  }, {});
};

const getInputFromFile = async (path: string): Promise<string> => {
  if (path) {
    try {
      return await utils.readTextFile(path);
    } catch (error) {
      throw new CLIError(`Failed to read app JSON: ${error}`);
    }
  }
  return '';
};

const getUserConfig = async (configPath: string) => {
  if (fs.existsSync(path.join(configPath, 'config.json'))) {
    return fs.readJSON(path.join(configPath, 'config.json'), {throws: false});
  }
  return null;
};

const createConfigFile = async (configPath: string) => {
  await fs.mkdirp(configPath);
  await fs.writeFile(path.join(configPath, 'config.json'), JSON.stringify({}, null, 2));
};

const writeUserConfig = async (userconfig: any, configPath: string) => {
  await fs.mkdirp(configPath);
  await fs.writeFile(path.join(configPath, 'config.json'), JSON.stringify(userconfig, null, 2));
};

const isDirectory = (path: string): boolean => {
  try {
    const stats = fs.statSync(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
};

const filterByAllowedConfigValues = (configObj: any, prefix: string) => {
  const allowedConfigValues = [`${prefix}appId`, `${prefix}endpoint`, `${prefix}region`, `${prefix}subscriptionKey`, `${prefix}versionId`];
  const filtered = Object.keys(configObj)
  .filter(key => allowedConfigValues.includes(key))
  .reduce((filteredConfigObj: any, key) => {
    filteredConfigObj[key] = configObj[key];
    return filteredConfigObj;
  }, {});
  return filtered;
};

const processInputs = async (flags: any, flagLabels: string[], configDir: string) => {
  let config = filterByAllowedConfigValues(await getUserConfig(configDir), configPrefix);
  config = config ? filterConfig(config, configPrefix) : config;
  const input: any = {};
  flagLabels
  .filter(flag => flag !== 'help')
  .forEach((flag: string) => {
    if (flag === 'in') {
      // rename property since 'in' is a reserved keyword
      input[`${flag}Val`] = flags[flag];
    }
    input[flag] = flags[flag] || (config ? config[configPrefix + flag] : null);
  });
  return input;
};

const validateRequiredProps = (configObj: any) => {
  Object.keys(configObj).forEach(key => {
    if (!configObj[key]) {
      throw new CLIError(`Required input property '${key}' missing. Please pass it in as a flag or set it in the config file.`);
    }
  });
};

const writeToConsole = (outputContents: string) => {
  const output = JSON.stringify(outputContents, null, 2);
  process.stdout.write(output, 'utf-8');
};

const writeToFile = async (outputLocation: string, content: any, force: boolean) => {
  const isDir = isDirectory(outputLocation);
  const writeFile = isDir ? path.join(outputLocation, 'export.json') : outputLocation;
  const validatedPath = utils.validatePath(writeFile, '', force);
  try {
    await fs.ensureFile(writeFile);
    await fs.writeJson(validatedPath, content, {spaces: 2});
  } catch (error) {
    throw new CLIError(error);
  }
  return validatedPath;
};

module.exports.createConfigFile = createConfigFile;
module.exports.getInputFromFile = getInputFromFile;
module.exports.getUserConfig = getUserConfig;
module.exports.processInputs = processInputs;
module.exports.validateRequiredProps = validateRequiredProps;
module.exports.writeToConsole = writeToConsole;
module.exports.writeToFile = writeToFile;
module.exports.writeUserConfig = writeUserConfig;
