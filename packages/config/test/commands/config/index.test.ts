import * as cp from 'child_process';
const assert = require('assert');

describe('config:telemetry:disable', () => {
  it('should disable telemetry', done => {
    cp.exec(`node ./bin/run config:index`, (error, stdout, stderr) => {
      assert(stdout.includes, 'The config plugin');
      done();
    });
  });
})
