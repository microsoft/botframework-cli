/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const chai = require('chai');
const assert = chai.assert;
const luparser = require('./../../../src/parser/lufile/luParser');
const SectionOperator = require('./../../../src/parser/lufile/sectionOperator');
const LUSectionTypes = require('./../../../src/parser/lufile/enums/lusectiontypes');

describe('Section CRUD test', () => {
    let luresource = undefined;
    
    it('init section test', () => {
        let fileContent = `# Greeting
        - hi
        - hello`;

        luresource = luparser.parse(fileContent);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 1);
        assert.equal(luresource.Sections[0].Errors.length, 0);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[0].Name, 'Greeting');
        assert.equal(luresource.Sections[0].UtteranceAndEntitiesMap.length, 2);
        assert.equal(luresource.Sections[0].UtteranceAndEntitiesMap[0].utterance, 'hi');
        assert.equal(luresource.Sections[0].UtteranceAndEntitiesMap[1].utterance, 'hello');
    });


    it('add section test', () => {
        let newFileConent = `# CheckEmail
        - check my email
        - show my emails`;

        luresource = new SectionOperator(luresource).addSection(newFileConent);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 2);
        assert.equal(luresource.Sections[1].Errors.length, 0);
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[1].Name, 'CheckEmail');
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap.length, 2);
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap[0].utterance, 'check my email');
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap[1].utterance, 'show my emails');
    });

    it('add multi section test', () => {
        let newFileConent = `# intent1
        - check my email
        - show my emails
        
        # intent2
        - check my email
        - show my emails`;

        assert.throw(
            () => {
                new SectionOperator(luresource).addSection(newFileConent);
            },
            'Please operate one section at a time.'
        );
    });

    it('update section test', () => {

        let newFileConent = `# CheckEmail
        - check my email
        - show my emails
        - check my mail box please`;
        luresource = new SectionOperator(luresource).updateSection(luresource.Sections[1].Id, newFileConent);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 2);
        assert.equal(luresource.Sections[1].Errors.length, 0);
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[1].Name, 'CheckEmail');
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap.length, 3);
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap[0].utterance, 'check my email');
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap[1].utterance, 'show my emails');
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap[2].utterance, 'check my mail box please');
    });


    it('delete section test', () => {
        luresource = new SectionOperator(luresource).deleteSection(luresource.Sections[1].Id);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 1);
        assert.equal(luresource.Sections[0].Errors.length, 0);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[0].Name, 'Greeting');
    });
});