import * as cp from 'child_process';
import * as fs from 'fs-extra'
const assert = require('assert');
const path = require('path')
const pathToJson = path.resolve(__dirname, '../../../../cli/package.json')

after(async() => {
  const userConfig = await fs.readJSON(pathToJson)
  userConfig.telemetry = null
  await fs.writeFile(pathToJson, JSON.stringify(userConfig, null, 2))
})

describe('telemetry:enable', () => {
  it('should enable telemetry', done => {
    cp.exec(`node ./bin/run telemetry:enable`, (error, stdout, stderr) => {
      assert(stdout.includes, 'Telemetry has been enabled');
      done();
    });
  });

  it('should set the telemetry flag to true', done => {
    cp.exec(`node ./bin/run telemetry:enable`, async (error, stdout, stderr) => {
      const userConfig = await fs.readJSON(pathToJson)
      assert(userConfig.telemetry === true)
      done();
    });
  });
})

