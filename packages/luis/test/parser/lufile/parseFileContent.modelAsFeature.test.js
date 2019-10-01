/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const parseFile = require('./../../../src/parser/lufile/parseFileContents');
const validateLUISBlob = require('./../../../src/parser/luisfile/parseLuisFile').validateLUISBlob;
var chai = require('chai');
var assert = chai.assert;
describe('Model as feature definitions', function () {
    describe('Features to intent', function(){
        it('Intent can only have features and nothing else - roles throws', function (done) {
            let luFile = `
                @ intent xyz hasRoles r1
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });
        
        it('Intent can only have features and nothing else empty throws', function (done) {
            let luFile = `
                @ intent xyz
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });

        it('Intent must be defined before a feature can be added to it.', function(done) {
            let luFile = `
                @ intent getUserProfileIntent usesFeature city
                
                @ phraselist city(interchangeable) = 
                    - seattle
                    - space needle
                    - SEATAC
                    - SEA
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        })

        it('Features must be defined before they can be added.', function(done) {
            let luFile = `
                > phrase list as feature to intent (also applicable to entities)
                @ intent getUserProfileIntent usesFeature city
                
                # getUserProfileIntent
                - test
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });

        it('Phrase list can be added as a feature to an intent', function(done) {
            let luFile = `
                > phrase list as feature to intent (also applicable to entities)
                @ intent getUserProfileIntent usesFeature city
                
                # getUserProfileIntent
                - test
                
                @ phraselist city(interchangeable)
                @ city =
                    - Seattle
                    - SEATAC
                    - SEA
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.model_features.length, 1);
                    assert.equal(res.LUISJsonStructure.model_features[0].name, 'city');
                    assert.equal(res.LUISJsonStructure.model_features[0].mode, true);
                    assert.equal(res.LUISJsonStructure.model_features[0].words, 'Seattle,SEATAC,SEA');
                    assert.equal(res.LUISJsonStructure.model_features[0].activated, true);
                    assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                    assert.equal(res.LUISJsonStructure.intents.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].name, 'getUserProfileIntent');
                    assert.equal(res.LUISJsonStructure.intents[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].features[0].featureName, 'city');
                    done();
                })
                .catch(err => done(err))
        });

        it('Phrase list marked as interchangeable can be added as a feature to an intent', function(done) {
            let luFile = `
                > phrase list as feature to intent (also applicable to entities)
                @ intent getUserProfileIntent usesFeature city
                
                # getUserProfileIntent
                - test
                
                @ phraselist city
                @ city =
                    - Seattle
                    - SEATAC
                    - SEA
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.model_features.length, 1);
                    assert.equal(res.LUISJsonStructure.model_features[0].name, 'city');
                    assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                    assert.equal(res.LUISJsonStructure.model_features[0].words, 'Seattle,SEATAC,SEA');
                    assert.equal(res.LUISJsonStructure.model_features[0].activated, true);
                    assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                    assert.equal(res.LUISJsonStructure.intents.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].name, 'getUserProfileIntent');
                    assert.equal(res.LUISJsonStructure.intents[0].features.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].features[0].featureName, 'city');
                    done();
                })
                .catch(err => done(err))
        });

        it('Multiple phrase lists with different interchangeable definitions can be added as a feature to an intent', function(done) {
            let luFile = `
                > phrase list as feature to intent (also applicable to entities)
                @ intent getUserProfileIntent usesFeature city, city2
                
                # getUserProfileIntent
                - test
                
                @ phraselist city
                @ city =
                    - Seattle
                    - SEATAC
                    - SEA
                @ phraselist city2(interchangeable)
                @ city2 =
                    - portland
                    - PDX
            `;

            parseFile.parseFile(luFile)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.model_features.length, 2);
                    assert.equal(res.LUISJsonStructure.model_features[0].name, 'city');
                    assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                    assert.equal(res.LUISJsonStructure.model_features[0].words, 'Seattle,SEATAC,SEA');
                    assert.equal(res.LUISJsonStructure.model_features[0].activated, true);
                    assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                    assert.equal(res.LUISJsonStructure.model_features[1].name, 'city2');
                    assert.equal(res.LUISJsonStructure.model_features[1].mode, true);
                    assert.equal(res.LUISJsonStructure.model_features[1].words, 'portland,PDX');
                    assert.equal(res.LUISJsonStructure.model_features[1].activated, true);
                    assert.equal(res.LUISJsonStructure.model_features[1].enabledForAllModels, false);
                    assert.equal(res.LUISJsonStructure.intents.length, 1);
                    assert.equal(res.LUISJsonStructure.intents[0].name, 'getUserProfileIntent');
                    assert.equal(res.LUISJsonStructure.intents[0].features.length, 2);
                    assert.equal(res.LUISJsonStructure.intents[0].features[0].featureName, 'city');
                    assert.equal(res.LUISJsonStructure.intents[0].features[1].featureName, 'city2');
                    done();
                })
                .catch(err => done(err))
        });
    });

    describe('Features to entity', function() {
        describe('Prebuilt entity', function() {
            it('Features must be defined before they can be added.', function(done) {
                let luFile = `
                    @ prebuilt number
                    @ number usesFeature city3
                `;
    
                parseFile.parseFile(luFile)
                    .then(res => done(res))
                    .catch(err => done())
            });
    
            it('Entity must be defined before a feature can be assigned to it', function(done) {
                let luFile = `
                    @ number usesFeature city3
                `;
    
                parseFile.parseFile(luFile)
                    .then(res => done(res))
                    .catch(err => done())
            })
    
            it('Feature can be added to a prebuilt entity', function(done) {
                let luFile = `
                    @ phraselist city
                    @ city =
                        - Seattle
                        - SEATAC
                        - SEA
                    @ phraselist city2(interchangeable)
                    @ city2 =
                        - portland
                        - PDX
                    
                    @ prebuilt number
                    @ number usesFeature city
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.prebuiltEntities.length, 1);
                        assert.equal(res.LUISJsonStructure.prebuiltEntities[0].name, 'number');
                        assert.equal(res.LUISJsonStructure.prebuiltEntities[0].features.length, 1);
                        assert.equal(res.LUISJsonStructure.prebuiltEntities[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.model_features.length, 2);
                        assert.equal(res.LUISJsonStructure.model_features[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                        assert.equal(res.LUISJsonStructure.model_features[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.model_features[0].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.model_features[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features[1].mode, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.model_features[1].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].enabledForAllModels, undefined);
                        done();
                    })
                    .catch(err => done(err))
            });

            it('Feature, roles can be defined in the same line can be added to a prebuilt entity', function(done) {
                let luFile = `
                    @ phraselist city
                    @ city =
                        - Seattle
                        - SEATAC
                        - SEA
                    @ phraselist city2(interchangeable)
                    @ city2 =
                        - portland
                        - PDX
                    
                    @ prebuilt number hasRoles r1 usesFeature city 
                    @ number usesFeature city
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.prebuiltEntities.length, 1);
                        assert.equal(res.LUISJsonStructure.prebuiltEntities[0].name, 'number');
                        assert.equal(res.LUISJsonStructure.prebuiltEntities[0].features.length, 1);
                        assert.equal(res.LUISJsonStructure.prebuiltEntities[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.prebuiltEntities[0].roles.length, 1);
                        assert.deepEqual(res.LUISJsonStructure.prebuiltEntities[0].roles, ['r1']);
                        assert.equal(res.LUISJsonStructure.model_features.length, 2);
                        assert.equal(res.LUISJsonStructure.model_features[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                        assert.equal(res.LUISJsonStructure.model_features[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.model_features[0].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.model_features[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features[1].mode, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.model_features[1].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].enabledForAllModels, undefined);
                        done();
                    })
                    .catch(err => done(err))
            })

            it('Multiple features, roles can be defined in the same line can be added to a prebuilt entity', function(done) {
                let luFile = `
                    @ phraselist city
                    @ city =
                        - Seattle
                        - SEATAC
                        - SEA
                    @ phraselist city2(interchangeable)
                    @ city2 =
                        - portland
                        - PDX
                    
                    @ prebuilt number hasRoles r1, r2 usesFeatures city, city2 
                    @ number usesFeature city
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.prebuiltEntities.length, 1);
                        assert.equal(res.LUISJsonStructure.prebuiltEntities[0].name, 'number');
                        assert.equal(res.LUISJsonStructure.prebuiltEntities[0].features.length, 2);
                        assert.equal(res.LUISJsonStructure.prebuiltEntities[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.prebuiltEntities[0].features[1].featureName, 'city2');
                        assert.equal(res.LUISJsonStructure.prebuiltEntities[0].roles.length, 2);
                        assert.deepEqual(res.LUISJsonStructure.prebuiltEntities[0].roles, ['r1', 'r2']);
                        assert.equal(res.LUISJsonStructure.model_features.length, 2);
                        assert.equal(res.LUISJsonStructure.model_features[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                        assert.equal(res.LUISJsonStructure.model_features[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.model_features[0].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.model_features[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features[1].mode, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.model_features[1].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].enabledForAllModels, false);
                        done();
                    })
                    .catch(err => done(err))
            })
    
            it('Multiple features can be added to a prebuilt entity', function(done) {
                let luFile = `
                    @ phraselist city
                    @ city =
                        - Seattle
                        - SEATAC
                        - SEA
                    @ phraselist city2(interchangeable)
                    @ city2 =
                        - portland
                        - PDX
                    
                    @ prebuilt number
                    @ number usesFeature city, city2
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.prebuiltEntities.length, 1);
                        assert.equal(res.LUISJsonStructure.prebuiltEntities[0].name, 'number');
                        assert.equal(res.LUISJsonStructure.prebuiltEntities[0].features.length, 2);
                        assert.equal(res.LUISJsonStructure.prebuiltEntities[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.prebuiltEntities[0].features[1].featureName, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features.length, 2);
                        assert.equal(res.LUISJsonStructure.model_features[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                        assert.equal(res.LUISJsonStructure.model_features[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.model_features[0].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.model_features[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features[1].mode, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.model_features[1].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].enabledForAllModels, false);
                        done();
                    })
                    .catch(err => done(err))
            });

        });

        describe('Simple entity', function() {
            it('Features must be defined before they can be added.', function(done) {
                let luFile = `
                    @ simple x1
                    @ x1 usesFeature city3
                `;
    
                parseFile.parseFile(luFile)
                    .then(res => done(res))
                    .catch(err => done())
            });
    
            it('Entity must be defined before a feature can be assigned to it', function(done) {
                let luFile = `
                    @ x1 usesFeature city3
                `;
    
                parseFile.parseFile(luFile)
                    .then(res => done(res))
                    .catch(err => done())
            })
    
            it('Feature can be added to a simple entity', function(done) {
                let luFile = `
                    @ phraselist city
                    @ city =
                        - Seattle
                        - SEATAC
                        - SEA
                    @ phraselist city2(interchangeable)
                    @ city2 =
                        - portland
                        - PDX
                    
                    @ simple x1
                    @ x1 usesFeature city
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.entities.length, 1);
                        assert.equal(res.LUISJsonStructure.entities[0].name, 'x1');
                        assert.equal(res.LUISJsonStructure.entities[0].features.length, 1);
                        assert.equal(res.LUISJsonStructure.entities[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.model_features.length, 2);
                        assert.equal(res.LUISJsonStructure.model_features[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                        assert.equal(res.LUISJsonStructure.model_features[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.model_features[0].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.model_features[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features[1].mode, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.model_features[1].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].enabledForAllModels, undefined);
                        done();
                    })
                    .catch(err => done(err))
            })
    
            it('Multiple features can be added to a simple entity', function(done) {
                let luFile = `
                    @ phraselist city
                    @ city =
                        - Seattle
                        - SEATAC
                        - SEA
                    @ phraselist city2(interchangeable)
                    @ city2 =
                        - portland
                        - PDX
                    
                    @ simple x1
                    @ x1 usesFeature city, city2
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.entities.length, 1);
                        assert.equal(res.LUISJsonStructure.entities[0].name, 'x1');
                        assert.equal(res.LUISJsonStructure.entities[0].features.length, 2);
                        assert.equal(res.LUISJsonStructure.entities[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.entities[0].features[1].featureName, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features.length, 2);
                        assert.equal(res.LUISJsonStructure.model_features[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                        assert.equal(res.LUISJsonStructure.model_features[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.model_features[0].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.model_features[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features[1].mode, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.model_features[1].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].enabledForAllModels, false);
                        done();
                    })
                    .catch(err => done(err))
            });
        });

        describe('List entity', function() {
            it('Features must be defined before they can be added.', function(done) {
                let luFile = `
                    @ list x1
                    @ x1 usesFeature city3
                `;
    
                parseFile.parseFile(luFile)
                    .then(res => done(res))
                    .catch(err => done())
            });
    
            it('Entity must be defined before a feature can be assigned to it', function(done) {
                let luFile = `
                    @ x1 usesFeature city3
                `;
    
                parseFile.parseFile(luFile)
                    .then(res => done(res))
                    .catch(err => done())
            })
    
            it('Feature can be added to a list entity', function(done) {
                let luFile = `
                    @ phraselist city
                    @ city =
                        - Seattle
                        - SEATAC
                        - SEA
                    @ phraselist city2(interchangeable)
                    @ city2 =
                        - portland
                        - PDX
                    
                    @ list x1
                    @ x1 usesFeature city
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.closedLists.length, 1);
                        assert.equal(res.LUISJsonStructure.closedLists[0].name, 'x1');
                        assert.equal(res.LUISJsonStructure.closedLists[0].features.length, 1);
                        assert.equal(res.LUISJsonStructure.closedLists[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.model_features.length, 2);
                        assert.equal(res.LUISJsonStructure.model_features[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                        assert.equal(res.LUISJsonStructure.model_features[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.model_features[0].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.model_features[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features[1].mode, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.model_features[1].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].enabledForAllModels, undefined);
                        done();
                    })
                    .catch(err => done(err))
            })
    
            it('Multiple features can be added to a list entity', function(done) {
                let luFile = `
                    @ phraselist city
                    @ city =
                        - Seattle
                        - SEATAC
                        - SEA
                    @ phraselist city2(interchangeable)
                    @ city2 =
                        - portland
                        - PDX
                    
                    @ list x1
                    @ x1 usesFeature city, city2
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.closedLists.length, 1);
                        assert.equal(res.LUISJsonStructure.closedLists[0].name, 'x1');
                        assert.equal(res.LUISJsonStructure.closedLists[0].features.length, 2);
                        assert.equal(res.LUISJsonStructure.closedLists[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.closedLists[0].features[1].featureName, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features.length, 2);
                        assert.equal(res.LUISJsonStructure.model_features[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                        assert.equal(res.LUISJsonStructure.model_features[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.model_features[0].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.model_features[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features[1].mode, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.model_features[1].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].enabledForAllModels, false);
                        done();
                    })
                    .catch(err => done(err))
            });
        });

        describe('Regex entity', function() {
            it('Features must be defined before they can be added.', function(done) {
                let luFile = `
                    @ regex x1
                    @ x1 usesFeature city3
                `;
    
                parseFile.parseFile(luFile)
                    .then(res => done(res))
                    .catch(err => done())
            });
    
            it('Entity must be defined before a feature can be assigned to it', function(done) {
                let luFile = `
                    @ x1 usesFeature city3
                `;
    
                parseFile.parseFile(luFile)
                    .then(res => done(res))
                    .catch(err => done())
            })
    
            it('Feature can be added to a regex entity', function(done) {
                let luFile = `
                    @ phraselist city
                    @ city =
                        - Seattle
                        - SEATAC
                        - SEA
                    @ phraselist city2(interchangeable)
                    @ city2 =
                        - portland
                        - PDX
                    
                    @ regex x1 = /[0-9]{6}/
                    @ x1 usesFeature city
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.regex_entities.length, 1);
                        assert.equal(res.LUISJsonStructure.regex_entities[0].name, 'x1');
                        assert.equal(res.LUISJsonStructure.regex_entities[0].features.length, 1);
                        assert.equal(res.LUISJsonStructure.regex_entities[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.model_features.length, 2);
                        assert.equal(res.LUISJsonStructure.model_features[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                        assert.equal(res.LUISJsonStructure.model_features[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.model_features[0].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.model_features[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features[1].mode, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.model_features[1].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].enabledForAllModels, undefined);
                        done();
                    })
                    .catch(err => done(err))
            })
    
            it('Multiple features can be added to a regex entity', function(done) {
                let luFile = `
                    @ phraselist city
                    @ city =
                        - Seattle
                        - SEATAC
                        - SEA
                    @ phraselist city2(interchangeable)
                    @ city2 =
                        - portland
                        - PDX
                    
                    @ regex x1 = /[0-9]{6}/
                    @ x1 usesFeature city
                    @x1 usesFeature city2
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.regex_entities.length, 1);
                        assert.equal(res.LUISJsonStructure.regex_entities[0].name, 'x1');
                        assert.equal(res.LUISJsonStructure.regex_entities[0].features.length, 2);
                        assert.equal(res.LUISJsonStructure.regex_entities[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.regex_entities[0].features[1].featureName, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features.length, 2);
                        assert.equal(res.LUISJsonStructure.model_features[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                        assert.equal(res.LUISJsonStructure.model_features[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.model_features[0].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.model_features[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features[1].mode, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.model_features[1].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].enabledForAllModels, false);
                        done();
                    })
                    .catch(err => done(err))
            });
        });

        describe('Pattern.any entity', function() {
            it('Features must be defined before they can be added.', function(done) {
                let luFile = `
                    @ patternany x1
                    @ x1 usesFeature city3
                `;
    
                parseFile.parseFile(luFile)
                    .then(res => done(res))
                    .catch(err => done())
            });
    
            it('Entity must be defined before a feature can be assigned to it', function(done) {
                let luFile = `
                    @ x1 usesFeature city3
                `;
    
                parseFile.parseFile(luFile)
                    .then(res => done(res))
                    .catch(err => done())
            })
    
            it('Feature can be added to a pattern.any entity', function(done) {
                let luFile = `
                    @ phraselist city
                    @ city =
                        - Seattle
                        - SEATAC
                        - SEA
                    @ phraselist city2(interchangeable)
                    @ city2 =
                        - portland
                        - PDX
                    
                    @ patternany x1 
                    @ x1 usesFeature city
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.patternAnyEntities.length, 1);
                        assert.equal(res.LUISJsonStructure.patternAnyEntities[0].name, 'x1');
                        assert.equal(res.LUISJsonStructure.patternAnyEntities[0].features.length, 1);
                        assert.equal(res.LUISJsonStructure.patternAnyEntities[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.model_features.length, 2);
                        assert.equal(res.LUISJsonStructure.model_features[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                        assert.equal(res.LUISJsonStructure.model_features[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.model_features[0].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.model_features[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features[1].mode, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.model_features[1].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].enabledForAllModels, undefined);
                        done();
                    })
                    .catch(err => done(err))
            })
    
            it('Multiple features can be added to a regex entity', function(done) {
                let luFile = `
                    @ phraselist city
                    @ city =
                        - Seattle
                        - SEATAC
                        - SEA
                    @ phraselist city2(interchangeable)
                    @ city2 =
                        - portland
                        - PDX
                    
                    @ patternany x1 
                    @ x1 usesFeatures city, city2
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.patternAnyEntities.length, 1);
                        assert.equal(res.LUISJsonStructure.patternAnyEntities[0].name, 'x1');
                        assert.equal(res.LUISJsonStructure.patternAnyEntities[0].features.length, 2);
                        assert.equal(res.LUISJsonStructure.patternAnyEntities[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.patternAnyEntities[0].features[1].featureName, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features.length, 2);
                        assert.equal(res.LUISJsonStructure.model_features[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                        assert.equal(res.LUISJsonStructure.model_features[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.model_features[0].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.model_features[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features[1].mode, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.model_features[1].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].enabledForAllModels, false);
                        done();
                    })
                    .catch(err => done(err))
            });
        });

        describe('Composite entity', function() {
            it('Features must be defined before they can be added.', function(done) {
                let luFile = `
                    @ patternany x1
                    @ x1 usesFeature city3
                `;
    
                parseFile.parseFile(luFile)
                    .then(res => done(res))
                    .catch(err => done())
            });
    
            it('Entity must be defined before a feature can be assigned to it', function(done) {
                let luFile = `
                    @ x1 usesFeature city3
                `;
    
                parseFile.parseFile(luFile)
                    .then(res => done(res))
                    .catch(err => done())
            })
    
            it('Feature can be added to a composite entity', function(done) {
                let luFile = `
                    @ phraselist city
                    @ city =
                        - Seattle
                        - SEATAC
                        - SEA
                    @ phraselist city2(interchangeable)
                    @ city2 =
                        - portland
                        - PDX
                    
                    @ composite x1 = [s1, number]
                    @ x1 usesFeature city
                    @ simple s1
                    @ prebuilt number
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.composites.length, 1);
                        assert.equal(res.LUISJsonStructure.composites[0].name, 'x1');
                        assert.equal(res.LUISJsonStructure.composites[0].features.length, 1);
                        assert.equal(res.LUISJsonStructure.composites[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.model_features.length, 2);
                        assert.equal(res.LUISJsonStructure.model_features[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                        assert.equal(res.LUISJsonStructure.model_features[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.model_features[0].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.model_features[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features[1].mode, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.model_features[1].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].enabledForAllModels, undefined);
                        done();
                    })
                    .catch(err => done(err))
            })
    
            it('Multiple features can be added to a composite entity', function(done) {
                let luFile = `
                    @ phraselist city
                    @ city =
                        - Seattle
                        - SEATAC
                        - SEA
                    @ phraselist city2(interchangeable)
                    @ city2 =
                        - portland
                        - PDX
                    
                    @ composite x1 = [s1, number]
                    @ x1 usesFeatures city, city2
                    @ simple s1
                    @ prebuilt number
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.composites.length, 1);
                        assert.equal(res.LUISJsonStructure.composites[0].name, 'x1');
                        assert.equal(res.LUISJsonStructure.composites[0].features.length, 2);
                        assert.equal(res.LUISJsonStructure.composites[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.composites[0].features[1].featureName, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features.length, 2);
                        assert.equal(res.LUISJsonStructure.model_features[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.model_features[0].mode, false);
                        assert.equal(res.LUISJsonStructure.model_features[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.model_features[0].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.model_features[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.model_features[1].mode, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.model_features[1].activated, true);
                        assert.equal(res.LUISJsonStructure.model_features[1].enabledForAllModels, false);
                        done();
                    })
                    .catch(err => done(err))
            });
        });
        
    })
});