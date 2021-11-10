/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {} from 'mocha';
import {DataSourceHelper} from '../src/datasourcehelper';
import {OrchestratorDataSourceSettings} from '../src/settings';
import * as path from 'path';
import * as fs from 'fs-extra';
import assert = require('assert');

describe('DataSourceHelperTests', () => {
  const cwd: string = process.cwd();
  it('getInputFolderPathWithDispatchFileInput', () => {
    const dataSourceSettings: OrchestratorDataSourceSettings = new OrchestratorDataSourceSettings([], true, '');
    const input: string = DataSourceHelper.getInputFolderPath(path.join(cwd, 'test.Dispatch'), cwd, dataSourceSettings);
    assert(input === path.join(cwd, 'dataSources'));
  });

  it('getInputFolderPathWithNoInputAndWithExistingOrchestratorSettingsFile', () => {
    const dataSourceSettings: OrchestratorDataSourceSettings = new OrchestratorDataSourceSettings([], true, path.join(cwd, 'dataSources'));
    const input: string = DataSourceHelper.getInputFolderPath('', cwd, dataSourceSettings);
    assert(input === dataSourceSettings.path);
  });

  it('getInputFolderPathWithInputAndWithExistingOrchestratorSettingsFile', () => {
    const inputPath: string = path.resolve('./test/fixtures/output/dataSources');
    fs.mkdirSync(inputPath, {recursive: true});
    const dataSourceSettings: OrchestratorDataSourceSettings = new OrchestratorDataSourceSettings([], true, path.join(cwd, 'dataSources'));
    const input: string = DataSourceHelper.getInputFolderPath(inputPath, cwd, dataSourceSettings);
    assert(input === inputPath);
    assert(dataSourceSettings.path === inputPath);
  });
});
