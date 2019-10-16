/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var chai = require('chai');
var assert = chai.assert;
const testData = require('./../../fixtures/testcases/translate-testcase-data');
const translate = require('./../../../src/parser/lufile/translate-helpers');
const retCode = require('./../../../src/parser/lufile/enums/CLI-errors');
const helpers = require('./../../../src/parser/lufile/helpers');
const NEWLINE = require('os').EOL;
const TRANSLATE_KEY = 'd825d5ac21d643f89761de3679fd0fb3';

describe('With the parseAndTranslate method', function() {
    it('Translating comments can be skipped', function(done) {
        translate.parseAndTranslate(`> This is a comment`, TRANSLATE_KEY, testData.tests.intentsAndUtterancesNC.langCode, '', false, false, false)
            .then(function(res) {
                assert.equal(helpers.sanitizeNewLines(res), helpers.sanitizeNewLines(`> This is a comment\n`));
                done();
            })
            .catch(err => done(err));
    });

    it('Bad lu file input throws', function(done) {
        if (!TRANSLATE_KEY) {
            this.skip();
        }
        translate.parseAndTranslate(testData.tests.badLu.luFile, TRANSLATE_KEY, testData.tests.badLu.langCode, '', false, false, false)
            .then(res => done(res)) 
            .catch(function(err) {
                assert.equal(err.errCode, retCode.errorCode.INVALID_INPUT_FILE);
                done();
            })
    });

    xit('References can be skipped from being translated', async function(done) {
        if (!TRANSLATE_KEY) {
            this.skip();
        }
        await translate.parseAndTranslate(testData.tests.fileRef.luFile, TRANSLATE_KEY, testData.tests.fileRef.langCode, '', false, false, false)
            .then(function(res) {
                assert.equal(helpers.sanitizeNewLines(res), helpers.sanitizeNewLines(testData.tests.fileRef.luFile + NEWLINE));
                done();
            })
            .catch(err => done(err))
    });

    xit('Invalid key throws', async function(done) {
        if (!TRANSLATE_KEY) {
            this.skip();
        }
        try {
            await translate.parseAndTranslate(`# Greeting
            -hi
            `, TRANSLATE_KEY + '2', testData.tests.badLu.langCode, '', false, false, false)
        } catch (err) {
            assert.equal(err.errCode, retCode.errorCode.TRANSLATE_SERVICE_FAIL);
            done(err);
        }
        done();
    }); 

    xit('Invalid key with comments throws', async function(done) {
        if (!TRANSLATE_KEY) {
            this.skip();
        }
        await translate.parseAndTranslate(`> test comment
`, TRANSLATE_KEY + '2', testData.tests.badLu.langCode, '', true, false, false)
            .then(function(res) {
                done(res);
            }) 
            .catch(function(err) {
                assert.equal(err.errCode, retCode.errorCode.TRANSLATE_SERVICE_FAIL);
                done(err);
            })
    });

    xit('Nested entity references throws', function(done) {
        if (!TRANSLATE_KEY) {
            this.skip();
        }
        translate.parseAndTranslate(`# Greeting
        - hi {userName = foo {firstName = bar}}
`, TRANSLATE_KEY, testData.tests.badLu.langCode, '', false, false, true)
            .then(function(res) {
                done(res);
            }) 
            .catch(function(err) {
                assert.equal(err.errCode, retCode.errorCode.INVALID_INPUT);
                done(err);
            })
    });
    
    xit('Invalid key with QnA throws', function(done) {
        if (!TRANSLATE_KEY) {
            this.skip();
        }
        translate.parseAndTranslate(`# ? Greeting
        - hi
`, TRANSLATE_KEY + '2', testData.tests.badLu.langCode, '', false, false, false)
            .then(function(res) {
                done(res);
            }) 
            .catch(function(err) {
                assert.equal(err.errCode, retCode.errorCode.TRANSLATE_SERVICE_FAIL);
                done(err);
            })
    });

    it('Intent only is handled correctly', function(done) {
        if (!TRANSLATE_KEY) {
            this.skip();
        }
        translate.parseAndTranslate(`# Greeting
`, TRANSLATE_KEY, testData.tests.badLu.langCode, '', false, false, true)
            .then(function() {
                done();
            }) 
            .catch(function() {
                done('Test Fail! Threw when not expected');
            })
    });
})
