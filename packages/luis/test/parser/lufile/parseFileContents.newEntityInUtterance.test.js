/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const parseFile = require('../../../src/parser/lufile/parseFileContents');
var chai = require('chai');
var assert = chai.assert;
describe('V2 Entity definitions in utterances', function () {
    describe('@entityName in labelled utterance', function(){
        it('direct entity reference is handled correctly', function(done) {
            let luFile = `
                @ simple test
                # test
                - this is a {@test = one}
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'test');
                    assert.equal(res.LUISJsonStructure.utterances.length, 1);
                    assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 1);
                    assert.equal(res.LUISJsonStructure.utterances[0].entities[0].entity, 'test');
                    done();
                })
                .catch(err => done(err))
        });

        it('direct role reference is handled correctly', function(done) {
            let luFile = `
                @ simple test r1
                # test
                - this is another one {@r1 = one}
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'test');
                    assert.equal(res.LUISJsonStructure.entities[0].roles.length, 1);
                    assert.deepEqual(res.LUISJsonStructure.entities[0].roles, ['r1']);
                    assert.equal(res.LUISJsonStructure.utterances.length, 1);
                    assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 1);
                    assert.equal(res.LUISJsonStructure.utterances[0].entities[0].entity, 'test');
                    assert.equal(res.LUISJsonStructure.utterances[0].entities[0].role, 'r1');
                    done();
                })
                .catch(err => done(err))
        });

        it('Explicit role definition continues to work', function(done) {
            let luFile = `
                @simple test r1, r2
                # test
                - this is another {test:r1 = one}
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'test');
                    assert.equal(res.LUISJsonStructure.entities[0].roles.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.entities[0].roles, ['r1', 'r2']);
                    assert.equal(res.LUISJsonStructure.utterances.length, 1);
                    assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 1);
                    assert.equal(res.LUISJsonStructure.utterances[0].entities[0].entity, 'test');
                    assert.equal(res.LUISJsonStructure.utterances[0].entities[0].role, 'r1');
                    done();
                })
                .catch(err => done(err))
        });

        it('Roles can be added on the fly', function(done) {
            let luFile = `
                @simple test r1
                # test
                - this is another {test:r2 = one}
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'test');
                    assert.equal(res.LUISJsonStructure.entities[0].roles.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.entities[0].roles, ['r1', 'r2']);
                    assert.equal(res.LUISJsonStructure.utterances.length, 1);
                    assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 1);
                    assert.equal(res.LUISJsonStructure.utterances[0].entities[0].entity, 'test');
                    assert.equal(res.LUISJsonStructure.utterances[0].entities[0].role, 'r2');
                    done();
                })
                .catch(err => done(err))
        });

        it('Without prior definition, @xxx in utterance is treated as simple entity definition', function(done) {
            let luFile = `
                # test
                - this is another {@test = one}
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'test');
                    assert.equal(res.LUISJsonStructure.utterances.length, 1);
                    assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 1);
                    assert.equal(res.LUISJsonStructure.utterances[0].entities[0].entity, 'test');
                    done();
                })
                .catch(err => done(err))
        });

        it('Multiple labels are handled correctly', function(done) {
            let luFile = `
                # test
                - this is another {@from = one} from {@to = tokyo}
                
                @ simple x1 from, to
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'x1');
                    assert.equal(res.LUISJsonStructure.entities[0].roles.length, 2);
                    assert.equal(res.LUISJsonStructure.utterances.length, 1);
                    assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 2);
                    assert.equal(res.LUISJsonStructure.utterances[0].entities[0].entity, 'x1');
                    assert.equal(res.LUISJsonStructure.utterances[0].entities[0].role, 'from');
                    assert.equal(res.LUISJsonStructure.utterances[0].entities[1].entity, 'x1');
                    assert.equal(res.LUISJsonStructure.utterances[0].entities[1].role, 'to');
                    done();
                })
                .catch(err => done(err))
        });

        it('Without prior definition, @xxx:yyy in utterance is treated as simple entity definition with a role', function(done) {
            let luFile = `
                # test
                - this is another {@test:x1 = one}
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'test');
                    assert.equal(res.LUISJsonStructure.entities[0].roles.length, 1);
                    assert.deepEqual(res.LUISJsonStructure.entities[0].roles, ['x1']);
                    assert.equal(res.LUISJsonStructure.utterances.length, 1);
                    assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 1);
                    assert.equal(res.LUISJsonStructure.utterances[0].entities[0].entity, 'test');
                    assert.equal(res.LUISJsonStructure.utterances[0].entities[0].role, 'x1');
                    done();
                })
                .catch(err => done(err))
        });
    });

    describe('Patterns with new @entity notation', function() {
        it('Basic pattern definition is handled correctly', function(done) {
            let luFile = `
                # test
                - this is a {@pattern}
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.patternAnyEntities.length, 1);
                    assert.equal(res.LUISJsonStructure.patternAnyEntities[0].name, 'pattern');
                    assert.equal(res.LUISJsonStructure.patterns.length, 1);
                    assert.equal(res.LUISJsonStructure.patterns[0].pattern, 'this is a {pattern}');
                    done();
                })
                .catch(err => done(err))
        })

        it('Role reference is handled correctly', function(done) {
            let luFile = `
                # test
                - this is a {@r1}
                
                @patternany test r1
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.patternAnyEntities.length, 1);
                    assert.equal(res.LUISJsonStructure.patternAnyEntities[0].name, 'test');
                    assert.equal(res.LUISJsonStructure.patternAnyEntities[0].roles.length, 1);
                    assert.deepEqual(res.LUISJsonStructure.patternAnyEntities[0].roles, ['r1']);
                    assert.equal(res.LUISJsonStructure.patterns.length, 1);
                    assert.equal(res.LUISJsonStructure.patterns[0].pattern, 'this is a {test:r1}');
                    done();
                })
                .catch(err => done(err))
        })

        it('Role reference is handled correctly', function(done) {
            let luFile = `
                # test
                - this is a {@r1}
                
                @simple test r1
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'test');
                    assert.equal(res.LUISJsonStructure.entities[0].roles.length, 1);
                    assert.deepEqual(res.LUISJsonStructure.entities[0].roles, ['r1']);
                    assert.equal(res.LUISJsonStructure.patterns.length, 1);
                    assert.equal(res.LUISJsonStructure.patterns[0].pattern, 'this is a {test:r1}');
                    done();
                })
                .catch(err => done(err))
        })

        it('Multiple entities with Role reference is handled correctly', function(done) {
            let luFile = `
                # test
                - this is a {@r1} from {@list1}
                
                @simple test r1
                @list list1 r2 =
                    - one:
                        - uno
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'test');
                    assert.equal(res.LUISJsonStructure.entities[0].roles.length, 1);
                    assert.deepEqual(res.LUISJsonStructure.entities[0].roles, ['r1']);
                    assert.equal(res.LUISJsonStructure.closedLists.length, 1);
                    assert.equal(res.LUISJsonStructure.closedLists[0].name, 'list1');
                    assert.equal(res.LUISJsonStructure.closedLists[0].roles.length, 1);
                    assert.deepEqual(res.LUISJsonStructure.closedLists[0].roles, ['r2']);
                    assert.equal(res.LUISJsonStructure.patterns.length, 1);
                    assert.equal(res.LUISJsonStructure.patterns[0].pattern, 'this is a {test:r1} from {list1}');
                    done();
                })
                .catch(err => done(err))
        })
        
        it('Multiple entities with Role reference is handled correctly', function(done) {
            let luFile = `
                # test
                - this is a {@r1} from {@r2}
                
                @simple test r1
                @list list1 r2 =
                    - one:
                        - uno
                
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'test');
                    assert.equal(res.LUISJsonStructure.entities[0].roles.length, 1);
                    assert.deepEqual(res.LUISJsonStructure.entities[0].roles, ['r1']);
                    assert.equal(res.LUISJsonStructure.closedLists.length, 1);
                    assert.equal(res.LUISJsonStructure.closedLists[0].name, 'list1');
                    assert.equal(res.LUISJsonStructure.closedLists[0].roles.length, 1);
                    assert.deepEqual(res.LUISJsonStructure.closedLists[0].roles, ['r2']);
                    assert.equal(res.LUISJsonStructure.patterns.length, 1);
                    assert.equal(res.LUISJsonStructure.patterns[0].pattern, 'this is a {test:r1} from {list1:r2}');
                    done();
                })
                .catch(err => done(err))
        })
    })
});