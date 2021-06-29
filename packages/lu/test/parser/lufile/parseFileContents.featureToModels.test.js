/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const parseFile = require('./../../../src/parser/lufile/parseFileContents');
var chai = require('chai');
var assert = chai.assert;
describe('Model as feature definitions', function () {
    describe('Features to intent', function(){
        it('Intent cannot add itself as a feature', function(done) {
            let luFile = `
                # test
                - one 
                @ intent test usesFeature test
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        })
        it('Feature to an intent must be defined', function (done) {
            let luFile = `
                @ intent xyz usesFeature abc

                # xyz 
                - test
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });

        it('Intent can be added as a feature to another intent', function (done) {
            let luFile = `
                @ intent xyz usesFeature abc

                # xyz 
                - test

                # abc
                - foo
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.intents.length, 2);
                    assert.equal(res.LUISJsonStructure.intents[0].name, 'xyz');
                    assert.equal(res.LUISJsonStructure.intents[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].features[0].modelName, 'abc');
                    done();
                })
                .catch(err => done(err))
        });

        it('Simple entity can be added as a feature to an intent', function(done) {
            let luFile = `
                @ intent abc usesFeature simple1
                @ ml simple1
                # abc 
                - test
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.intents.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].name, 'abc');
                    assert.equal(res.LUISJsonStructure.intents[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].features[0].modelName, 'simple1');
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'simple1');
                    done();
                })
                .catch(err => done(err))
        });

        it('Prebuilt entity can be added as a feature to an intent', function(done) {
            let luFile = `
                @ intent abc usesFeature number
                @ prebuilt number
                # abc 
                - test
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.intents.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].name, 'abc');
                    assert.equal(res.LUISJsonStructure.intents[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].features[0].modelName, 'number');
                    assert.equal(res.LUISJsonStructure.prebuiltEntities.length, 1);
                    assert.equal(res.LUISJsonStructure.prebuiltEntities[0].name, 'number');
                    done();
                })
                .catch(err => done(err))
        });

        it('list entity can be added as a feature to an intent', function(done) {
            let luFile = `
                @ intent abc usesFeature number2
                @ list number2
                # abc 
                - test
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.intents.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].name, 'abc');
                    assert.equal(res.LUISJsonStructure.intents[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].features[0].modelName, 'number2');
                    assert.equal(res.LUISJsonStructure.closedLists.length, 1);
                    assert.equal(res.LUISJsonStructure.closedLists[0].name, 'number2');
                    done();
                })
                .catch(err => done(err))
        });

        it('Composite entity can be added as a feature to an intent', function(done) {
            let luFile = `
                @ intent abc usesFeature number2
                @ composite number2
                # abc 
                - test
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.intents.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].name, 'abc');
                    assert.equal(res.LUISJsonStructure.intents[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].features[0].modelName, 'number2');
                    assert.equal(res.LUISJsonStructure.composites.length, 1);
                    assert.equal(res.LUISJsonStructure.composites[0].name, 'number2');
                    done();
                })
                .catch(err => done(err))
        });

        it('Regex entity can be added as a feature to an intent', function(done) {
            let luFile = `
                @ intent abc usesFeature number2
                @ regex number2
                # abc 
                - test
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.intents.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].name, 'abc');
                    assert.equal(res.LUISJsonStructure.intents[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].features[0].modelName, 'number2');
                    assert.equal(res.LUISJsonStructure.regex_entities.length, 1);
                    assert.equal(res.LUISJsonStructure.regex_entities[0].name, 'number2');
                    done();
                })
                .catch(err => done(err))
        });

        it('multiple features can be assigned to an intent', function(done) {
            let luFile = `
                # test
                - one

                @ ml simple1
                @ intent test usesFeature simple1
                
                @ regex regex1
                @ intent test usesFeature regex1

                @ list list1
                @ intent test usesFeature list1

                @ composite c1
                @ intent test usesFeature c1

                @ prebuilt number
                @ prebuilt age
                @ intent test usesFeatures number, age

                @ phraselist pl1 = 
                    - one
                    - two
                @ intent test usesFeatures pl1, test2
                # test2
                - abc
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.intents.length, 2);
                    assert.equal(res.LUISJsonStructure.intents[0].name, 'test');
                    assert.equal(res.LUISJsonStructure.intents[0].features.length, 8);
                    assert.equal(res.LUISJsonStructure.intents[0].features.filter(item => item.modelName).length, 7);
                    assert.equal(res.LUISJsonStructure.intents[0].features.filter(item => item.featureName).length, 1);
                    done();
                })
                .catch(err => done(err))
        })

        it('Duplicates are handled correctly', function(done) {
            let luFile = `
                # test
                - one

                @ ml simple1
                @ intent test usesFeature simple1
                
                @ regex regex1
                @ intent test usesFeature regex1

                @ list list1
                @ intent test usesFeature list1

                @ composite c1
                @ intent test usesFeature c1

                @ prebuilt number
                @ prebuilt age
                @ intent test usesFeatures number, age

                @ phraselist pl1 = 
                    - one
                    - two
                @ intent test usesFeature pl1, number, age, c1, list1, regex1,simple1, test2

                # test2
                - abc
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.intents.length, 2);
                    assert.equal(res.LUISJsonStructure.intents[0].name, 'test');
                    assert.equal(res.LUISJsonStructure.intents[0].features.length, 8);
                    assert.equal(res.LUISJsonStructure.intents[0].features.filter(item => item.modelName).length, 7);
                    assert.equal(res.LUISJsonStructure.intents[0].features.filter(item => item.featureName).length, 1);
                    done();
                })
                .catch(err => done(err))
        });

        it('phraseList can be added as a feature to an intent of same name', function(done) {
            let luFile = `
                # test
                - one

                @ intent test usesFeature test

                @ phraselist test(interchangeable) =
                    - one, two
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.intents.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].name, 'test');
                    assert.equal(res.LUISJsonStructure.intents[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].features[0].featureName, 'test');
                    done();
                })
                .catch(err => done(err))
        });

        it('phraseList can be added as a feature to an intent preferentially when there are both ml entity and phraseList of same name', function(done) {
            let luFile = `
                # test
                - one

                @ intent test usesFeatures abc

                @ ml abc usesFeature abc

                @ phraselist abc(interchangeable) =
                    - a, b
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.intents.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].name, 'test');
                    assert.equal(res.LUISJsonStructure.intents[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].features[0].featureName, 'abc');
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'abc');
                    assert.equal(res.LUISJsonStructure.entities[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].features[0].featureName, 'abc');
                    done();
                })
                .catch(err => done(err))
        });

        it('both phraseList and ml entity of same name can be added as a feature to an intent when using two same features', function(done) {
            let luFile = `
                # test
                - one

                @ intent test usesFeatures abc, abc

                @ ml abc usesFeature abc

                @ phraselist abc(interchangeable) =
                    - a, b
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.intents.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].name, 'test');
                    assert.equal(res.LUISJsonStructure.intents[0].features.length, 2);
                    assert.equal(res.LUISJsonStructure.intents[0].features[0].featureName, 'abc');
                    assert.equal(res.LUISJsonStructure.intents[0].features[1].modelName, 'abc');
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'abc');
                    assert.equal(res.LUISJsonStructure.entities[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].features[0].featureName, 'abc');
                    done();
                })
                .catch(err => done(err))
        });
    });

    describe('Entity as feature to entity', function() {
        it('Entity cannot add itself as a feature', function(done) {
            let luFile = `
                @ ml s1
                @ s1 usesFeature s1
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        })
        it('Simple entity can be added as a feature to a simple', function(done) {
            let luFile = `
                @ ml abc usesFeature simple1
                @ ml simple1
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 2);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'abc');
                    assert.equal(res.LUISJsonStructure.entities[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].features[0].modelName, 'simple1');
                    assert.equal(res.LUISJsonStructure.entities[1].name, 'simple1');
                    done();
                })
                .catch(err => done(err))
        });

        it('Simple entity can be added as a feature to a regex entity', function(done) {
            let luFile = `
                @ ml abc usesFeature simple1
                @ regex simple1
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'abc');
                    assert.equal(res.LUISJsonStructure.entities[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].features[0].modelName, 'simple1');
                    done();
                })
                .catch(err => done(err))
        });

        it('Simple entity can be added as a feature to a list entity', function(done) {
            let luFile = `
                @ ml abc usesFeature simple1
                @ list simple1
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'abc');
                    assert.equal(res.LUISJsonStructure.entities[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].features[0].modelName, 'simple1');
                    done();
                })
                .catch(err => done(err))
        });

        it('Simple entity can be added as a feature to a composite entity', function(done) {
            let luFile = `
                @ ml abc usesFeature simple1
                @ composite simple1
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'abc');
                    assert.equal(res.LUISJsonStructure.entities[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].features[0].modelName, 'simple1');
                    done();
                })
                .catch(err => done(err))
        });

        it('Simple entity can be added as a feature to a prebuilt entity', function(done) {
            let luFile = `
                @ ml abc usesFeature number
                @ prebuilt number
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'abc');
                    assert.equal(res.LUISJsonStructure.entities[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].features[0].modelName, 'number');
                    done();
                })
                .catch(err => done(err))
        });

        it('phraseList can be added as a feature to an entity of same name', function(done) {
            let luFile = `
                @ ml abc usesFeature abc

                @ phraselist abc(interchangeable) =
                    - a, b
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'abc');
                    assert.equal(res.LUISJsonStructure.entities[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].features[0].featureName, 'abc');
                    done();
                })
                .catch(err => done(err))
        });

        it('phraseList can be added as a feature to an entity preferentially when there are both ml entity and phraseList of same name', function(done) {
            let luFile = `
                @ ml test usesFeatures abc

                @ ml abc usesFeature abc

                @ phraselist abc(interchangeable) =
                    - a, b
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 2);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'test');
                    assert.equal(res.LUISJsonStructure.entities[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].features[0].featureName, 'abc');
                    assert.equal(res.LUISJsonStructure.entities[1].name, 'abc');
                    assert.equal(res.LUISJsonStructure.entities[1].features.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[1].features[0].featureName, 'abc');
                    done();
                })
                .catch(err => done(err))
        });

        it('both phraseList and ml entity of same name can be added as a feature to an entity when using two same features', function(done) {
            let luFile = `
                @ ml test usesFeatures abc, abc

                @ ml abc usesFeature abc

                @ phraselist abc(interchangeable) =
                    - a, b
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 2);
                    assert.equal(res.LUISJsonStructure.entities[0].name, 'test');
                    assert.equal(res.LUISJsonStructure.entities[0].features.length, 2);
                    assert.equal(res.LUISJsonStructure.entities[0].features[0].featureName, 'abc');
                    assert.equal(res.LUISJsonStructure.entities[0].features[1].modelName, 'abc');
                    assert.equal(res.LUISJsonStructure.entities[1].name, 'abc');
                    assert.equal(res.LUISJsonStructure.entities[1].features.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[1].features[0].featureName, 'abc');
                    done();
                })
                .catch(err => done(err))
        });
    });
    it('Circular dependency for usesFeature is not allowed - simple case', function(done) {
        let luFile = `
            @ list l1 usesFeature s2
            @ ml s2 usesFeature l1
        `;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('Circular dependency for usesFeature is not allowed - complex case', function(done) {
        let luFile = `
            # test
            - abc
            
            # test1
            - xyz
            
            # test2
            - 123
            
            > test::test test -> test1 -> test2 -> s1 -> test
            @ intent test usesFeature test1
            
            > test1::test test1 -> test2 -> s1 -> test
            @ intent test1 usesFeature test2
            
            > test2::test test2 -> s1 -> test
            @ intent test2 usesFeature s1
            
            > s1::test s1 -> test
            @ ml s1
            @ s1 usesFeature test
        `;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });


});