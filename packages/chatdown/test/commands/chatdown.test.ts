import {expect, test} from '@oclif/test'
import * as cp from 'child_process';
import * as path from 'path';

let pkg = require('../../package.json');
let assert = require('assert');
let sv = require('semver');


describe('chatdown', () => {

    it('should print the help contents when --help is passed as an argument', done => {
        cp.exec(`node ./bin/run chatdown --help`, (error, stdout, stderr) => {
            assert(stdout.includes, 'Chatdown cli tool used to parse chat dialogs (.chat file) into a mock transcript file');
            done();
        });
    });

    it('should print the help contents to stderr when no input is passed', done => {
        cp.exec(`node ./bin/run chatdown`, (error, stdout, stderr) => {
            assert(stdout.includes, 'Chatdown cli tool used to parse chat dialogs (.chat file) into a mock transcript file');
            done();
        });
    });

    it('should accept data as a pipe and output the results', done => {
        cp.exec(`(echo user=Joe && echo bot=LuliBot && echo LuliBot: hello! && echo joe:can I get some help?) | node ./bin/run chatdown`, (error, stdout) => {
            assert.doesNotThrow(() => JSON.parse(stdout));
            done();
        });
    });

    it('should throw when a malformed config options is encountered in the input', done => {
        cp.exec(`echo bot=LuliBot=joe | node ./bin/run chatdown`, (error, stdout, stderr) => {
            assert(stderr.trim().indexOf('Malformed configurations options detected. Options must be in the format optionName=optionValue') >= 0);
            done();
        });
    });

    it('should generate static based timestamps when --static is passed as an argument', done => {
        cp.exec(`(echo user=Joe && [ConversationUpdate=MembersAdded=Joe]) | node ./bin/run chatdown --static`, (error, stdout) => {
            assert.doesNotThrow(() => JSON.parse(stdout));
            done();
        });
    });

    it('should read from file when chat file is passed as an argument', done => {
        cp.exec(`node ./bin/run chatdown --chat ${path.join(__dirname, '../utils/cli.sample.chat')}`, (error, stdout) => {
            assert.doesNotThrow(() => JSON.parse(stdout));
            done();
        });
    });

    it('should process all files when a glob is passed in with the -f argument, and the -o is passed in for the output directory', done => {
        cp.exec(`node ./bin/run chatdown -f ./test/utils/*.sample.chat -o ./`, (error, stdout, stderr) => {
            assert(stdout.includes('Successfully wrote'));
            done();
        });
    });

    it('should process all files when a glob is passed in with the -f argument', done => {
        cp.exec(`node ./bin/run chatdown -f ./test/utils/*.sample.chat`, (error, stdout, stderr) => {
            assert(stdout.includes('Successfully wrote'));
            done();
        });
    });

    it('should not prefix [chatdown] to stdout when --prefix is not passed as an argument', done => {
        cp.exec(`echo bot=LuliBot=joe | node ./bin/run chatdown --prefix`, (error, stdout, stderr) => {
            assert.notEqual(stdout.startsWith(`[${pkg.name}]`), `It should not show the tag '[${pkg.name}]' when not using the argument --prefix`);
            done();
        });
    });

    it('should prefix [chatdown] to stderr when --prefix is passed as an argument', done => {
        cp.exec(`echo bot=LuliBot=joe | node ./bin/run chatdown --prefix`, (error, stdout, stderr) => {
            assert(stderr.includes(`[${pkg.name}]`), `It should show the tag '[${pkg.name}]' when using the argument --prefix`);
            done();
        });
    });

    it('throw error if invalid path in argument', done => {
        cp.exec(`node ./bin/run chatdown --chat aaaaa`, (error, stdout, stderr) => {
            assert(stderr.includes('no such file or directory'));
            done();
        });
    });

})
