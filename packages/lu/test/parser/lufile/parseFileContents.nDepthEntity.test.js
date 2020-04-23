/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const parseFile = require('./../../../src/parser/lufile/parseFileContents');
var chai = require('chai');
var assert = chai.assert;
var helperclasses = require('./../../../src/parser/lufile/classes/hclasses');
describe('V2 NDepth definitions using @ notation', function () {
    it('Basic definition is handled correctly', function (done) {
        let luFile = `
            @ ml fooBar
        `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].name, 'fooBar');
                done();
            })
            .catch(err => done(err))
    });

    it('Entity name can have spaces in them', function (done) {
        let luFile = `
            @ ml 'foo Bar'
        `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].name, 'foo Bar');
                done();
            })
            .catch(err => done(err))
    });

    it('inline roles definitions is handled correctly', function (done) {
        let luFile = `
            @ ml fooBar r1
            @ ml fooBar2 2r1, 2r2
            @ ml fooBar3 hasRole 3r1
            @ ml fooBar4 hasRoles 4r1, 4r2
            @ ml fooBar5
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
            @ ml fooBar r1
            @ ml fooBar2 fooBar
        `;
        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('intent can be assigned as a feature', function (done) {
        let luFile = `
            @ ml fooBar
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
            @ ml fooBar
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
            @ ml fooBar
            @ ml x1
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
            @ ml fooBar
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
            @ ml fooBar r1
            @ patternany p1
            @ fooBar usesFeature p1
        `;
        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('Invalid child definition throws (missing @)', function (done) {
        let luFile = `
            @ml xyz = 
                - @ ml x1
                - @ ml abc =
                    - number p1
        `;
        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('Invalid child definition throws (missing type or name)', function (done) {
        let luFile = `
            @ml xyz = 
                - @ ml x1
                - @ ml abc =
                   - @number
        `;
        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('Invalid child definition throws (mis-spelled usesFeature)', function (done) {
        let luFile = `
            @ml xyz = 
                - @ ml x1
                - @ ml abc =
                   - @ number r1 usesFeaturex p1
        `;
        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('Entity names must be unique', function (done) {
        let luFile = `
            @list xyz
            @ml xyz = 
                - @ ml x1
        `;
        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('Child entity names must be unique', function (done) {
        let luFile = `
            @ml xyz
            @ml xyz1 = 
                - @ ml xyz

        `;
        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('Simple child entity is handled correctly', function (done) {
        let luFile = `
            @ml xyz1 = 
                - @ ml xyz

        `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "xyz");
                done();
            })
            .catch(err => done(err))
    });

    it('Child entity name can have spaces in them', function (done) {
        let luFile = `
            @ml xyz1 = 
                - @ ml 'x y z'

        `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "x y z");
                done();
            })
            .catch(err => done(err))
    });

    it('Non ML entities cannot have children', function (done) {
        let luFile = `
        @regex r1
        @ml xyz1 = 
        - @r1 xyz
            - @ml xyz2

        `;
        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('Multiple children at level 1 is handled correctly', function (done) {
        let luFile = `
            @ml xyz1 = 
                - @ ml xyz
                - @ ml xyz2

        `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 2);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "xyz");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].name, "xyz2");
                done();
            })
            .catch(err => done(err))
    });

    it('Instance of a type is handled correctly', function (done) {
        let luFile = `
        @prebuilt number
        @ml xyz1 = 
        - @ ml xyz
        - @ number abc

        `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 2);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "xyz");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].name, "abc");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].features[0].modelName, "number");
                done();
            })
            .catch(err => done(err))
    });

    it('Arbitrary depth entities are handled correctly', function (done) {
        let luFile = `
        @ list list1
@ list list2
@ list list3
@ list list4
@ regex regex1
@ regex regex2
@ prebuilt number
@ml 1 = 
    - @ ml s1
    - @ ml 2 =
        - @ number n2
        - @ml 3 =
            - @ list1 l3
            - @ml 4 =
                - @ regex1 r4
                - @ ml 5 =
                    - @ regex2 r5
                    - @ list2 l5
                    - @ number n5
                    - @ ml s5
                - @ list3 l4
                - @ number n4
                - @ ml s4
            - @ number n3
            - @ ml s3
        - @ ml s2
        `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 2);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "s1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].name, "2");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children.length, 3);
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[0].name, "n2");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[0].features[0].modelName, "number");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].name, "3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children.length, "4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[0].name, "l3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[0].features[0].modelName, "list1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].name, "4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children.length, "5");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[0].name, "r4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[0].features[0].modelName, "regex1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[1].name, "5");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[2].name, "l4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[2].features[0].modelName, "list3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[3].name, "n4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[3].features[0].modelName, "number");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[4].name, "s4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[2].name, "n3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[2].features[0].modelName, "number");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[3].name, "s3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[2].name, "s2");
                done();
            })
            .catch(err => done(err))
    });

    it('Arbitrary depth entities are handled correctly (Start tab stop agnostic)', function (done) {
        let luFile = `
@ list list1
@ list list2
@ list list3
@ list list4
@ regex regex1
@ regex regex2
@ prebuilt number
@ml 1 = 
    - @ ml s1
    - @ ml 2 =
        - @ number n2
        - @ml 3 =
            - @ list1 l3
            - @ml 4 =
                - @ regex1 r4
                - @ ml 5 =
                    - @ regex2 r5
                    - @ list2 l5
                    - @ number n5
                    - @ ml s5
                - @ list3 l4
                - @ number n4
                - @ ml s4
            - @ number n3
            - @ ml s3
        - @ ml s2`;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 2);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "s1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].name, "2");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children.length, "3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[0].name, "n2");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[0].features[0].modelName, "number");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].name, "3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children.length, "4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[0].name, "l3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[0].features[0].modelName, "list1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].name, "4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children.length, "5");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[0].name, "r4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[0].features[0].modelName, "regex1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[1].name, "5");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[2].name, "l4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[2].features[0].modelName, "list3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[3].name, "n4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[3].features[0].modelName, "number");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[4].name, "s4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[2].name, "n3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[2].features[0].modelName, "number");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[3].name, "s3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[2].name, "s2");
                done();
            })
            .catch(err => done(err))
    });

    it('Arbitrary depth entities are handled correctly (Spaces instead of tab stops)', function (done) {
        let luFile = `
@ list list1
@ list list2
@ list list3
@ list list4
@ regex regex1
@ regex regex2
@ prebuilt number
@ml 1 = 
    - @ ml s1
    - @ ml 2 =
        - @ number n2
        - @ml 3 =
            - @ list1 l3
            - @ml 4 =
                - @ regex1 r4
                - @ ml 5 =
                    - @ regex2 r5
                    - @ list2 l5
                    - @ number n5
                    - @ ml s5
                - @ list3 l4
                - @ number n4
                - @ ml s4
            - @ number n3
            - @ ml s3
        - @ ml s2`;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 2);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "s1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].name, "2");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children.length, "3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[0].name, "n2");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[0].features[0].modelName, "number");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].name, "3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children.length, "4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[0].name, "l3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[0].features[0].modelName, "list1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].name, "4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children.length, "5");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[0].name, "r4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[0].features[0].modelName, "regex1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[1].name, "5");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[2].name, "l4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[2].features[0].modelName, "list3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[3].name, "n4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[3].features[0].modelName, "number");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[4].name, "s4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[2].name, "n3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[2].features[0].modelName, "number");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[3].name, "s3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[2].name, "s2");
                done();
            })
            .catch(err => done(err))
    });

    it('Child can include one feature', function(done) {
        let luFile = `
    @ml 1 = 
        - @ ml s1 usesFeature x1
    @regex x1
        
    `;
    parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "s1");
                assert.deepEqual(res.LUISJsonStructure.entities[0].children[0].features, [new helperclasses.entityFeature('x1', false)]);
                done();
            })
            .catch(err => done(err))
    });

    it('Child can include one or more features', function(done) {
        let luFile = `
    @ml 1 = 
        - @ ml s1 usesFeature x1, x2
    @regex x1
    @regex x2
    `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "s1");
                assert.deepEqual(res.LUISJsonStructure.entities[0].children[0].features, [new helperclasses.entityFeature('x1', false), new helperclasses.entityFeature('x2', false)]);
                done();
            })
            .catch(err => done(err))
    });

    it('instanceOf must be defined', function(done) {
        let luFile = `
        @ml 1 = 
        - @ list1 l1
        `;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('instanceOf must be defined immaterial of child depth', function(done) {
        let luFile = `
        @ list list1
        @ml 1 = 
        - @ list1 l1
        - @ ml 
        `;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    })
    
    it('instanceOf cannot be to a phrase list', function(done) {
        let luFile = `
@ ml fooBar
    - @ pl1 x1
@ phraselist pl1`;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    })

    it('instanceOf cannot be to a pattern.any', function(done) {
        let luFile = `
@ ml fooBar
    - @ pa1 x1
@ patternany pa1`;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    })

    it('instanceOf cannot be to a role', function(done) {
        let luFile = `
@ ml fooBar
    - @ r1 x1
@ ml pl1 r1
    `;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    })

    it('usesFeature cannot be to a pattern.any entity', function(done) {
        let luFile = `
@ ml fooBar
    - @ ml x1 usesFeature pa1
@ patternany pa1
    `;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    })

    it('Features must be defined before they can be added to a child.', function(done) {
        let luFile = `
@ ml fooBar
- @ ml x1 usesFeature pa1
    `;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    })
    
    it('Child can include intent as a feature', function(done) {
        let luFile = `
    @ ml fooBar
        - @ ml x1 usesFeature pa1
    # pa1
    - one  
    `;
    parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "x1");
                assert.deepEqual(res.LUISJsonStructure.entities[0].children[0].features[0].modelName, 'pa1');
                assert.equal(res.LUISJsonStructure.intents.length, 1);
                assert.equal(res.LUISJsonStructure.intents[0].name, 'pa1');
                done();
            })
            .catch(err => done(err))
    });

    it('Child can include phrase list as a feature', function(done) {
        let luFile = `
    @ ml fooBar
        - @ ml x1 usesFeature pl1
    @ phraselist pl1
    `;
    parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "x1");
                assert.deepEqual(res.LUISJsonStructure.entities[0].children[0].features, [new helperclasses.plFeature("pl1", false)]);
                assert.equal(res.LUISJsonStructure.phraselists.length, 1);
                assert.equal(res.LUISJsonStructure.phraselists[0].name, 'pl1');
                done();
            })
            .catch(err => done(err))
    });

    it('Child can include multiple, valid features', function(done) {
        let luFile = `
    @ ml fooBar
        - @ ml x1 usesFeature pl1, s1, number
    @ phraselist pl1
    @ ml s1
    @ prebuilt number
    `;
    parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 2);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "x1");
                assert.deepEqual(res.LUISJsonStructure.entities[0].children[0].features, [new helperclasses.plFeature("pl1", false), new helperclasses.entityFeature('s1', false), new helperclasses.entityFeature('number', false)]);
                assert.equal(res.LUISJsonStructure.phraselists.length, 1);
                assert.equal(res.LUISJsonStructure.phraselists[0].name, 'pl1');
                assert.equal(res.LUISJsonStructure.prebuiltEntities.length, 1);
                assert.equal(res.LUISJsonStructure.prebuiltEntities[0].name, "number");
                done();
            })
            .catch(err => done(err))
    });

    it('interchangeable phrase list can be added as a feature', function(done){
        let luFile = `
## None
## intent1
@ ml nDepth usesFeatures intent1,phraselist1
    - @ age nDepth_child1
    - @ ml nDepth_child2 usesFeatures intent1,phraselist1
        - @ ml nDepth_child2.1
@ prebuilt age
@ phraselist phraselist1(interchangeable) = 
    - who,why,where,what
        `;

        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].features[1].featureName, 'phraselist1');
                done();
            })
            .catch(err => done(err))
    });

    it('ml entity definition can be delayed', function(done){
        let luFile = `
@ml 1
@prebuilt number
@list list1
@1 =
- @ number from
- @ list1 myList
        `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].name, '1');
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 2);
                done();
            })
            .catch(err => done(err))
        

    });

    it('labelled children in utterances are removed correctly', function(done) {
        let luFile = `
        # test
        - my name is vishwac
            - my {@userProfile = name is vishwac}
            - my name is {@userName = vishwac}
        - I'm 36
            - I'm {@userProfile = {@userAge = 36}}

        @ ml userProfile = 
            - @ personName userName
            - @ age userAge

        @ prebuilt personName
        @ prebuilt age`;
        
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].name, 'userProfile');
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 2);
                assert.equal(res.LUISJsonStructure.prebuiltEntities.length, 2);
                done();
            })
            .catch(err => done(err))
    });

    it('[level 1 child] Every child must have its parent labelled in an utterance', function(done) {
        let luFile = `
        # test
        - my name is vishwac
            - my name is {@userName = vishwac}

        @ ml userProfile = 
            - @ personName userName
            - @ age userAge

        @ prebuilt personName
        @ prebuilt age`;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    })

    it('[level 2 child] Every child must have its parent labelled in an utterance', function(done) {
        let luFile = `
        # test
        - my name is vishwac
            - my name is {@firstName = vishwac}

        @ ml userProfile = 
            - @ ml userName
                - @ personName firstName
            - @ age userAge

        @ prebuilt personName
        @ prebuilt age`;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    })
    
});