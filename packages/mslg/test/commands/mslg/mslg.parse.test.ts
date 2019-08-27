import {expect, test} from '@oclif/test'
const rimraf = require('rimraf')
const fs = require('fs');
const testDir = 'test/testOutput';

describe('The mslg:parse command', () => {

  before(() => {
    if (!fs.existsSync(testDir)){
      fs.mkdirSync(testDir);
    }
  });

  test
    .stdout()
    .command(['mslg:parse', '--help'])
    .it('should print the help contents when --help is passed as an argument', ctx => {
      expect(ctx.stdout).to.contain('Parse any provided .lg file and collate them into a single lg file.')
    })
  test
    .stdout()
    .stderr()
    .command(['mslg:parse', 'k'])
    .it('should print an error when an invalid argument is passed', ctx => {
      expect(ctx.stderr).to.contain('Unexpected argument')
    })
  test
    .stdout()
    .stderr()
    .command(['mslg:parse', '--k'])
    .it('should print an error when an invalid flag is passed', ctx => {
      expect(ctx.stderr).to.contain('Unexpected argument')
    })
  test
    .stdout()
    .stderr()
    .command(['mslg:parse', '--in', 'examples/exceptionExamples/EmptyTemplate.lg'])
    .it('should print an error when parsing invalid lg file', ctx => {
      expect(ctx.stderr).to.contain('There is no template body in template template\nparsing lg files failed')
    })
  test
    .stdout()
    .stderr()
    .command(['mslg:parse', '--lg_folder', 'examples/validExamples'])
    .it('should print an error if --collate is not specified and multiple templates of same name exist in different files', ctx => {
      expect(ctx.stderr).to.contain('below template names are defined in multiple files:')
    })
  test
    .stdout()
    .stderr()
    .command(['mslg:parse', '--lg_folder', 'test/testOutput', '--out_folder', 'test/testOutput', '--collate'])
    .it('should output an error for no files found', ctx => {
      expect(ctx.stderr).to.contain('no .lg files found in the specified folder')
    })
  test
    .stdout()
    .command(['mslg:parse', '--lg_folder', 'examples/validExamples', '--out_folder', 'test/testOutput', '--collate'])
    .it('should collate templates successfully', ctx => {
      expect(ctx.stdout).to.contain('Collated lg file is generated here')
    })
  test
    .stdout()
    .stderr()
    .command(['mslg:parse', '--lg_folder', 'examples/validExamples', '--subfolder', '--collate', '--out_folder', 'test/testOutput'])
    .it('should collate templates from subfolder successfully', ctx => {
      expect(ctx.stdout).to.contain('Collated lg file is generated here')
    })
  test
    .stdout()
    .stderr()
    .command(['mslg:parse', '--in', 'examples/validExamples/simple.lg', '--out_folder', 'test/testOutput'])
    .it('should write collated lg file to specific folder', ctx => {
      expect(ctx.stdout).to.contain('Collated lg file is generated here')
    })
  test
    .stdout()
    .stderr()
    .command(['mslg:parse', '--in', 'examples/validExamples/simple.lg', '--out_folder', 'test/testOutput', '--verbose'])
    .it('should print verbose messages when requesting verbose output', ctx => {
      expect(ctx.stdout).to.contain('Parsing file:')
    })

  test
    .stdout()
    .stderr()
    .command(['mslg:parse', '--in', 'examples/exceptionExamples/EmptyLGFile.lg', '--out_folder', 'test/testOutput'])
    .it('should output an error for empty file', ctx => {
      expect(ctx.stderr).to.contain('generating collated lg file failed')
    })

  test
    .stdout()
    .stderr()
    .command(['mslg:parse', '--in', 'examples/exceptionExamples/invalidFileType.txt'])
    .it('should output an error for invalid file type', ctx => {
      expect(ctx.stderr).to.contain('Encoding not recognized')
    })

  test
    .stdout()
    .stderr()
    .command(['mslg:parse', '--in', 'examples/exceptionExamples/fileDoesntExist.lg'])
    .it('should output an error for invalid file', ctx => {
      expect(ctx.stderr).to.contain('unable to open file')
    })

  test
    .stdout()
    .stderr()
    .command(['mslg:parse', '--in', 'examples/exceptionExamples/completelyEmptyFile.lg', '--out_folder', 'test/testOutput'])
    .it('should output an error for completely empty file', ctx => {
      expect(ctx.stderr).to.contain('Encoding not recognized')
    })

  test
    .stdout()
    .stderr()
    .command(['mslg:parse', '--lg_folder', 'examples/xyz/fileDoesntExist.lg'])
    .it('should output an error for folder does not exist', ctx => {
      expect(ctx.stderr).to.contain('is not a folder or does not exist')
    })

  test
    .stdout()
    .stderr()
    .command(['mslg:parse', '--lg_folder', 'examples/exceptionExamples/completelyEmptyFile.lg'])
    .it('should output an error for -l is not a directory', ctx => {
      expect(ctx.stderr).to.contain('is not a folder')
    })
    

    afterEach((done) => {
      rimraf('test/testOutput/*', {}, () => {done()})
    });
})
