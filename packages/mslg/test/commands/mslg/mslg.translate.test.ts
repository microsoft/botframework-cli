import {expect, test} from '@oclif/test'
const fs = require('fs')
const path = require('path');
const chai = require('chai')
const assert = chai.assert
const txtfile = require('read-text-file')
const rimraf = require('rimraf')
const dotenv = require('dotenv');
const ENV_FILE = path.join(__dirname, '../../../.env');
dotenv.config({ path: '.env' });
const TRANSLATE_KEY = process.env.TRANSLATE_KEY

function compareFiles(actualPath: string, expectedPath: string) {
  let expected = fs.existsSync(actualPath)
    ? txtfile.readSync(actualPath)
    : actualPath
  let actual = fs.existsSync(expectedPath)
    ? txtfile.readSync(expectedPath)
    : 'expectedPath'
  assert.deepEqual(actual.split(/\r?\n/), expected.split(/\r?\n/))
}

if (TRANSLATE_KEY) {
  describe('The mslg:translate command', () => {
    
    test
      .stdout()
      .stderr()
      .command(['mslg:translate', '-k', `${TRANSLATE_KEY}`, '-t', 'zh-Hans', '--in', 'examples/exceptionExamples/InvalidTemplateName.lg', '-o', 'test/testOutput', '-c', '--verbose'])
      .it('should output an error for invalid token', ctx => {
        expect(ctx.stderr).to.contain('')
      })

    test
      .stdout()
      .stderr()
      .command(['mslg:translate', '-k', `${TRANSLATE_KEY}`, '-t', 'zh-Hans', '--in', 'examples/exceptionExamples/completelyEmptyFile.lg', '-o', 'test/testOutput', '-c', '--verbose'])
      .it('should output an error for invalid file type', ctx => {
        expect(ctx.stderr).to.contain('Encoding not recognized')
      })

    test
      .stdout()
      .stderr()
      .command(['mslg:translate', '-k', `${TRANSLATE_KEY}`, '-t', 'zh-Hans', '--in', 'examples/xyz/completelyEmptyFile.lg', '-o', 'test/testOutput', '-c', '--verbose'])
      .it('should output an error for folder does not exist', ctx => {
        expect(ctx.stderr).to.contain('unable to open file')
      })

    test
      .stdout()
      .command(['mslg:translate', '-k', `${TRANSLATE_KEY}`, '-t', 'zh-Hans', '--in', 'examples/validExamples/translator.lg', '-o', 'test/testOutput', '-c', '--verbose'])
      .it('should translate a specific lg file', ctx => {
        expect(ctx.stdout).to.contain('Parsing file: ')
      })

    test
      .stdout()
      .stderr()
      .command(['mslg:translate', '-k', `${TRANSLATE_KEY}`, '-t', 'zh-Hans', '--in', 'examples/validExamples/translator.lg', '-o', '../testOutput', '-c', '--verbose'])
      .it('should translate a specific lg file with outfolder relative path specified', ctx => {
        expect(ctx.stderr).to.contain('output folder')
      })

    test
      .stdout()
      .command(['mslg:translate', '-k', `${TRANSLATE_KEY}`, '-t', 'zh-Hans', '-l', 'examples/validExamples', '-o', 'test/testOutput', '-s', '-c', '--verbose'])
      .it('should translate in subfolder', ctx => {
        expect(ctx.stdout).to.contain('Parsing file: ')
      })

    test
      .stdout()
      .command(['mslg:translate', '-k', `${TRANSLATE_KEY}`, '-t', 'zh-Hans', '-l', 'examples/validExamples', '--out_folder', 'test/testOutput', '-s', '-c', '--verbose'])
      .it('should translate all files from a specific folder', ctx => {
        compareFiles('test/testOutput/zh-Hans/subSimple.lg', 'test/expected/zh-Hans/subSimple.lg');
        compareFiles('test/testOutput/zh-Hans/simple.lg', 'test/expected/zh-Hans/simple.lg');
        compareFiles('test/testOutput/zh-Hans/simple2.lg', 'test/expected/zh-Hans/simple2.lg');
        compareFiles('test/testOutput/zh-Hans/simpleWithVariables.lg', 'test/expected/zh-Hans/simpleWithVariables.lg');
        compareFiles('test/testOutput/zh-Hans/translator.lg', 'test/expected/zh-Hans/translator.lg');
      })

    afterEach(done => {
      rimraf('test/testOutput/*', {}, () => {
        done()
      })
    })
  })
}
