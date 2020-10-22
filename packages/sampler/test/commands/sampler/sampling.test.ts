/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/*
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';
import * as path from 'path';

const isFileNotEmpty = async function (file: string) {
  let result: any = '';
  if (await fs.pathExists(path.join(__dirname, file))) {
    result = await fs.readFile(path.join(__dirname, file));
  }

  return result !== '';
};

describe('sampler:sampling test help', () => {
  test
  .stdout()
  .command(['sampler:sampling', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Do sampling to utterances in lu files');
  });
});

describe('sampler:sampling test maxImbalanceRatio', () => {
  before(async function () {
    await fs.ensureDir(path.join(__dirname, './../../../results/'));
  });

  after(async function () {
    await fs.remove(path.join(__dirname, './../../../results/'));
  });

  test
  .stdout()
  .command(['sampler:sampling', '--in', './test/testcases/source/test.lu', '--out', './results/', '--maxImbalanceRatio',  '5'])
  .it('should do sampling successfully with maxImbalanceRatio set to 5', async (_: any) => {
    expect(await isFileNotEmpty('./../../../results/test.lu')).to.be.true;
  });
});

describe('sampler:sampling test maxUtteranceAllowed', () => {
  before(async function () {
    await fs.ensureDir(path.join(__dirname, './../../../results/'));
  });

  after(async function () {
    await fs.remove(path.join(__dirname, './../../../results/'));
  });

  test
  .stdout()
  .command(['sampler:sampling', '--in', './test/testcases/source/test.lu', '--out', './results/', '--maxUtteranceAllowed',  '10'])
  .it('should do sampling successfully with maxUtteranceAllowed set to 10', async (_: any) => {
    expect(await isFileNotEmpty('./../../../results/test.lu')).to.be.true;
  });
});

describe('sampler:sampling test empty file skipped', () => {
  before(async function () {
    await fs.ensureDir(path.join(__dirname, './../../../results/'));
  });

  after(async function () {
    await fs.remove(path.join(__dirname, './../../../results/'));
  });

  test
  .stdout()
  .command(['sampler:sampling', '--in', './test/testcases/source', '--out', './results/', '--maxUtteranceAllowed',  '10'])
  .it('should do sampling successfully without throwing error for empty file', async (_: any) => {
    expect(await isFileNotEmpty('./../../../results/test.lu')).to.be.true;
  });
});

describe('sampler:sampling test --force', () => {
  before(async function () {
    await fs.ensureDir(path.join(__dirname, './../../../results/'));
  });

  after(async function () {
    await fs.remove(path.join(__dirname, './../../../results/'));
  });

  test
  .stdout()
  .command(['sampler:sampling', '--in', './test/testcases/source/test.lu', '--out', './results/', '--maxUtteranceAllowed',  '10'])
  .it('should output sampled files successfully without force', async (_: any) => {
    expect(await isFileNotEmpty('./../../../results/test.lu')).to.be.true;
  });

  test
  .stdout()
  .command(['sampler:sampling', '--in', './test/testcases/source/test.lu', '--out', './results/', '--maxUtteranceAllowed',  '10', '--force'])
  .it('should output sampled files successfully with force', async (_: any) => {
    expect(await isFileNotEmpty('./../../../results/test.lu')).to.be.true;
    expect(await isFileNotEmpty('./../../../results/test(1).lu')).to.be.false;
  });

  test
  .stdout()
  .command(['sampler:sampling', '--in', './test/testcases/source/test.lu', '--out', './results/', '--maxUtteranceAllowed',  '10'])
  .it('should output sampled files successfully without force again', async (_: any) => {
    expect(await isFileNotEmpty('./../../../results/test.lu')).to.be.true;
    expect(await isFileNotEmpty('./../../../results/test(1).lu')).to.be.true;
  });
});
*/
