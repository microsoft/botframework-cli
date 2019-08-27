import {expect, test} from '@oclif/test'
const fs = require('fs')
const path = require('path');
const chai = require('chai')
const assert = chai.assert
const nock = require('nock')
const txtfile = require('read-text-file')
const rimraf = require('rimraf')
const dotenv = require('dotenv');
const testDir = 'test/testOutput';
const translateMockResponse = require('../../fixtures/translator/zh-Hans/translateMockResponse.json');

dotenv.config({ path: '.env' });
const TRANSLATE_KEY = process.env.TRANSLATE_KEY

function compareFiles(actualPath: string, fixturesPath: string) {
  let fixtures = fs.existsSync(actualPath)
    ? txtfile.readSync(actualPath)
    : actualPath
  let actual = fs.existsSync(fixturesPath)
    ? txtfile.readSync(fixturesPath)
    : 'fixturesPath'
  assert.deepEqual(actual.split(/\r?\n/), fixtures.split(/\r?\n/))
}

if (TRANSLATE_KEY) {
  describe('The mslg:translate command', () => {

    before(() => {
      if (!fs.existsSync(testDir)){
        fs.mkdirSync(testDir);
      }
    });

    beforeEach(() => {
      nock('https://api.cognitive.microsofttranslator.com')
        .persist()
        .post(/.*/)
        .reply(200, translateMockResponse)
    })
    
    test
      .stdout()
      .stderr()
      .command(['mslg:translate', '-k', `${TRANSLATE_KEY}`, '-t', 'zh-Hans', '--in', 'examples/exceptionExamples/InvalidTemplateName.lg', '--out_folder', 'test/testOutput', '-c', '--verbose'])
      .it('should output an error for invalid token', ctx => {
        expect(ctx.stderr).to.contain('')
      })

    test
      .stdout()
      .stderr()
      .command(['mslg:translate', '-k', `${TRANSLATE_KEY}`, '-t', 'zh-Hans', '--in', 'examples/exceptionExamples/completelyEmptyFile.lg', '--out_folder', 'test/testOutput', '-c', '--verbose'])
      .it('should output an error for invalid file type', ctx => {
        expect(ctx.stderr).to.contain('Encoding not recognized')
      })

    test
      .stdout()
      .stderr()
      .command(['mslg:translate', '-k', `${TRANSLATE_KEY}`, '-t', 'zh-Hans', '--in', 'examples/xyz/completelyEmptyFile.lg', '--out_folder', 'test/testOutput', '-c', '--verbose'])
      .it('should output an error for folder does not exist', ctx => {
        expect(ctx.stderr).to.contain('unable to open file')
      })

    test
      .stdout()
      .command(['mslg:translate', '-k', `${TRANSLATE_KEY}`, '-t', 'zh-Hans', '--in', 'examples/validExamples/translator.lg', '--out_folder', 'test/testOutput', '-c', '--verbose'])
      .it('should translate a specific lg file', ctx => {
        expect(ctx.stdout).to.contain('Parsing file: ')
      })

    test
      .stdout()
      .stderr()
      .command(['mslg:translate', '-k', `${TRANSLATE_KEY}`, '-t', 'zh-Hans', '--in', 'examples/validExamples/translator.lg', '--out_folder', '../testOutput', '-c', '--verbose'])
      .it('should translate a specific lg file with outfolder relative path specified', ctx => {
        expect(ctx.stderr).to.contain('output folder')
      })

    test
      .stdout()
      .command(['mslg:translate', '-k', `${TRANSLATE_KEY}`, '-t', 'zh-Hans', '-l', 'examples/validExamples', '--out_folder', 'test/testOutput', '-s', '-c', '--verbose'])
      .it('should translate in subfolder', ctx => {
        expect(ctx.stdout).to.contain('Parsing file: ')
      })

    test
      .stdout()
      .command(['mslg:translate', '-k', `${TRANSLATE_KEY}`, '-t', 'zh-Hans', '-l', 'examples/validExamples/batch', '--out_folder', 'test/testOutput', '-s', '-c', '--verbose'])
      .it('should translate all files from a specific folder', ctx => {
        compareFiles('test/testOutput/zh-Hans/translator.lg', 'test/fixtures/translator/zh-Hans/translator.lg');
      })

    afterEach(done => {
      rimraf('test/testOutput/*', {}, () => {
        done()
      })
    })
  })
}
