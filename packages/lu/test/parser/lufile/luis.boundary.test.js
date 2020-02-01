/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var chai = require('chai');
var assert = chai.assert;
const luMerger = require('./../../../src/parser/lu/luMerger');
const luObj = require('../../../src/parser/lu/lu');
const retCode = require('./../../../src/parser/utils/enums/CLI-errors');
const POSSIBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 ";
describe('Validations for LU content (based on LUIS boundaries)', function () {
    it (`At most ${retCode.boundaryLimits.MAX_NUM_INTENTS} intents in LU content`, function(done) {
        luMerger.Build(new Array(new luObj(getMaxIntentTestData(), 'stdin', true)))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_INTENTS);
                assert(err.text.includes("501 intents found in application"));
                done();
            })
    })

    it (`At most ${retCode.boundaryLimits.MAX_NUM_UTTERANCES} utterances in LU content`, function(done) {
        luMerger.Build(new Array(new luObj(getMaxUtteranceTestData(), 'stdin', true)))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_UTTERANCES);
                assert(err.text.includes("15001 utterances found in application"));
                done();
            })
    })

    it (`At most ${retCode.boundaryLimits.MAX_NUM_PATTERNANY_ENTITIES} pattern.any entities in LU content`, function(done) {
        luMerger.Build(new Array(new luObj(getMaxPatternAnyEntities(), 'stdin', true)))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_PATTERNANYENTITY);
                assert(err.text.includes("pattern.any entities found in application."));
                done();
            })
    })

    it (`At most ${retCode.boundaryLimits.MAX_CHAR_IN_UTTERANCE} characters in any utterance`, function(done) {
        luMerger.Build(new Array(new luObj(getMaxUtteranceCharLimit(), 'stdin', true)))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_UTTERANCE_CHAR_LENGTH);
                assert(err.text.includes(`At most ${retCode.boundaryLimits.MAX_CHAR_IN_UTTERANCE} is allowed.`));
                done();
            })
    })

    it (`At most ${retCode.boundaryLimits.MAX_NUM_PATTERNS} patterns in LU content`, function(done) {
        luMerger.Build(new Array(new luObj(getMaxPatterns(), 'stdin', true)))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_PATTERNS);
                assert(err.text.includes(`patterns found in application. At most ${retCode.boundaryLimits.MAX_NUM_PATTERNS} is allowed.`));
                done();
            })
    })

    it (`At most ${retCode.boundaryLimits.MAX_CHAR_IN_PATTERNS} characters in any pattern`, function(done) {
        luMerger.Build(new Array(new luObj(getMaxPatternCharLimit(), 'stdin', true)))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_PATTERN_CHAR_LIMIT);
                assert(err.text.includes(`At most ${retCode.boundaryLimits.MAX_CHAR_IN_PATTERNS} characters are allowed in any pattern.`));
                done();
            })
    })

    it (`At most ${retCode.boundaryLimits.MAX_NUM_REGEX_ENTITIES} regex entities`, function(done) {
        luMerger.Build(new Array(new luObj(getMaxRegeExEntityDefinition(retCode.boundaryLimits.MAX_NUM_REGEX_ENTITIES), 'stdin', true)))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_REGEX_ENTITY);
                assert(err.text.includes(`At most ${retCode.boundaryLimits.MAX_NUM_REGEX_ENTITIES} is allowed.`));
                done();
            })
    })

    it (`At most ${retCode.boundaryLimits.MAX_CHAR_REGEX_ENTITY_PATTERN} characters in regex entity pattern`, function(done) {
        luMerger.Build(new Array(new luObj(getMaxRegeExEntityDefinition(1, retCode.boundaryLimits.MAX_CHAR_REGEX_ENTITY_PATTERN), 'stdin', true)))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_REGEX_CHAR_LIMIT);
                assert(err.text.includes(`At most ${retCode.boundaryLimits.MAX_CHAR_REGEX_ENTITY_PATTERN} is allowed.`));
                done();
            })
    })

    it (`At most ${retCode.boundaryLimits.MAX_LIST_ENTITY_CANONICAL_FORM} parents (canonical form/ normalized value) a list entity`, function(done) {
        luMerger.Build(new Array(new luObj(getListEntity(), 'stdin', true)))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_LIST_PARENT_LIMIT);
                assert(err.text.includes(`At most ${retCode.boundaryLimits.MAX_LIST_ENTITY_CANONICAL_FORM} is allowed.`));
                done();
            })
    })

    it (`At most ${retCode.boundaryLimits.MAX_LIST_ENTITY_SYNONYMS} synonyms under any parent for a list entity`, function(done) {
        luMerger.Build(new Array(new luObj(getListEntity(1, retCode.boundaryLimits.MAX_LIST_ENTITY_SYNONYMS), 'stdin', true)))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_SYNONYMS_LENGTH);
                assert(err.text.includes(`At most ${retCode.boundaryLimits.MAX_LIST_ENTITY_SYNONYMS} is allowed.`));
                done();
            })
    })

    it (`At most ${retCode.boundaryLimits.MAX_NUM_PHRASE_LISTS} phrase lists`, function(done) {
        luMerger.Build(new Array(new luObj(getMaxPhraseLists(), 'stdin', true)))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_PHRASE_LIST_LIMIT);
                assert(err.text.includes(`At most ${retCode.boundaryLimits.MAX_NUM_PHRASE_LISTS} is allowed.`));
                done();
            })
    })

    it (`At most ${retCode.boundaryLimits.MAX_INTERCHANGEABLE_PHRASES} phrases across all interchangeable phrase lists`, function(done) {
        luMerger.Build(new Array(new luObj(getMaxPhraseLists(0, retCode.boundaryLimits.MAX_INTERCHANGEABLE_PHRASES, true), 'stdin', true)))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_INTC_PHRASES_LIMIT);
                assert(err.text.includes(`At most ${retCode.boundaryLimits.MAX_INTERCHANGEABLE_PHRASES} is allowed.`));
                done();
            })
    })

    it (`At most ${retCode.boundaryLimits.MAX_NON_INTERCHANGEABLE_PHRASES} phrases across all non-interchangeable phrase lists`, function(done) {
        luMerger.Build(new Array(new luObj(getMaxPhraseLists(0, retCode.boundaryLimits.MAX_NON_INTERCHANGEABLE_PHRASES), 'stdin', true)))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_NINTC_PHRASES_LIMIT);
                assert(err.text.includes(`At most ${retCode.boundaryLimits.MAX_NON_INTERCHANGEABLE_PHRASES} is allowed.`));
                done();
            })
    })

    it (`At most ${retCode.boundaryLimits.MAX_ROLES_PER_ENTITY} roles per entity`, function(done) {
        luMerger.Build(new Array(new luObj(getEntityWithRoles())))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_ROLES_PER_ENTITY);
                assert(err.text.includes(`At most ${retCode.boundaryLimits.MAX_ROLES_PER_ENTITY} is allowed.`));
                done();
            })
    })

    it (`At most ${retCode.boundaryLimits.MAX_NUM_ROLES} roles across all entities per LU content`, function(done) {
        luMerger.Build(new Array(new luObj(getEntityWithRoles(51, 6))))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_TOTAL_ROLES);
                assert(err.text.includes(`At most ${retCode.boundaryLimits.MAX_NUM_ROLES} is allowed.`));
                done();
            })
    })

    it (`At most ${retCode.boundaryLimits.MAX_NUM_DESCRIPTORS_PER_MODEL} descriptors per model`, function(done) {
        luMerger.Build(new Array(new luObj(getEntityWithFeatures())))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_FEATURE_PER_MODEL);
                assert(err.text.includes(`At most ${retCode.boundaryLimits.MAX_NUM_DESCRIPTORS_PER_MODEL} is allowed.`));
                done();
            })
    })

    it (`At most ${retCode.boundaryLimits.MAX_NUM_PARENT_ENTITIES} parent nodes in an ML entitiy`, function(done) {
        luMerger.Build(new Array(new luObj(getMLEntity())))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_PARENT_ENTITY_LIMIT);
                assert(err.text.includes(`At most ${retCode.boundaryLimits.MAX_NUM_PARENT_ENTITIES} is allowed.`));
                done();
            })
    })

    it (`At most ${retCode.boundaryLimits.MAX_TOTAL_ENTITES_AND_ROLES} total entities and roles in given LU content`, function(done) {
        luMerger.Build(new Array(new luObj(getMaxEntityAndRoles())))
            .then(res => done(res))
            .catch(err => {
                assert.equal(err.errCode, retCode.errorCode.BOUNDARY_TOTAL_ENTITIES_AND_ROLES);
                assert(err.text.includes(`At most ${retCode.boundaryLimits.MAX_TOTAL_ENTITES_AND_ROLES} is allowed.`));
                done();
            })
    })

    // This test is commented out because it takes > 60s to complete.
    // it (`At most ${retCode.boundaryLimits.MAX_NUM_PHRASES_IN_ALL_PHRASE_LIST} phrases across all phrase lists`, function(done) {
    //     luMerger.Build(new Array(new luObj(getMaxPhraseLists(0, retCode.boundaryLimits.MAX_NUM_PHRASES_IN_ALL_PHRASE_LIST), 'stdin', true)))
    //         .then(res => done(res))
    //         .catch(err => {
    //             assert.equal(err.errCode, retCode.errorCode.BOUNDARY_TOTAL_PHRASES);
    //             assert(err.text.includes(`At most ${retCode.boundaryLimits.MAX_NUM_PHRASES_IN_ALL_PHRASE_LIST} is allowed.`));
    //             done();
    //         })
    // })

})

const getMaxEntityAndRoles = function() {
    let fc = '';
    for (var i = 0; i < retCode.boundaryLimits.MAX_NUM_ROLES; i++) {
        fc += `
@ ml entityBase${i} hasRoles role${i}`;
    }
    for (var j = retCode.boundaryLimits.MAX_NUM_ROLES; j <= retCode.boundaryLimits.MAX_TOTAL_ENTITES_AND_ROLES; j++) {
        fc += `
@ ml entityFillUp${j}`
    }
    return fc;
}
const getMLEntity = function() {
    let fc = '';
    for (var i = 0; i <= retCode.boundaryLimits.MAX_NUM_PARENT_ENTITIES; i++) {
        fc += `
@ ml parentEntity${i} = 
    - @ ml childEntity${i}`;
    }
    return fc;
}
const getEntityWithFeatures = function() {
    let fc = '';
    let descriptorsList = [];
    for (var i = 0; i <= retCode.boundaryLimits.MAX_NUM_DESCRIPTORS_PER_MODEL; i++) {
        let newEntityName = `entity${i}`;
        descriptorsList.push(newEntityName);
        fc += `
@ ml ${newEntityName}`;
    }
    fc += `
@ ml testEntity usesFeatures ${descriptorsList.join(',')}
`;
    return fc;
}
const getEntityWithRoles = function(numEntities = 1, rolesPerEntity = retCode.boundaryLimits.MAX_ROLES_PER_ENTITY) {
    let fc = '';
    let roleCounter = 1;
    for (var i = 1; i <= numEntities; i++) {
        fc += `
@ ml entity${i} hasRoles `;
        for (var j = 1; j <= rolesPerEntity; j++) {
            fc += `role${roleCounter++},`;
        }
        fc += `role${roleCounter++}`;
    }
    return fc;
}
const getMaxPhraseLists = function(numPhraseLists = retCode.boundaryLimits.MAX_NUM_PHRASE_LISTS, numPhrases = null, intc = null) {
    let fc = '';
    for (var i = 0; i <= numPhraseLists; i++) {
        fc += `
@ phraselist PL${i}`;
        if (intc) fc += '(interchangeable)'
        if (numPhrases) {
            fc += ` =`;
            for (var j = 0; j <= numPhrases; j++) {
                fc += `
    - phrase${j}`
            }
        }
    }
    return fc;
}
const getListEntity = function (numParents = retCode.boundaryLimits.MAX_LIST_ENTITY_CANONICAL_FORM, numSynonyms = 0) {
    let fc = `
@ list entity1 = 
`;
    for (var i = 0; i <= numParents; i++) {
        fc += `
    - parent${i} :`;
        for (var j = 0; j <= numSynonyms; j++) {
            fc += `
        - synonym${i}.${j}.${POSSIBLE_CHARS.charAt(Math.floor(Math.random() * POSSIBLE_CHARS.length))}`
        }
    }
    return fc;
}
const getMaxRegeExEntityDefinition = function(entityNum = retCode.boundaryLimits.MAX_NUM_REGEX_ENTITIES, charLimit = retCode.boundaryLimits.MAX_NUM_REGEX_ENTITIES) {
    let fc = '';
    for (var i = 0; i <= entityNum; i++) {
        fc += `
@ regex entity${i} = /`;
        for (var j = 0; j <= charLimit; j++) {
            fc += POSSIBLE_CHARS.charAt(Math.floor(Math.random() * POSSIBLE_CHARS.length));
        }
        fc += '/'
    }
    return fc;
}
const getMaxPatternCharLimit = function() {
    let fc = `
# testIntent
- this {pattern} is invalid`;
    for (var i = 0; i <= retCode.boundaryLimits.MAX_CHAR_IN_PATTERNS + 100; i++) {
        fc += POSSIBLE_CHARS.charAt(Math.floor(Math.random() * POSSIBLE_CHARS.length));
    }
    return fc;
}
const getMaxPatterns = function() {
    let fc = `
    # testIntent`;
    for (var i = 0; i <= retCode.boundaryLimits.MAX_NUM_PATTERNS; i++) {
        fc += `
- utterance${i} is actually a {pattern}`;
    }
    return fc;
}
const getMaxIntentTestData = function() {
    let fc = '';
    for (var i = 0; i <= retCode.boundaryLimits.MAX_NUM_INTENTS; i++) {
        fc += `
# Intent${i}
- utterance${i}

`;
    }
    return fc;
}

const getMaxUtteranceTestData = function() {
    let fc = `
# intent1`;
    for (var i = 0; i <= retCode.boundaryLimits.MAX_NUM_UTTERANCES; i++) {
        fc += `
- utterance${i}`;
    }
    return fc;
}

const getMaxPatternAnyEntities = function() {
    let fc = '';
    for (var i = 0; i <= retCode.boundaryLimits.MAX_NUM_PATTERNANY_ENTITIES; i++) {
        fc += `
@ patternany entity${i}`;
    }
    return fc;
}

const getMaxUtteranceCharLimit = function() {
    let fc = `
# testIntent
- `;
    for (var i = 0; i <= retCode.boundaryLimits.MAX_CHAR_IN_UTTERANCE + 100; i++) {
        fc += POSSIBLE_CHARS.charAt(Math.floor(Math.random() * POSSIBLE_CHARS.length));
    }
    return fc;
}