/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const parseFile = require('../../../src/parser/lufile/parseFileContents');
var chai = require('chai');
var assert = chai.assert;
describe('V2 Entity definitions using @ notation', function () {
    describe('ML entity definition', function(){
        it('Entity names can have spaces', function (done) {
            let luFile = `
                @ml "foo bar"
                @ml 'a b'
            `;
            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 2);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'foo bar');
                    assert.equal(res.LUISJsonStructure.entities[1].name, 'a b');
                    done();
                })
                .catch(err => done(err))
        })
    })
    
    describe('other entity definitions', function() {
        it('regex entity names can have spaces', function (done) {
            let luFile = `
                @regex "foo bar"
                @regex 'a b'
            `;
            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.regex_entities.length, 2);
                    assert.equal(res.LUISJsonStructure.regex_entities[0].name, 'foo bar');
                    assert.equal(res.LUISJsonStructure.regex_entities[1].name, 'a b');
                    done();
                })
                .catch(err => done(err))
        });

        it('pattern.any entity names can have spaces', function (done) {
            let luFile = `
                @patternany "foo bar"
                @patternany 'a b'
            `;
            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.patternAnyEntities.length, 2);
                    assert.equal(res.LUISJsonStructure.patternAnyEntities[0].name, 'foo bar');
                    assert.equal(res.LUISJsonStructure.patternAnyEntities[1].name, 'a b');
                    done();
                })
                .catch(err => done(err))
        });

        it('Entity names can have spaces', function (done) {
            let luFile = `
                @list "foo bar"
                @list 'a b'
            `;
            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.closedLists.length, 2);
                    assert.equal(res.LUISJsonStructure.closedLists[0].name, 'foo bar');
                    assert.equal(res.LUISJsonStructure.closedLists[1].name, 'a b');
                    done();
                })
                .catch(err => done(err))
        });
    })
    
    describe('Composite entities', function() {
        it('Entity names can have spaces', function (done) {
            let luFile = `
                @composite "foo bar"
                @composite 'a b'
            `;
            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.composites.length, 2);
                    assert.equal(res.LUISJsonStructure.composites[0].name, 'foo bar');
                    assert.equal(res.LUISJsonStructure.composites[1].name, 'a b');
                    done();
                })
                .catch(err => done(err))
        });
    })
    
    describe('Phrase lists', function() {
        it('Entity names can have spaces', function (done) {
            let luFile = `
                @phraselist "foo bar"
                @phraselist 'a b'
            `;
            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.model_features.length, 2);
                    assert.equal(res.LUISJsonStructure.model_features[0].name, 'foo bar');
                    assert.equal(res.LUISJsonStructure.model_features[1].name, 'a b');
                    done();
                })
                .catch(err => done(err))
        });
    })
})