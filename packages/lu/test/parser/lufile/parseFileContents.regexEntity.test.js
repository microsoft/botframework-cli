/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const chai = require('chai');
const assert = chai.assert;
const parseFile = require('./../../../src/parser/lufile/parseFileContents').parseFile;
const luis = require('./../../../src/parser/luis/luis')
const hClasses = require('./../../../src/parser/lufile/classes/hclasses');
const translateHelpers = require('./../../../src/parser/lufile/translate-helpers');
const TRANSLATE_KEY = process.env.TRANSLATOR_KEY;

describe('Regex entities in .lu files', function() {
    it('are parsed correctly when a valid regex pattern is provided', function(done){
        let luFileContent = `$HRF-number:/hrf-[0-9]{6}/`;
        let regexEntity = new hClasses.regExEntity('HRF-number', 'hrf-[0-9]{6}');
        parseFile(luFileContent, false)
            .then(res => {
                assert.deepEqual(res.LUISJsonStructure.regex_entities[0], regexEntity);
                done();
            })
            .catch(err => done(`Test failed - ${err}`))
    });

    it('are parsed correctly when a valid regex pattern containing slash followed by colon is provided', function(done){
        let luFileContent = `$slash-colon:/[/:]/`;
        let regexEntity = new hClasses.regExEntity('slash-colon', '[/:]');
        parseFile(luFileContent, false)
            .then(res => {
                const actualRegexEntity = res.LUISJsonStructure.regex_entities[0];
                assert.deepEqual(actualRegexEntity, regexEntity, `Expected: ${JSON.stringify(regexEntity)} Actual: ${JSON.stringify(actualRegexEntity)}`);
                done();
            })
            .catch(err => done(`Test failed - ${err} - ${JSON.stringify(err)}`))
    });

    it('are parsed correctly when a valid regex pattern containing only slash followed by colon is provided', function(done){
        let luFileContent = `$slash-colon://:/`;
        let regexEntity = new hClasses.regExEntity('slash-colon', '/:');
        parseFile(luFileContent, false)
            .then(res => {
                const actualRegexEntity = res.LUISJsonStructure.regex_entities[0];
                assert.deepEqual(actualRegexEntity, regexEntity, `Expected: ${JSON.stringify(regexEntity)} Actual: ${JSON.stringify(actualRegexEntity)}`);
                done();
            })
            .catch(err => done(`Test failed - ${err} - ${JSON.stringify(err)}`))
    });

    it('throws correctly when an empty regex pattern is specified', function(done){
        let luFileContent = `$test://`;
        parseFile(luFileContent, false) 
            .then(res => done(`Test fail! Did not throw when expected`))
            .catch(err => done())
    });

    it('throws correctly when an invalid regex pattern is specified', function(done){
        let luFileContent = `$test:/hrf-[0-9]{6}`;
        parseFile(luFileContent, false) 
            .then(res => done(`Test fail! Did not throw when expected`))
            .catch(err => done())
    });

    it('throws correctly when multiple regex patterns have the same entity name', function(done){
        let luFileContent = `$test:/hrf-[0-9]{6}
$test:/udf-[0-9]{6}/`;
        parseFile(luFileContent, false) 
            .then(res => done(`Test fail! Did not throw when expected`))
            .catch(err => done())
    });

    it('throws correctly when regex entity name is not unique', function(done){
        let luFileContent = `$test:/hrf-[0-9]{6}
# test
- this is a {test=one} utterance`;
        parseFile(luFileContent, false) 
            .then(res => done(`Test fail! Did not throw when expected`))
            .catch(err => done())
    });

    it('correctly de-dupes when multiple regex entities with same name and pattern are defined in a lu file', function(done){
        let luFileContent = `$test:/hrf-[0-9]{6}/
$test:/hrf-[0-9]{6}/`;
        let regexEntity = new hClasses.regExEntity('test', 'hrf-[0-9]{6}');
        parseFile(luFileContent, false) 
            .then(res => {
                assert.equal(res.LUISJsonStructure.regex_entities.length, 1);
                assert.deepEqual(res.LUISJsonStructure.regex_entities[0], regexEntity);
                done();
            })
            .catch(err => done(`Test failed - ${JSON.stringify(err, null, 2)}`))
    });

    it('corectly collates multiple regex entities defined across different lu files', function(done) {
        let luFile1 = `$test:/hrf-[0-9]{6}/`;
        let luFile2 = `$test2:/udf-[0-9]{10}/`;
        let regexEntity1 = new hClasses.regExEntity('test', 'hrf-[0-9]{6}');
        let regexEntity2 = new hClasses.regExEntity('test2', 'udf-[0-9]{10}');
        parseFile(luFile1, false) 
            .then(res1 => {
                parseFile(luFile2, false)
                    .then(res2 => {
                            try {
                                let luisObj = new luis()
                                let luisList = [res1.LUISJsonStructure, res2.LUISJsonStructure]
                                luisObj.collate(luisList)
                                assert.equal(luisObj.regex_entities.length, 2);
                                assert.deepEqual(luisObj.regex_entities[0], regexEntity1);
                                assert.deepEqual(luisObj.regex_entities[1], regexEntity2);
                                done();
                            } catch (err) {
                                done(`Test failed 3- ${err, null, 2}`)
                            }
                    })
                    .catch(err => done(`Test failed 2- ${(err)}`))                
            })
            .catch(err => done(`Test failed 1- ${JSON.stringify(err, null, 2)}`))
    });

    it('throws when duplicate regex entities with different patterns are found across lu files', function(done) {
        let luFile1 = `$test:/hrf-[0-9]{6}/`;
        let luFile2 = `$test:/udf-[0-9]{10}/`;
        parseFile(luFile1, false) 
            .then(res1 => {
                parseFile(luFile2, false)
                    .then(res2 => {
                        try {
                            let luisObj = new luis()
                            let luisList = [res1.LUISJsonStructure, res2.LUISJsonStructure]
                            luisObj.collate(luisList)
                            console.log(JSON.stringify(res, null, 2));
                            done(`Test failed - did not throw when expected`);
                        } catch(err) {
                            done()
                        }
                    })
                    .catch(err => done())                
            })
            .catch(err => done())
    });

    it('throws when duplicate regex entities with different patterns are found across lu files', function(done) {
        let luFile1 = `$test:/hrf-[0-9]{6}/`;
        let luFile2 = `# test
- this is a {test=one} utterance`;
        parseFile(luFile1, false) 
            .then(res1 => {
                parseFile(luFile2, false)
                    .then(res2 => {
                        try {
                            let luisObj = new luis()
                            let luisList = [res1.LUISJsonStructure, res2.LUISJsonStructure]
                            luisObj.collate(luisList)
                            luisObj.validate()
                            done(`Test failed - did not throw when expected`);
                        } catch(err) {
                            done()
                        }
                    })
                    .catch(err => done())                
            })
            .catch(err => done())
    });

    it('correctly parses regex entity used in a pattern', function(done) {
        let luFile = `# test
- what is the email id for {hrf-number}

$hrf-number:/hrf-[0-9]{6}/`;
        let testPattern = new hClasses.pattern('what is the email id for {hrf-number}', 'test');
        let regexEntity = new hClasses.regExEntity('hrf-number', 'hrf-[0-9]{6}');
        parseFile(luFile, false)
            .then(res => {
                assert.deepEqual(res.LUISJsonStructure.regex_entities[0], regexEntity);
                assert.deepEqual(res.LUISJsonStructure.patterns[0], testPattern);
                assert.equal(res.LUISJsonStructure.intents[0].name, 'test');
                done();
            })
            .catch(err => done(err))
    });

    it('correctly parses regex entity used in a pattern', function(done) {
        let luFile = `# test
- update {hrf-number:from} to {hrf-number:to}

$hrf-number:/hrf-[0-9]{6}/`;
        let testPattern = new hClasses.pattern('update {hrf-number:from} to {hrf-number:to}', 'test');
        let regexEntity = new hClasses.regExEntity('hrf-number', 'hrf-[0-9]{6}', ['from', 'to']);
        parseFile(luFile, false)
            .then(res => {
                assert.deepEqual(res.LUISJsonStructure.regex_entities[0], regexEntity);
                assert.deepEqual(res.LUISJsonStructure.patterns[0], testPattern);
                assert.equal(res.LUISJsonStructure.intents[0].name, 'test');
                assert.equal(res.LUISJsonStructure.patternAnyEntities.length, 0);
                done();
            })
            .catch(err => done(err))
    });
});