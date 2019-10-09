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

        it('Role definitions are de-duped', function(done){
            let luFile = `
                @simple s1 r1, r1
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities[0].roles.length, 1);
                    assert.deepEqual(res.LUISJsonStructure.entities[0].roles, ['r1']);
                    done();
                })
                .catch(err => done(err))
        });

        it('Duplicate entity definitions is not allowed', function(done) {
            let luFile = `
                @simple a1 r1
                @regex a1 r2
            `;
            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });

        it('Role names cannot be the same as entity name', function(done) {
            let luFile = `
                @simple a1 r1
                @regex re1 a1
            `;
            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
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
                    assert.deepEqual(res.LUISJsonStructure.entities[0].roles, ['r2', 'r1']);
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

        it('Empty regex definition throws', function(done){
            let luFile = `
                @regex foo = //
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });
    });

    describe('Phrase lists are handled correctly', function(done){
        it('Basic phrase list definition is handled correctly', function(done) {
            let luFile = `
                @phraselist xyz
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.model_features.length, 1);
                    assert.equal(res.LUISJsonStructure.model_features[0].name, 'xyz');
                    done();assert.equal(res.LUISJsonStructure.model_features[0].name, 'xyz');
                })
                .catch(err => done(err))
        });

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

        it('Inline phrase list definition throws', function(done) {
            let luFile = `
                @phraselist xyz = abc
            `;

            parseFile.parseFile(luFile)
                .then(res => done(err))
                .catch(err => done())
        });

        it('Phrase list modelled as interchangeable is handled correctly', function(done) {
            let luFile = `
                @phraselist xyz(interchangeable)
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.model_features.length, 1);
                    assert.equal(res.LUISJsonStructure.model_features[0].name, 'xyz');
                    assert.equal(res.LUISJsonStructure.model_features[0].mode, true);
                    done();
                })
                .catch(err => done(err))
        });

        it('Phrase list with list of values is handled correctly', function(done) {
            let luFile = `
                @phraselist xyz = 
                    - one
                    - two
                    - three
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.model_features.length, 1);
                    assert.equal(res.LUISJsonStructure.model_features[0].name, 'xyz');
                    assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                    assert.equal(res.LUISJsonStructure.model_features[0].words, 'one,two,three');
                    done();
                })
                .catch(err => done(err))
        });

        it('Phrase list with list of values is handled correctly with interchangeable', function(done) {
            let luFile = `
                @phraselist xyz(interchangeable) = 
                    - one
                    - two
                    - three
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.model_features.length, 1);
                    assert.equal(res.LUISJsonStructure.model_features[0].name, 'xyz');
                    assert.equal(res.LUISJsonStructure.model_features[0].mode, true);
                    assert.equal(res.LUISJsonStructure.model_features[0].words, 'one,two,three');
                    done();
                })
                .catch(err => done(err))
        });

        it('Phrase lists cannot have roles', function(done) {
            let luFile = `
                @phraselist xyz(interchangeable) hasRoles r1 = 
                    - one
                    - two
                    - three
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });

        it('Phrase lists cannot have roles', function(done) {
            let luFile = `
                @phraselist xyz(interchangeable)
                @xyz hasRoles r1
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });

        it('Phrase list with comma separated values is handled correctly', function(done) {
            let luFile = `
                @phraselist xyz = 
                    - one, two
                    - three, four
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.model_features.length, 1);
                    assert.equal(res.LUISJsonStructure.model_features[0].name, 'xyz');
                    assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                    assert.equal(res.LUISJsonStructure.model_features[0].words, 'one,two,three,four');
                    done();
                })
                .catch(err => done(err))
        });

        it('Phrase list values can be segregated', function(done) {
            let luFile = `
                @phraselist xyz = 
                    - one, two
                @phraselist xyz = 
                    - three, four
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.model_features.length, 1);
                    assert.equal(res.LUISJsonStructure.model_features[0].name, 'xyz');
                    assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                    assert.equal(res.LUISJsonStructure.model_features[0].words, 'one,two,three,four');
                    done();
                })
                .catch(err => done(err))
        });

        it('Phrase list with semi-colon separated values is handled correctly', function(done) {
            let luFile = `
                @phraselist xyz = 
                    - one;two
                    - three, four
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.model_features.length, 1);
                    assert.equal(res.LUISJsonStructure.model_features[0].name, 'xyz');
                    assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                    assert.equal(res.LUISJsonStructure.model_features[0].words, 'one,two,three,four');
                    done();
                })
                .catch(err => done(err))
        });

        it('Phrase list definition can be separated', function(done) {
            let luFile = `
                @phraselist xyz
                @xyz =
                    - one;two
                @xyz =
                    - three, four
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.model_features.length, 1);
                    assert.equal(res.LUISJsonStructure.model_features[0].name, 'xyz');
                    assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                    assert.equal(res.LUISJsonStructure.model_features[0].words, 'one,two,three,four');
                    done();
                })
                .catch(err => done(err))
        });

        it('Interchangeable phrase list definition can be separated', function(done) {
            let luFile = `
                @phraselist xyz(interchangeable)
                @xyz =
                    - one;two
                @xyz =
                    - three, four
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.model_features.length, 1);
                    assert.equal(res.LUISJsonStructure.model_features[0].name, 'xyz');
                    assert.equal(res.LUISJsonStructure.model_features[0].mode, true);
                    assert.equal(res.LUISJsonStructure.model_features[0].words, 'one,two,three,four');
                    done();
                })
                .catch(err => done(err))
        })

        it('missing entity name for phrase list throws', function(done) {
            let luFile = `
                @xyz = 
                    - one, two
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });
    });

    describe('Prebuilt entity types', function(done) {
        it('Basic prebuilt entity definition works', function(done){
            let luFile = `
                @prebuilt number
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.prebuiltEntities.length, 1);
                    assert.equal(res.LUISJsonStructure.prebuiltEntities[0].name, 'number');
                    done();
                })
                .catch(err => done(err))
        })

        it('Basic prebuilt entity definition with roles works', function(done){
            let luFile = `
                @prebuilt number age
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.prebuiltEntities.length, 1);
                    assert.equal(res.LUISJsonStructure.prebuiltEntities[0].name, 'number');
                    assert.equal(res.LUISJsonStructure.prebuiltEntities[0].roles.length, 1);
                    assert.deepEqual(res.LUISJsonStructure.prebuiltEntities[0].roles, ['age']);
                    done();
                })
                .catch(err => done(err))
        })

        it('Basic prebuilt entity definition with roles works', function(done){
            let luFile = `
                @prebuilt number
                @number hasRole age
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.prebuiltEntities.length, 1);
                    assert.equal(res.LUISJsonStructure.prebuiltEntities[0].name, 'number');
                    assert.equal(res.LUISJsonStructure.prebuiltEntities[0].roles.length, 1);
                    assert.deepEqual(res.LUISJsonStructure.prebuiltEntities[0].roles, ['age']);
                    done();
                })
                .catch(err => done(err))
        })

        it('Basic prebuilt entity definition with roles works', function(done){
            let luFile = `
                @prebuilt number
                @number hasRole age
                @number hasRoles r1, r2
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.prebuiltEntities.length, 1);
                    assert.equal(res.LUISJsonStructure.prebuiltEntities[0].name, 'number');
                    assert.equal(res.LUISJsonStructure.prebuiltEntities[0].roles.length, 3);
                    assert.deepEqual(res.LUISJsonStructure.prebuiltEntities[0].roles, ['age', 'r1', 'r2']);
                    done();
                })
                .catch(err => done(err))
        });

        it('Prebuilt explicitly labelled in an utterance throws', function(done){
            let luFile = `
                # test
                - this is a {number=one}

                @prebuilt number
                @number hasRole age
                @number hasRoles r1, r2
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });

        it('Invalid prebuilt entity throws', function(done){
            let luFile = `
                @prebuilt xyz
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });

        it('Valid prebuilt entity not available for a specific locale throws', function(done){
            let luFile = `
                @prebuilt personName
            `;

            parseFile.parseFile(luFile, false, 'de-de')
                .then(res => done(res))
                .catch(err => done())
        });
    });

    describe('Composite entity definitions', function(){
        it('Basic definition is handled correctly', function(done) {
            let luFile = `
                @composite name
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.composites.length, 1);
                    assert.equal(res.LUISJsonStructure.composites[0].name, 'name');
                    done();
                })
                .catch(err => done(err))
        });

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

        it('Basic definition with roles is handled correctly', function(done) {
            let luFile = `
                @composite name hasRoles r1, r2
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.composites.length, 1);
                    assert.equal(res.LUISJsonStructure.composites[0].name, 'name');
                    assert.equal(res.LUISJsonStructure.composites[0].roles.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.composites[0].roles, ['r1', 'r2']);
                    done();
                })
                .catch(err => done(err))
        });

        it('Basic inline child definition with roles is handled correctly', function(done) {
            let luFile = `
                @composite name hasRoles r1, r2 = [child1, child2]
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.composites.length, 1);
                    assert.equal(res.LUISJsonStructure.composites[0].name, 'name');
                    assert.equal(res.LUISJsonStructure.composites[0].roles.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.composites[0].roles, ['r1', 'r2']);
                    assert.equal(res.LUISJsonStructure.composites[0].children.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.composites[0].children, ['child1', 'child2']);
                    done();
                })
                .catch(err => done(err))
        });

        it('Basic list child definition with roles is handled correctly [variation 1]', function(done) {
            let luFile = `
                @composite name hasRoles r1, r2 = 
                    - [child1, child2]
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.composites.length, 1);
                    assert.equal(res.LUISJsonStructure.composites[0].name, 'name');
                    assert.equal(res.LUISJsonStructure.composites[0].roles.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.composites[0].roles, ['r1', 'r2']);
                    assert.equal(res.LUISJsonStructure.composites[0].children.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.composites[0].children, ['child1', 'child2']);
                    done();
                })
                .catch(err => done(err))
        });

        it('Basic list child definition with roles is handled correctly [variation 2]', function(done) {
            let luFile = `
                @composite name hasRoles r1, r2 = 
                    - child1;child2
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.composites.length, 1);
                    assert.equal(res.LUISJsonStructure.composites[0].name, 'name');
                    assert.equal(res.LUISJsonStructure.composites[0].roles.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.composites[0].roles, ['r1', 'r2']);
                    assert.equal(res.LUISJsonStructure.composites[0].children.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.composites[0].children, ['child1', 'child2']);
                    done();
                })
                .catch(err => done(err))
        });

        it('Basic list child definition with roles is handled correctly [variation 3]', function(done) {
            let luFile = `
                @composite name hasRoles r1, r2 = 
                    - child1
                    - child2
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.composites.length, 1);
                    assert.equal(res.LUISJsonStructure.composites[0].name, 'name');
                    assert.equal(res.LUISJsonStructure.composites[0].roles.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.composites[0].roles, ['r1', 'r2']);
                    assert.equal(res.LUISJsonStructure.composites[0].children.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.composites[0].children, ['child1', 'child2']);
                    done();
                })
                .catch(err => done(err))
        });

        it('Definition can be split up in various ways', function(done) {
            let luFile = `
                @composite name
                @name r1
                @name r2
                @name = 
                    - child1
                    - child2
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.composites.length, 1);
                    assert.equal(res.LUISJsonStructure.composites[0].name, 'name');
                    assert.equal(res.LUISJsonStructure.composites[0].roles.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.composites[0].roles, ['r1', 'r2']);
                    assert.equal(res.LUISJsonStructure.composites[0].children.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.composites[0].children, ['child1', 'child2']);
                    done();
                })
                .catch(err => done(err))
        });

        it('Duplicate composite entity definition throws', function(done){
            let luFile = `
                @composite x1 = [s1, number]
                @simple s1
                @prebuilt number
                @composite x1 = [s1, age]
                @prebuilt age
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        })
    });

    describe('Closed list definitions', function() {
        it('Simple defintion is handled correctly', function(done) {
            let luFile = `
                @list x1
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.closedLists.length, 1);
                    assert.equal(res.LUISJsonStructure.closedLists[0].name, 'x1');
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

        it('definition with roles is handled correctly', function(done){
            let luFile = `
                @list x1 r1, r2
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.closedLists.length, 1);
                    assert.equal(res.LUISJsonStructure.closedLists[0].name, 'x1');
                    assert.equal(res.LUISJsonStructure.closedLists[0].roles.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.closedLists[0].roles, ['r1', 'r2']);
                    done();
                })
                .catch(err => done(err))     
        });

        it('definition with roles and list is handled correctly', function(done){
            let luFile = `
                @list x1 r1, r2 = 
                    - a1:
                        - one
                        - two
                    - a2:
                        -three
                        -four
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.closedLists.length, 1);
                    assert.equal(res.LUISJsonStructure.closedLists[0].name, 'x1');
                    assert.equal(res.LUISJsonStructure.closedLists[0].roles.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.closedLists[0].roles, ['r1', 'r2']);
                    assert.equal(res.LUISJsonStructure.closedLists[0].subLists.length, 2);
                    assert.equal(res.LUISJsonStructure.closedLists[0].subLists[0].canonicalForm, 'a1');
                    assert.deepEqual(res.LUISJsonStructure.closedLists[0].subLists[0].list, ['one', 'two']);
                    assert.equal(res.LUISJsonStructure.closedLists[0].subLists[1].canonicalForm, 'a2');
                    assert.deepEqual(res.LUISJsonStructure.closedLists[0].subLists[1].list, ['three', 'four']);
                    done();
                })
                .catch(err => done(err))
        });

        it('definition can be separated', function(done){
            let luFile = `
                @list x1
                @x1 r1
                @ x1 r2
                @ x1 =  
                    - a1:
                        - one
                @ x1 = 
                    - a1:
                        - one
                        - two
                @x1 =
                    - a2:
                        -three, four
                @ x1 = 
                    - a2:
                        - three; four
                @x1 hasRoles a1, a2
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.closedLists.length, 1);
                    assert.equal(res.LUISJsonStructure.closedLists[0].name, 'x1');
                    assert.equal(res.LUISJsonStructure.closedLists[0].roles.length, 4);
                    assert.deepEqual(res.LUISJsonStructure.closedLists[0].roles, ['r1', 'r2', 'a1', 'a2']);
                    assert.equal(res.LUISJsonStructure.closedLists[0].subLists.length, 2);
                    assert.equal(res.LUISJsonStructure.closedLists[0].subLists[0].canonicalForm, 'a1');
                    assert.deepEqual(res.LUISJsonStructure.closedLists[0].subLists[0].list, ['one', 'two']);
                    assert.equal(res.LUISJsonStructure.closedLists[0].subLists[1].canonicalForm, 'a2');
                    assert.deepEqual(res.LUISJsonStructure.closedLists[0].subLists[1].list, ['three', 'four']);
                    done();
                })
                .catch(err => done(err))
        });

        it('Invalid list definition throws', function(done){
            let luFile = `
                @list x1 = 
                    - red
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });

        it('Explicitly labelled list entity in an utterance throws', function(done){
            let luFile = `
                # test
                - this is a {x1 = test}
                @list x1
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });
    });

    describe('Pattern.Any entity definition', function(){
        it('basic definition', function(done){
            let luFile = `
                @patternany p1
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.patternAnyEntities.length, 1);
                    assert.equal(res.LUISJsonStructure.patternAnyEntities[0].name, 'p1');
                    done();
                })
                .catch(err => done(err));
        });

        
        it('Entity names can have spaces', function (done) {
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

        it('basic definition with roles', function(done){
            let luFile = `
                @patternany p1 hasRoles r1, r2
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.patternAnyEntities.length, 1);
                    assert.equal(res.LUISJsonStructure.patternAnyEntities[0].name, 'p1');
                    assert.equal(res.LUISJsonStructure.patternAnyEntities[0].roles.length, 2);
                    assert.deepEqual(res.LUISJsonStructure.patternAnyEntities[0].roles, ['r1', 'r2']);
                    done();
                })
                .catch(err => done(err));
        })
    })
    
});