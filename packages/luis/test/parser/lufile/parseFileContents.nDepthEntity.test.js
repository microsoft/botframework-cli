/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const parseFile = require('./../../../src/parser/lufile/parseFileContents');
var chai = require('chai');
var assert = chai.assert;
describe('V2 NDepth definitions using @ notation', function () {
    it('Basic definition is handled correctly', function (done) {
        let luFile = `
            @ machine-learned fooBar
        `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].name, 'fooBar');
                done();
            })
            .catch(err => done(err))
    });

    it('inline roles definitions is handled correctly', function (done) {
        let luFile = `
            @ machine-learned fooBar r1
            @ machine-learned fooBar2 2r1, 2r2
            @ machine-learned fooBar3 hasRole 3r1
            @ machine-learned fooBar4 hasRoles 4r1, 4r2
            @ machine-learned fooBar5
            @ fooBar5 5r1
        `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 5);
                assert.equal(res.LUISJsonStructure.entities[0].name, 'fooBar');
                assert.equal(res.LUISJsonStructure.entities[0].roles.length, 1);
                assert.deepEqual(res.LUISJsonStructure.entities[0].roles, ['r1']);
                assert.equal(res.LUISJsonStructure.entities[1].name, 'fooBar2');
                assert.equal(res.LUISJsonStructure.entities[1].roles.length, 2);
                assert.deepEqual(res.LUISJsonStructure.entities[1].roles, ['2r1', '2r2']);
                assert.equal(res.LUISJsonStructure.entities[2].name, 'fooBar3');
                assert.equal(res.LUISJsonStructure.entities[2].roles.length, 1);
                assert.deepEqual(res.LUISJsonStructure.entities[2].roles, ['3r1']);
                assert.equal(res.LUISJsonStructure.entities[3].name, 'fooBar4');
                assert.equal(res.LUISJsonStructure.entities[3].roles.length, 2);
                assert.deepEqual(res.LUISJsonStructure.entities[3].roles, ['4r1', '4r2']);
                assert.equal(res.LUISJsonStructure.entities[4].name, 'fooBar5');
                assert.equal(res.LUISJsonStructure.entities[4].roles.length, 1);
                assert.deepEqual(res.LUISJsonStructure.entities[4].roles, ['5r1']);
                done();
            })
            .catch(err => done(err))
    });

    it('Roles need to be unique', function (done) {
        let luFile = `
            @ machine-learned fooBar r1
            @ machine-learned fooBar2 fooBar
        `;
        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('intent can be assigned as a feature', function (done) {
        let luFile = `
            @ machine-learned fooBar
            # intent1
            - test
            @fooBar usesFeature intent1
        `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].name, 'fooBar');
                assert.equal(res.LUISJsonStructure.entities[0].features[0].modelName, 'intent1');
                done();
            })
            .catch(err => done(err))
    });

    it('intent can be assigned as a feature', function (done) {
        let luFile = `
            @ machine-learned fooBar
            # intent1
            - test
            @fooBar usesFeature intent1
        `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].name, 'fooBar');
                assert.equal(res.LUISJsonStructure.entities[0].features[0].modelName, 'intent1');
                done();
            })
            .catch(err => done(err))
    });

    it('all entity types can be assigned as a feature', function (done) {
        let luFile = `
            @ machine-learned fooBar
            @ simple x1
            @ prebuilt number
            @ list l1
            @ composite c1
            @ regex r1
            @fooBar usesFeatures x1, number, l1, c1, r1
        `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 2);
                assert.equal(res.LUISJsonStructure.entities[0].name, 'fooBar');
                assert.equal(res.LUISJsonStructure.entities[0].features.length, 5);
                done();
            })
            .catch(err => done(err))
    });
    
    it('Phrase list can be assigned as a feature', function (done) {
        let luFile = `
            @ machine-learned fooBar
            @ phraselist p1
            @fooBar usesFeatures p1
        `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].name, 'fooBar');
                assert.equal(res.LUISJsonStructure.entities[0].features.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].features[0].featureName, 'p1');
                done();
            })
            .catch(err => done(err))
    });

    it('Pattern.any cannot be used as a feature', function (done) {
        let luFile = `
            @ machine-learned fooBar r1
            @ patternany p1
            @ fooBar usesFeature p1
        `;
        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });
    
});