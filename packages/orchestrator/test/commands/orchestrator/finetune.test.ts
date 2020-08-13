/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {expect, test} from '@oclif/test';
// import * as fs from 'fs-extra';
// import * as path from 'path';

const EMULATOR_CONNECTION_STRING: string = 'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;' +
    'AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;' +
    'BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;' +
    'TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;' +
    'QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;';
/*
function findFile(dir: string, fileToFind: string): string {
  const files: string[] = fs.readdirSync(dir);

  for (let i: number = 0; i < files.length; i++) {
    const fullPath: string = path.join(dir, files[i]);

    if (fs.lstatSync(fullPath).isDirectory()) {
      const result: string = findFile(fullPath, fileToFind);
      if (result !== '') {
        return result;
      }
    } else if (files[i] === fileToFind) {
      // eslint-disable-next-line no-console
      console.log(`START DIR: ${fullPath}`);
      return fullPath;
    }
  }
  return '';
}
*/
describe('orchestrator:finetune cli parameters test', () => {
  // eslint-disable-next-line no-console
  console.log(`EMULATOR_CONNECTION_STRING=${EMULATOR_CONNECTION_STRING}`);
  /*
  test
  .stdout()
  .stderr()
  .command(['orchestrator:finetune'])
  .it('FT.0000 orchestrator:finetune', (ctx: any) => {
    expect(ctx.stderr).to.contain('Missing 1 required arg');
  });
*/
  test
  .stdout()
  .command(['orchestrator:finetune', '--help'])
  .it('FT.0001 should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Manage Orchestrator fine tuning.');
  });
/*
  test
  .stdout()
  .stderr()
  .command(['orchestrator:finetune', 'put'])
  .it('FT.0002 displays an error if any required input parameters are missing', (ctx: any) => {
    expect(ctx.stderr).to.contain('Missing 1 required arg');
  });

  test
  .stdout()
  .stderr()
  .command(['orchestrator:finetune', '--put'])
  .it('FT.0003 displays an error if any required input parameters are missing', (ctx: any) => {
    expect(ctx.stderr).to.contain('Command "--put" unknown');
  });

  if (process.env.USE_EMULATOR === 'true') {
    const testFile: string = findFile(process.cwd(), 'dteDataFile.tsv');

    test
    .stdout()
    .command(['orchestrator:finetune', 'put', '--debug', '--in', testFile, '--logformat', 'dtedata'])
    .it('FT.0004 uploads dtedata with lowercase logformat', (_ctx: any) => {
      // expect(ctx.stdout).to.contain('Upload result:');
    });
  } */
});
