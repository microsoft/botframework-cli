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

    it('Entity name can have spaces in them', function (done) {
        let luFile = `
            @ machine-learned 'foo Bar'
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

    it('Invalid child definition throws (missing @)', function (done) {
        let luFile = `
            @machine-learned xyz = 
                - @ simple x1
                - @ machine-learned abc =
                    - number p1
        `;
        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('Invalid child definition throws (missing -)', function (done) {
        let luFile = `
            @machine-learned xyz = 
                - @ simple x1
                - @ machine-learned abc =
                    @number p1
        `;
        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('Invalid child definition throws (missing type or name)', function (done) {
        let luFile = `
            @machine-learned xyz = 
                - @ simple x1
                - @ machine-learned abc =
                   - @number
        `;
        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('Invalid child definition throws (mis-spelled usesFeature)', function (done) {
        let luFile = `
            @machine-learned xyz = 
                - @ simple x1
                - @ machine-learned abc =
                   - @ number r1 usesFeaturex p1
        `;
        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('Entity names must be unique', function (done) {
        let luFile = `
            @simple xyz
            @machine-learned xyz = 
                - @ simple x1
        `;
        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('Child entity names must be unique', function (done) {
        let luFile = `
            @simple xyz
            @machine-learned xyz1 = 
                - @ simple xyz

        `;
        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('Simple child entity is handled correctly', function (done) {
        let luFile = `
            @machine-learned xyz1 = 
                - @ simple xyz

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
            @machine-learned xyz1 = 
                - @ simple 'x y z'

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
        @machine-learned xyz1 = 
        - @ simple xyz
            - @simple xyz2

        `;
        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('Multiple children at level 1 is handled correctly', function (done) {
        let luFile = `
            @machine-learned xyz1 = 
                - @ simple xyz
                - @ simple xyz2

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
        @machine-learned xyz1 = 
        - @ simple xyz
        - @ number abc

        `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 2);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "xyz");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].name, "abc");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].instanceOf, "number");
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
        @ composite composite1
        @ regex regex1
        @ regex regex2
        @ prebuilt number
        @machine-learned 1 = 
        - @ simple s1
        - @ machine-learned 2 =
            - @ number n2
            - @machine-learned 3 =
                - @ list1 l3
                - @machine-learned 4 =
                    - @ regex1 r4
                    - @ machine-learned 5 =
                        - @ composite1 c5
                        - @ regex2 r5
                        - @ list2 l5
                        - @ number n5
                        - @ simple s5
                    - @ list3 l4
                    - @ number n4
                    - @ simple s4
                - @ number n3
                - @ simple s3
            - @ simple s2
        `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 2);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "s1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].name, "2");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children.length, "3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[0].name, "n2");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[0].instanceOf, "number");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].name, "3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children.length, "4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[0].name, "l3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[0].instanceOf, "list1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].name, "4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children.length, "5");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[0].name, "r4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[0].instanceOf, "regex1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[1].name, "5");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[2].name, "l4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[2].instanceOf, "list3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[3].name, "n4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[3].instanceOf, "number");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[4].name, "s4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[2].name, "n3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[2].instanceOf, "number");
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
@ composite composite1
@ regex regex1
@ regex regex2
@ prebuilt number
@machine-learned 1 = 
    - @ simple s1
    - @ machine-learned 2 =
        - @ number n2
        - @machine-learned 3 =
            - @ list1 l3
            - @machine-learned 4 =
                - @ regex1 r4
                - @ machine-learned 5 =
                    - @ composite1 c5
                    - @ regex2 r5
                    - @ list2 l5
                    - @ number n5
                    - @ simple s5
                - @ list3 l4
                - @ number n4
                - @ simple s4
            - @ number n3
            - @ simple s3
        - @ simple s2`;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 2);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "s1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].name, "2");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children.length, "3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[0].name, "n2");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[0].instanceOf, "number");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].name, "3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children.length, "4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[0].name, "l3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[0].instanceOf, "list1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].name, "4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children.length, "5");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[0].name, "r4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[0].instanceOf, "regex1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[1].name, "5");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[2].name, "l4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[2].instanceOf, "list3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[3].name, "n4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[3].instanceOf, "number");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[4].name, "s4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[2].name, "n3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[2].instanceOf, "number");
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
@ composite composite1
@ regex regex1
@ regex regex2
@ prebuilt number
@machine-learned 1 = 
    - @ simple s1
    - @ machine-learned 2 =
        - @ number n2
        - @machine-learned 3 =
            - @ list1 l3
            - @machine-learned 4 =
                - @ regex1 r4
                - @ machine-learned 5 =
                    - @ composite1 c5
                    - @ regex2 r5
                    - @ list2 l5
                    - @ number n5
                    - @ simple s5
                - @ list3 l4
                - @ number n4
                - @ simple s4
            - @ number n3
            - @ simple s3
        - @ simple s2`;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 2);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "s1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].name, "2");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children.length, "3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[0].name, "n2");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[0].instanceOf, "number");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].name, "3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children.length, "4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[0].name, "l3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[0].instanceOf, "list1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].name, "4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children.length, "5");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[0].name, "r4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[0].instanceOf, "regex1");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[1].name, "5");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[2].name, "l4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[2].instanceOf, "list3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[3].name, "n4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[3].instanceOf, "number");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[1].children[4].name, "s4");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[2].name, "n3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[2].instanceOf, "number");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[1].children[3].name, "s3");
                assert.equal(res.LUISJsonStructure.entities[0].children[1].children[2].name, "s2");
                done();
            })
            .catch(err => done(err))
    });

    it('Child can include one feature', function(done) {
        let luFile = `
    @machine-learned 1 = 
        - @ simple s1 usesFeature x1
    @regex x1
        
    `;
    parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "s1");
                assert.deepEqual(res.LUISJsonStructure.entities[0].children[0].features, [new helperclasses.modelToFeature('x1')]);
                done();
            })
            .catch(err => done(err))
    });

    it('Child can include one or more features', function(done) {
        let luFile = `
    @machine-learned 1 = 
        - @ simple s1 usesFeature x1, x2
    @regex x1
    @regex x2
    `;
        parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "s1");
                assert.deepEqual(res.LUISJsonStructure.entities[0].children[0].features, [new helperclasses.modelToFeature('x1'), new helperclasses.modelToFeature('x2')]);
                done();
            })
            .catch(err => done(err))
    });

    it('instanceOf must be defined', function(done) {
        let luFile = `
        @machine-learned 1 = 
        - @ list1 l1
        `;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    });

    it('instanceOf must be defined immaterial of child depth', function(done) {
        let luFile = `
        @ list list1
        @machine-learned 1 = 
        - @ list1 l1
        - @ machine-learned 
        `;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    })
    
    it('instanceOf cannot be to a phrase list', function(done) {
        let luFile = `
@ machine-learned fooBar
    - @ pl1 x1
@ phraselist pl1`;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    })

    it('instanceOf cannot be to a pattern.any', function(done) {
        let luFile = `
@ machine-learned fooBar
    - @ pa1 x1
@ patternany pa1`;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    })

    it('instanceOf cannot be to a role', function(done) {
        let luFile = `
@ machine-learned fooBar
    - @ r1 x1
@ simple pl1 r1
    `;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    })

    it('usesFeature cannot be to a pattern.any entity', function(done) {
        let luFile = `
@ machine-learned fooBar
    - @ simple x1 usesFeature pa1
@ patternany pa1
    `;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    })

    it('Features must be defined before they can be added to a child.', function(done) {
        let luFile = `
@ machine-learned fooBar
- @ simple x1 usesFeature pa1
    `;

        parseFile.parseFile(luFile)
            .then(res => done(res))
            .catch(err => done())
    })
    
    it('Child can include intent as a feature', function(done) {
        let luFile = `
    @ machine-learned fooBar
        - @ simple x1 usesFeature pa1
    # pa1
    - one  
    `;
    parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "x1");
                assert.deepEqual(res.LUISJsonStructure.entities[0].children[0].features, [new helperclasses.modelToFeature('pa1')]);
                assert.equal(res.LUISJsonStructure.intents.length, 1);
                assert.equal(res.LUISJsonStructure.intents[0].name, 'pa1');
                done();
            })
            .catch(err => done(err))
    });

    it('Child can include phrase list as a feature', function(done) {
        let luFile = `
    @ machine-learned fooBar
        - @ simple x1 usesFeature pl1
    @ phraselist pl1
    `;
    parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "x1");
                assert.deepEqual(res.LUISJsonStructure.entities[0].children[0].features, [new helperclasses.featureToModel('pl1')]);
                assert.equal(res.LUISJsonStructure.model_features.length, 1);
                assert.equal(res.LUISJsonStructure.model_features[0].name, 'pl1');
                done();
            })
            .catch(err => done(err))
    });

    it('Child can include multiple, valid features', function(done) {
        let luFile = `
    @ machine-learned fooBar
        - @ simple x1 usesFeature pl1, i1, s1, number
    @ phraselist pl1
    @ simple s1
    @ prebuilt number
    # i1
    - test    
    `;
    parseFile.parseFile(luFile)
            .then(res => {
                assert.equal(res.LUISJsonStructure.entities.length, 2);
                assert.equal(res.LUISJsonStructure.entities[0].children.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].children[0].name, "x1");
                assert.deepEqual(res.LUISJsonStructure.entities[0].children[0].features, [new helperclasses.featureToModel('pl1'), new helperclasses.modelToFeature('i1'), new helperclasses.modelToFeature('s1'), new helperclasses.modelToFeature('number')]);
                assert.equal(res.LUISJsonStructure.model_features.length, 1);
                assert.equal(res.LUISJsonStructure.model_features[0].name, 'pl1');
                assert.equal(res.LUISJsonStructure.intents.length, 1);
                assert.equal(res.LUISJsonStructure.intents[0].name, 'i1');
                assert.equal(res.LUISJsonStructure.prebuiltEntities.length, 1);
                assert.equal(res.LUISJsonStructure.prebuiltEntities[0].name, "number");
                done();
            })
            .catch(err => done(err))
    });
    
});