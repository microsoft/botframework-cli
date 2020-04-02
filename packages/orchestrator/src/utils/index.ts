/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, utils} from '@microsoft/bf-cli-command';
import * as path from 'path';
import * as fs from 'fs-extra';
// const fs = require('fs-extra');

const configPrefix: string = 'orchestrator__';

const filterConfig: (config: any, prefix: string) => any = (config: any, prefix: string) => {
  return Object.keys(config)
  .filter((key: string) => key.startsWith(prefix))
  .reduce((filteredConfig: any, key: string) => {
    filteredConfig[key] = config[key];
    return filteredConfig;
  }, {});
};

const getInputFromFile: (path: string) => Promise<string> = async (path: string): Promise<string> => {
  if (path) {
    try {
      return await utils.readTextFile(path);
    } catch (error) {
      throw new CLIError(`Failed to read app JSON: ${error}`);
    }
  }
  return '';
};

const getUserConfig: (configPath: string) => Promise<any> = async (configPath: string) => {
  if (fs.existsSync(path.join(configPath, 'config.json'))) {
    return fs.readJSON(path.join(configPath, 'config.json'), {throws: false});
  }
  return null;
};

const createConfigFile: (configPath: string) => Promise<void> = async (configPath: string) => {
  await fs.mkdirp(configPath);
  await fs.writeFile(path.join(configPath, 'config.json'), JSON.stringify({}, null, 2));
};

const writeUserConfig: (userconfig: any, configPath: string) => Promise<void> = async (userconfig: any, configPath: string) => {
  await fs.mkdirp(configPath);
  await fs.writeFile(path.join(configPath, 'config.json'), JSON.stringify(userconfig, null, 2));
};

const isDirectory: (path: string) => boolean = (path: string): boolean => {
  try {
    const stats: fs.Stats = fs.statSync(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
};

const filterByAllowedConfigValues: (configObj: any, prefix: string) => any = (configObj: any, prefix: string) => {
  const allowedConfigValues: string[] = [`${prefix}appId`, `${prefix}endpoint`, `${prefix}region`, `${prefix}subscriptionKey`, `${prefix}versionId`];
  const filtered: string[] = Object.keys(configObj)
  .filter((key: string) => allowedConfigValues.includes(key))
  .reduce((filteredConfigObj: any, key: string) => {
    filteredConfigObj[key] = configObj[key];
    return filteredConfigObj;
  }, {});
  return filtered;
};

const processInputs: (flags: any, flagLabels: string[], configDir: string) => Promise<any> = async (flags: any, flagLabels: string[], configDir: string) => {
  let config: any = filterByAllowedConfigValues(await getUserConfig(configDir), configPrefix);
  config = config ? filterConfig(config, configPrefix) : config;
  const input: any = {};
  flagLabels
  .filter((flag: string) => flag !== 'help')
  .forEach((flag: string) => {
    if (flag === 'in') {
      // rename property since 'in' is a reserved keyword
      input[`${flag}Val`] = flags[flag];
    }
    input[flag] = flags[flag] || (config ? config[configPrefix + flag] : null);
  });
  return input;
};

const validateRequiredProps: (configObj: any) => void = (configObj: any) => {
  Object.keys(configObj).forEach((key: string) => {
    if (!configObj[key]) {
      throw new CLIError(`Required input property '${key}' missing. Please pass it in as a flag or set it in the config file.`);
    }
  });
};

const writeToFile: (filePath: string, content: string) => string = (filePath: string, content: string) => {
  try {
    fs.writeFileSync(filePath, content);
  } catch (error) {
    throw new CLIError(error)
  }
  return filePath
};

module.exports.createConfigFile = createConfigFile;
module.exports.getInputFromFile = getInputFromFile;
module.exports.getUserConfig = getUserConfig;
module.exports.processInputs = processInputs;
module.exports.validateRequiredProps = validateRequiredProps;
module.exports.writeToFile = writeToFile;
module.exports.writeUserConfig = writeUserConfig;
module.exports.isDirectory = isDirectory;
