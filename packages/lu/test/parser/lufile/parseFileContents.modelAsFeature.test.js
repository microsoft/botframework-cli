/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const parseFile = require('../../../src/parser/lufile/parseFileContents');
const validateLUISBlob = require('../../../src/parser/luisfile/parseLuisFile').validateLUISBlob;
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
                    assert.equal(res.LUISJsonStructure.phraselists.length, 1);
                    assert.equal(res.LUISJsonStructure.phraselists[0].name, 'city');
                    assert.equal(res.LUISJsonStructure.phraselists[0].mode, true);
                    assert.equal(res.LUISJsonStructure.phraselists[0].words, 'Seattle,SEATAC,SEA');
                    assert.equal(res.LUISJsonStructure.phraselists[0].activated, true);
                    assert.equal(res.LUISJsonStructure.phraselists[0].enabledForAllModels, false);
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
                    assert.equal(res.LUISJsonStructure.phraselists.length, 1);
                    assert.equal(res.LUISJsonStructure.phraselists[0].name, 'city');
                    assert.equal(res.LUISJsonStructure.phraselists[0].mode, false);
                    assert.equal(res.LUISJsonStructure.phraselists[0].words, 'Seattle,SEATAC,SEA');
                    assert.equal(res.LUISJsonStructure.phraselists[0].activated, true);
                    assert.equal(res.LUISJsonStructure.phraselists[0].enabledForAllModels, false);
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
                    assert.equal(res.LUISJsonStructure.phraselists.length, 2);
                    assert.equal(res.LUISJsonStructure.phraselists[0].name, 'city');
                    assert.equal(res.LUISJsonStructure.phraselists[0].mode, false);
                    assert.equal(res.LUISJsonStructure.phraselists[0].words, 'Seattle,SEATAC,SEA');
                    assert.equal(res.LUISJsonStructure.phraselists[0].activated, true);
                    assert.equal(res.LUISJsonStructure.phraselists[0].enabledForAllModels, false);
                    assert.equal(res.LUISJsonStructure.phraselists[1].name, 'city2');
                    assert.equal(res.LUISJsonStructure.phraselists[1].mode, true);
                    assert.equal(res.LUISJsonStructure.phraselists[1].words, 'portland,PDX');
                    assert.equal(res.LUISJsonStructure.phraselists[1].activated, true);
                    assert.equal(res.LUISJsonStructure.phraselists[1].enabledForAllModels, false);
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
        describe('Simple entity', function() {
            it('Features must be defined before they can be added.', function(done) {
                let luFile = `
                    @ ml x1
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
                    
                    @ ml x1
                    @ x1 usesFeature city
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.entities.length, 1);
                        assert.equal(res.LUISJsonStructure.entities[0].name, 'x1');
                        assert.equal(res.LUISJsonStructure.entities[0].features.length, 1);
                        assert.equal(res.LUISJsonStructure.entities[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.phraselists.length, 2);
                        assert.equal(res.LUISJsonStructure.phraselists[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.phraselists[0].mode, false);
                        assert.equal(res.LUISJsonStructure.phraselists[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.phraselists[0].activated, true);
                        assert.equal(res.LUISJsonStructure.phraselists[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.phraselists[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.phraselists[1].mode, true);
                        assert.equal(res.LUISJsonStructure.phraselists[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.phraselists[1].activated, true);
                        assert.equal(res.LUISJsonStructure.phraselists[1].enabledForAllModels, undefined);
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
                    
                    @ ml x1
                    @ x1 usesFeature city, city2
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.entities.length, 1);
                        assert.equal(res.LUISJsonStructure.entities[0].name, 'x1');
                        assert.equal(res.LUISJsonStructure.entities[0].features.length, 2);
                        assert.equal(res.LUISJsonStructure.entities[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.entities[0].features[1].featureName, 'city2');
                        assert.equal(res.LUISJsonStructure.phraselists.length, 2);
                        assert.equal(res.LUISJsonStructure.phraselists[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.phraselists[0].mode, false);
                        assert.equal(res.LUISJsonStructure.phraselists[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.phraselists[0].activated, true);
                        assert.equal(res.LUISJsonStructure.phraselists[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.phraselists[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.phraselists[1].mode, true);
                        assert.equal(res.LUISJsonStructure.phraselists[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.phraselists[1].activated, true);
                        assert.equal(res.LUISJsonStructure.phraselists[1].enabledForAllModels, false);
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
                    
                    @ ml number hasRoles r1 usesFeature city 
                    @ number usesFeature city
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.entities.length, 1);
                        assert.equal(res.LUISJsonStructure.entities[0].name, 'number');
                        assert.equal(res.LUISJsonStructure.entities[0].features.length, 1);
                        assert.equal(res.LUISJsonStructure.entities[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.entities[0].roles.length, 1);
                        assert.deepEqual(res.LUISJsonStructure.entities[0].roles, ['r1']);
                        assert.equal(res.LUISJsonStructure.phraselists.length, 2);
                        assert.equal(res.LUISJsonStructure.phraselists[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.phraselists[0].mode, false);
                        assert.equal(res.LUISJsonStructure.phraselists[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.phraselists[0].activated, true);
                        assert.equal(res.LUISJsonStructure.phraselists[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.phraselists[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.phraselists[1].mode, true);
                        assert.equal(res.LUISJsonStructure.phraselists[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.phraselists[1].activated, true);
                        assert.equal(res.LUISJsonStructure.phraselists[1].enabledForAllModels, undefined);
                        done();
                    })
                    .catch(err => done(err))
            });

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
                    
                    @ ml number hasRoles r1, r2 usesFeatures city, city2 
                    @ number usesFeature city
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.entities.length, 1);
                        assert.equal(res.LUISJsonStructure.entities[0].name, 'number');
                        assert.equal(res.LUISJsonStructure.entities[0].features.length, 2);
                        assert.equal(res.LUISJsonStructure.entities[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.entities[0].features[1].featureName, 'city2');
                        assert.equal(res.LUISJsonStructure.entities[0].roles.length, 2);
                        assert.deepEqual(res.LUISJsonStructure.entities[0].roles, ['r1', 'r2']);
                        assert.equal(res.LUISJsonStructure.phraselists.length, 2);
                        assert.equal(res.LUISJsonStructure.phraselists[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.phraselists[0].mode, false);
                        assert.equal(res.LUISJsonStructure.phraselists[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.phraselists[0].activated, true);
                        assert.equal(res.LUISJsonStructure.phraselists[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.phraselists[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.phraselists[1].mode, true);
                        assert.equal(res.LUISJsonStructure.phraselists[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.phraselists[1].activated, true);
                        assert.equal(res.LUISJsonStructure.phraselists[1].enabledForAllModels, false);
                        done();
                    })
                    .catch(err => done(err))
            });


        });

        describe('Prebuilt, list, pattern.any, regex entities cannot have phrase list as feature', function() {
            it('prebuilt entity cannot have a phrase list as a feature', function(done) {
                let luFile = `
                    @ prebuilt number usesFeature city
                    @ phraselist city =
                        - Seattle
                        - SEATAC
                        - SEA
                `;

                parseFile.parseFile(luFile)
                    .then(res => done(res))
                    .catch(err => done())
            });
            
            it('list entity cannot have a phrase list as a feature', function(done) {
                let luFile = `
                    @ list number usesFeature city
                    @ phraselist city =
                        - Seattle
                        - SEATAC
                        - SEA
                `;

                parseFile.parseFile(luFile)
                    .then(res => done(res))
                    .catch(err => done())
            });

            it('pattern.any entity cannot have a phrase list as a feature', function(done) {
                let luFile = `
                    @ patternany number usesFeature city
                    @ phraselist city =
                        - Seattle
                        - SEATAC
                        - SEA
                `;

                parseFile.parseFile(luFile)
                    .then(res => done(res))
                    .catch(err => done())
            });
            

            it('regex entity cannot have a phrase list as a feature', function(done) {
                let luFile = `
                    @ regex number usesFeature city = /[0-9]{7}/
                    @ phraselist city =
                        - Seattle
                        - SEATAC
                        - SEA
                `;

                parseFile.parseFile(luFile)
                    .then(res => done(res))
                    .catch(err => done())
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
                    @ ml s1
                    @ prebuilt number
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.composites.length, 1);
                        assert.equal(res.LUISJsonStructure.composites[0].name, 'x1');
                        assert.equal(res.LUISJsonStructure.composites[0].features.length, 1);
                        assert.equal(res.LUISJsonStructure.composites[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.phraselists.length, 2);
                        assert.equal(res.LUISJsonStructure.phraselists[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.phraselists[0].mode, false);
                        assert.equal(res.LUISJsonStructure.phraselists[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.phraselists[0].activated, true);
                        assert.equal(res.LUISJsonStructure.phraselists[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.phraselists[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.phraselists[1].mode, true);
                        assert.equal(res.LUISJsonStructure.phraselists[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.phraselists[1].activated, true);
                        assert.equal(res.LUISJsonStructure.phraselists[1].enabledForAllModels, undefined);
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
                    @ ml s1
                    @ prebuilt number
                `;
    
                parseFile.parseFile(luFile) 
                    .then(res => {
                        assert.equal(res.LUISJsonStructure.composites.length, 1);
                        assert.equal(res.LUISJsonStructure.composites[0].name, 'x1');
                        assert.equal(res.LUISJsonStructure.composites[0].features.length, 2);
                        assert.equal(res.LUISJsonStructure.composites[0].features[0].featureName, 'city');
                        assert.equal(res.LUISJsonStructure.composites[0].features[1].featureName, 'city2');
                        assert.equal(res.LUISJsonStructure.phraselists.length, 2);
                        assert.equal(res.LUISJsonStructure.phraselists[0].name, 'city');
                        assert.equal(res.LUISJsonStructure.phraselists[0].mode, false);
                        assert.equal(res.LUISJsonStructure.phraselists[0].words, 'Seattle,SEATAC,SEA');
                        assert.equal(res.LUISJsonStructure.phraselists[0].activated, true);
                        assert.equal(res.LUISJsonStructure.phraselists[0].enabledForAllModels, false);
                        assert.equal(res.LUISJsonStructure.phraselists[1].name, 'city2');
                        assert.equal(res.LUISJsonStructure.phraselists[1].mode, true);
                        assert.equal(res.LUISJsonStructure.phraselists[1].words, 'portland,PDX');
                        assert.equal(res.LUISJsonStructure.phraselists[1].activated, true);
                        assert.equal(res.LUISJsonStructure.phraselists[1].enabledForAllModels, false);
                        done();
                    })
                    .catch(err => done(err))
            });
        });

        it('phrase lists cannot be added as a feature to other phrase lists', function(done) {
            let luFile = `
                @phraselist xyz =
                    - a
                    - b
                    - c
                @phraselist abc usesFeature xyz = 
                    - 1
                    - 2
                    - 3
            `;

            parseFile.parseFile(luFile) 
                .then(res => done(res))
                .catch(err => done())
        })
        
    });

    describe('Negative tests', function(done) {
        it('Intent cannot use patternany as a feature', function(done) {
            let luFile = `
                @ patternany p1
                # test
                - one
                @ intent test usesFeature p1
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });

        it('simple entity cannot use patternany as a feature', function(done) {
            let luFile = `
                @ patternany p1
                @ ml s1 usesFeature p1
            `;

            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });

        it('composite entity cannot use patternany as a feature', function(done) {
            let luFile = `
                @ patternany p1
                @ composite c1 usesFeature p1
            `;
            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())

        });

        it('phrase lists cannot have any features', function(done) {
            let luFile = `
                @ ml c1
                @ phraselist p1 usesFeature c1
            `;
            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())
        });

        it('regex entity cannot have any features', function(done) {
            let luFile = `
                @ ml s1
                @ regex r1 usesFeature s1
            `;
            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())

        })

        it('list entity cannot have any features', function(done) {
            let luFile = `
                @ ml s1
                @ list r1 usesFeature s1
            `;
            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())

        })

        it('prebuilt entity cannot have any features', function(done) {
            let luFile = `
                @ ml s1
                @ prebuilt number usesFeature s1
            `;
            parseFile.parseFile(luFile)
                .then(res => done(res))
                .catch(err => done())

        })


    });
    it('Intent, simple entity, composite entity can use anything as a feature except for patternany', function(done) {
        let luFile = `
            @ ml s1
            @ list l1
            @ composite c1
            @ prebuilt number
            @ regex r1
            @ phraselist PL1
            # test
            - one
            @ intent test usesFeatures s1, l1, c1, number, r1, PL1
            # test2
            - one
            @ s1 usesFeature test2, l1, c1, number, r1, PL1
            @ c1 usesFeature test2, l1, number, r1, PL1, s1
        `;

        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.intents[0].features.length, 6);
                assert.equal(res.LUISJsonStructure.intents[0].features.filter(item => item.modelName).length, 5);
                assert.equal(res.LUISJsonStructure.intents[0].features.filter(item => item.featureName).length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].features.length, 6);
                assert.equal(res.LUISJsonStructure.entities[0].features.filter(item => item.modelName).length, 5);
                assert.equal(res.LUISJsonStructure.entities[0].features.filter(item => item.featureName).length, 1);
                assert.equal(res.LUISJsonStructure.composites[0].features.length, 6);
                assert.equal(res.LUISJsonStructure.composites[0].features.filter(item => item.modelName).length, 5);
                assert.equal(res.LUISJsonStructure.composites[0].features.filter(item => item.featureName).length, 1);
                done();
            })
            .catch(err => done(err))
    });
});