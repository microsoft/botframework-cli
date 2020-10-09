import * as cp from 'child_process';
import assert from 'assert';
import fs from 'fs-extra';
import rimraf from 'rimraf';
import {expect, test} from '@oclif/test'

const pkg = require('../../../package.json');

describe('chatdown:convert', function() {

  before(() => { 
    fs.mkdirSync('./testout');
  });

  after(() => {
    rimraf('./testout', (err) => {
      if (err) console.log(err);
    })
  });

  test
  .stdout()
  .command(['chatdown:convert', '--help'])
  .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
    expect(ctx.stdout).to.contain('Converts chat dialog files in <filename>.')
  })

  test
  .stdout()
  .command(['chatdown'])
  .it('should print the help contents when no input is passed', (ctx: any) => {
    expect(ctx.stdout).to.contain('Converts chat dialog files in <filename>.')
  })

  // TODO(chrande): this test consistently fails when run in parallel with the other tests. Disabling for now.
  it.skip('should accept data as a pipe and output the results', done => {
    /* istanbul ignore next */
    cp.exec(`(echo user=Joe && echo bot=LuliBot && echo LuliBot: hello! && echo joe:can I get some help?) | node ./bin/run chatdown:convert`, (err, stdout) => {
      if(err) return done(err);
      assert.doesNotThrow(() => JSON.parse(stdout));
      done();
    });
  }).retries(3);

  it('should throw when a malformed config options is encountered in the input', done => {
    cp.exec(`echo bot=LuliBot=joe | node ./bin/run chatdown:convert`, (error, stdout, stderr) => {
      assert(stderr.trim().indexOf('Malformed configurations options detected. Options must be in the format optionName=optionValue') >= 0);
      done();
    });
  });

  it('should generate timestamps when --stamp is passed as an argument', done => {
    cp.exec(`(echo user=Joe && [ConversationUpdate=MembersAdded=Joe]) | node ./bin/run chatdown:convert --stamp`, (error, stdout) => {
      assert.doesNotThrow(() => JSON.parse(stdout));
      done();
    });
  });

  it('should read from file when chat file is passed as an argument', done => {
    cp.exec(`node ./bin/run chatdown:convert --in "./test/utils/cli.sample.chat"`, (error, stdout) => {
      assert.doesNotThrow(() => JSON.parse(stdout));
        done();
      });
    });

  it('should process all files when a glob is passed in with the -i argument, and the -o is passed in for the output directory', done => {
    cp.exec(`node ./bin/run chatdown:convert -i "./test/utils/*.sample.chat" -o ./testout`, (error, stdout, stderr) => {
      assert(stdout.includes('Successfully wrote'));
        done();
      });
  });

  it('should process all files when a glob is passed in with the -i argument', done => {
    cp.exec(`node ./bin/run chatdown:convert -i "./test/utils/*.sample.chat"`, (error, stdout, stderr) => {
      assert(stdout.includes('Successfully wrote'));
      done();
    });
  });

  it('should not prefix [chatdown] to stdout when --prefix is not passed as an argument', done => {
    cp.exec(`echo bot=LuliBot | node ./bin/run chatdown:convert`, (error, stdout, stderr) => {
      assert.notEqual(stdout.startsWith(`[${pkg.name}]`), `It should not show the tag '[${pkg.name}]' when not using the argument --prefix`);
      done();
    });
  });

  it('should prefix [chatdown] to stderr when --prefix is passed as an argument', done => {
    cp.exec(`echo bot=LuliBot | node ./bin/run chatdown:convert --prefix`, (error, stdout, stderr) => {
      assert(stdout.startsWith(`[${pkg.name}]`), `It should show the tag '[${pkg.name}]' when using the argument --prefix`);
      done();
    });
  });

  it('throw error if invalid path in argument', done => {
    cp.exec(`node ./bin/run chatdown:convert --in 'aaaaa'`, (error, stdout, stderr) => {
      assert(stderr.includes('no such file or directory') || stderr.includes('error'));
      done();
    });
  });

  it('should display an error message when the out directory does not exist', done => {
    cp.exec(`node ./bin/run chatdown:convert -i "./test/utils/cli.sample.chat" -o ./xyz`, (error, stdout, stderr) => {
      assert(stderr.includes('Containing directory path doesn\'t exist'));
        done();
      });
  });

})
