/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const parseFile = require('./../../../src/parser/lufile/parseFileContents');
const validateLUISBlob = require('./../../../src/parser/luisfile/parseLuisFile').validateLUISBlob;
var chai = require('chai');
var assert = chai.assert;
describe('V2 Entity definitions using @ notation', function () {
    describe('Simple entity definition', function(){
        it('Basic definition is handled correctly', function (done) {
            let luFile = `
                @ simple fooBar
            `;
            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'fooBar');
                    done();
                })
                .catch(err => done(err))
        });

        it('Basic definition (without space) is handled correctly', function (done) {
            let luFile = `
                @simple fooBar
            `;
            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'fooBar');
                    done();
                })
                .catch(err => done(err))
        });

        it('Entity names can have spaces', function (done) {
            let luFile = `
                @simple "foo bar"
                @simple 'a b'
            `;
            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 2);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'foo bar');
                    assert.equal(res.LUISJsonStructure.entities[1].name, 'a b');
                    done();
                })
                .catch(err => done(err))
        });

        it('Entity with role definition', function(done){
            let luFile = `
                @simple "foo bar" r1
                @simple 'a b' r2, r3
                @simple xyz hasRole r4
                @simple 123 hasRoles r5,r6
            `;
            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 4);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'foo bar');
                    assert.equal(res.LUISJsonStructure.entities[1].name, 'a b');
                    assert.equal(res.LUISJsonStructure.entities[2].name, 'xyz');
                    assert.equal(res.LUISJsonStructure.entities[3].name, '123');
                    assert.equal(res.LUISJsonStructure.entities[0].roles.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[1].roles.length, 2);
                    assert.equal(res.LUISJsonStructure.entities[2].roles.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[3].roles.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.entities[0].roles, ['r1']);
                    assert.deepEqual(res.LUISJsonStructure.entities[1].roles, ['r2','r3']);
                    assert.deepEqual(res.LUISJsonStructure.entities[2].roles, ['r4']);
                    assert.deepEqual(res.LUISJsonStructure.entities[3].roles, ['r5','r6']);
                    done();
                })
                .catch(err => done(err))
        });

        it('Pattern any entities are removed correctly', function(done){
            let luFile = `
                # test
                - this is a {foodType:r2}

                @ simple foodType r1
            `;
            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'foodType');
                    assert.deepEqual(res.LUISJsonStructure.entities[0].roles, ['r1','r2']);
                    assert.equal(res.LUISJsonStructure.patternAnyEntities.length, 0);
                    done();
                })
                .catch(err => done(err))
        });

        it('Entity name cannot be the same as entity type', function(done){
            let luFile = `
                @simple simple
            `;
            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        })

        it('Entity definition can be split across lines', function(done){
            let luFile = `
                @simple entity1
                @entity1 r1

                @simple entity2
                @entity2 hasRole r2

                @simple entity3
                @entity3 hasRoles r3

                @simple entity4
                @entity4 hasRoles r4,r5
                @entity4 r6
            `;
            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 4);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'entity1');
                    assert.equal(res.LUISJsonStructure.entities[0].roles.length, 1);
                    assert.deepEqual(res.LUISJsonStructure.entities[0].roles, ['r1']);
                    assert.equal(res.LUISJsonStructure.entities[1].name, 'entity2');
                    assert.equal(res.LUISJsonStructure.entities[1].roles.length, 1);
                    assert.deepEqual(res.LUISJsonStructure.entities[1].roles, ['r2']);
                    assert.equal(res.LUISJsonStructure.entities[2].name, 'entity3');
                    assert.equal(res.LUISJsonStructure.entities[2].roles.length, 1);
                    assert.deepEqual(res.LUISJsonStructure.entities[2].roles, ['r3']);
                    assert.equal(res.LUISJsonStructure.entities[3].name, 'entity4');
                    assert.equal(res.LUISJsonStructure.entities[3].roles.length, 3);
                    assert.deepEqual(res.LUISJsonStructure.entities[3].roles, ['r4', 'r5', 'r6']);
                    done();
                })
                .catch(err => done(err))
        });

        it('Entity definition without a type throws', function(done){
            let luFile = `
                @entity1 r1
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });

        it('Roles are unique', function(done) {
            let luFile = `
                @simple entity1 r1
                @simple entity2 r1
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });

        it('Simple entities in labelled utterance is handled correctly', function(done) {
            let luFile = `
                # test
                - this is a {value:r1 = test}

                @simple value r2
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'value');
                    assert.equal(res.LUISJsonStructure.entities[0].roles.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.entities[0].roles, ['r1', 'r2']);
                    done();
                })
                .catch(err => done(err))
        });
    });

    describe('RegEx entity definition', function() {
        it('Basic definition is handled correctly', function (done) {
            let luFile = `
                @ regex fooBar
            `;
            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.regex_entities.length, 1);
                    assert.equal(res.LUISJsonStructure.regex_entities[0].name, 'fooBar');
                    done();
                })
                .catch(err => done(err))
        });

        it('Basic definition (without space) is handled correctly', function (done) {
            let luFile = `
                @regex fooBar
            `;
            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.regex_entities.length, 1);
                    assert.equal(res.LUISJsonStructure.regex_entities[0].name, 'fooBar');
                    done();
                })
                .catch(err => done(err))
        });

        it('Entity names can have spaces', function (done) {
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

        it('Entity with role definition', function(done){
            let luFile = `
                @regex "foo bar" r1
                @regex 'a b' r2, r3
                @regex xyz hasRole r4
                @regex 123 hasRoles r5,r6
            `;
            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.regex_entities.length, 4);
                    assert.equal(res.LUISJsonStructure.regex_entities[0].name, 'foo bar');
                    assert.equal(res.LUISJsonStructure.regex_entities[1].name, 'a b');
                    assert.equal(res.LUISJsonStructure.regex_entities[2].name, 'xyz');
                    assert.equal(res.LUISJsonStructure.regex_entities[3].name, '123');
                    assert.equal(res.LUISJsonStructure.regex_entities[0].roles.length, 1);
                    assert.equal(res.LUISJsonStructure.regex_entities[1].roles.length, 2);
                    assert.equal(res.LUISJsonStructure.regex_entities[2].roles.length, 1);
                    assert.equal(res.LUISJsonStructure.regex_entities[3].roles.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.regex_entities[0].roles, ['r1']);
                    assert.deepEqual(res.LUISJsonStructure.regex_entities[1].roles, ['r2','r3']);
                    assert.deepEqual(res.LUISJsonStructure.regex_entities[2].roles, ['r4']);
                    assert.deepEqual(res.LUISJsonStructure.regex_entities[3].roles, ['r5','r6']);
                    done();
                })
                .catch(err => done(err))
        });

        it('Pattern any entities are removed correctly', function(done){
            let luFile = `
                # test
                - this is a {foodType:r2}

                @ regex foodType r1
            `;
            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.regex_entities.length, 1);
                    assert.equal(res.LUISJsonStructure.regex_entities[0].name, 'foodType');
                    assert.deepEqual(res.LUISJsonStructure.regex_entities[0].roles, ['r1','r2']);
                    assert.equal(res.LUISJsonStructure.patternAnyEntities.length, 0);
                    done();
                })
                .catch(err => done(err))
        });

        it('Entity name cannot be the same as entity type', function(done){
            let luFile = `
                @regex regex
            `;
            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        })

        it('Entity definition can be split across lines', function(done){
            let luFile = `
                @regex entity1
                @entity1 r1

                @regex entity2
                @entity2 hasRole r2

                @regex entity3
                @entity3 hasRoles r3

                @regex entity4
                @entity4 hasRoles r4,r5
                @entity4 r6
            `;
            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.regex_entities.length, 4);
                    assert.equal(res.LUISJsonStructure.regex_entities[0].name, 'entity1');
                    assert.equal(res.LUISJsonStructure.regex_entities[0].roles.length, 1);
                    assert.deepEqual(res.LUISJsonStructure.regex_entities[0].roles, ['r1']);
                    assert.equal(res.LUISJsonStructure.regex_entities[1].name, 'entity2');
                    assert.equal(res.LUISJsonStructure.regex_entities[1].roles.length, 1);
                    assert.deepEqual(res.LUISJsonStructure.regex_entities[1].roles, ['r2']);
                    assert.equal(res.LUISJsonStructure.regex_entities[2].name, 'entity3');
                    assert.equal(res.LUISJsonStructure.regex_entities[2].roles.length, 1);
                    assert.deepEqual(res.LUISJsonStructure.regex_entities[2].roles, ['r3']);
                    assert.equal(res.LUISJsonStructure.regex_entities[3].name, 'entity4');
                    assert.equal(res.LUISJsonStructure.regex_entities[3].roles.length, 3);
                    assert.deepEqual(res.LUISJsonStructure.regex_entities[3].roles, ['r4', 'r5', 'r6']);
                    done();
                })
                .catch(err => done(err))
        });

        it('Roles are unique', function(done) {
            let luFile = `
                @regex entity1 r1
                @regex entity2 r1
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });

        it('Regex entity can have inline definition', function(done) {
            let luFile = `
                @regex r1 = /[0-9]{6}/
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.regex_entities.length, 1);
                    assert.equal(res.LUISJsonStructure.regex_entities[0].name, 'r1');
                    assert.equal(res.LUISJsonStructure.regex_entities[0].regexPattern, '[0-9]{6}');
                    done();
                })
                .catch(err => done(err))
        });

        it('Duplicate definitions throws', function(done) {
            let luFile = `
                @regex r1 = /[0-9]{6}/
                @r1 = /[0-9]{7}/
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });

        it('Regex definition can be delayed', function(done) {
            let luFile = `
                @regex r1
                @r1 = /[0-9]{6}/
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.regex_entities.length, 1);
                    assert.equal(res.LUISJsonStructure.regex_entities[0].name, 'r1');
                    assert.equal(res.LUISJsonStructure.regex_entities[0].regexPattern, '[0-9]{6}');
                    done(); 
                })
                .catch(err => done(res))
        });

        it('Regex role definition can be delayed', function(done) {
            let luFile = `
                @regex r1
                @r1 = /[0-9]{6}/
                @r1 role1
                @r1 hasRole role2
                @r1 hasRoles role3, role4
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.regex_entities.length, 1);
                    assert.equal(res.LUISJsonStructure.regex_entities[0].name, 'r1');
                    assert.equal(res.LUISJsonStructure.regex_entities[0].regexPattern, '[0-9]{6}');
                    // assert.equal(res.LUISJsonStructure.regex_entities[0].roles.length, 4);
                    // assert.deepEqual(res.LUISJsonStructure.regex_entities[0].roles, ['role1', 'role2', 'role3', 'role4']);
                    done(); 
                })
                .catch(err => done(err))
        })

        it('Regex definition can pushed to next line', function(done) {
            let luFile = `
                @regex r1 =
                    - /[0-9]{6}/
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.regex_entities.length, 1);
                    assert.equal(res.LUISJsonStructure.regex_entities[0].name, 'r1');
                    assert.equal(res.LUISJsonStructure.regex_entities[0].regexPattern, '[0-9]{6}');
                    done(); 
                })
                .catch(err => done(err))
        });

    })
    
});