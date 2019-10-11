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


    it('add simpleIntentSection test', () => {
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

    it('add nestedIntentSection test with enableSections flag unset', () => {
        let newFileConent = 
        `# CheckEmail
         ## CheckUnreadEmail
         - check my unread email
         - show my unread emails
         
         @ simple emailTitle

         ## CheckDeletedEmail
         - check my deleted email
         - show my deleted emails
         
         @ simple emailSubject`;

        luresource = new SectionOperator(luresource).addSection(newFileConent);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 4);
        assert.equal(luresource.Sections[0].Errors.length, 0);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[0].Name, 'CheckEmail');
        assert.equal(luresource.Sections[0].UtteranceAndEntitiesMap.length, 0);
        
        assert.equal(luresource.Sections[1].Errors.length, 0);
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[1].Name, 'CheckUnreadEmail');
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap.length, 2);
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap[0].utterance, 'check my unread email');
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap[1].utterance, 'show my unread emails');
        assert.equal(luresource.Sections[1].Entities.length, 1);
        assert.equal(luresource.Sections[1].Entities[0].SectionType, LUSectionTypes.NEWENTITYSECTION);
        assert.equal(luresource.Sections[1].Entities[0].Name, 'emailTitle');
        assert.equal(luresource.Sections[1].Entities[0].Type, 'simple');

        assert.equal(luresource.Sections[2].Errors.length, 0);
        assert.equal(luresource.Sections[2].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[2].Name, 'CheckDeletedEmail');
        assert.equal(luresource.Sections[2].UtteranceAndEntitiesMap.length, 2);
        assert.equal(luresource.Sections[2].UtteranceAndEntitiesMap[0].utterance, 'check my deleted email');
        assert.equal(luresource.Sections[2].UtteranceAndEntitiesMap[1].utterance, 'show my deleted emails');
        assert.equal(luresource.Sections[2].Entities[0].SectionType, LUSectionTypes.NEWENTITYSECTION);
        assert.equal(luresource.Sections[2].Entities[0].Name, 'emailSubject');
        assert.equal(luresource.Sections[2].Entities[0].Type, 'simple');
    });

    it('add nestedIntentSection test with enableSections flag set', () => {
        let newFileConent = 
        `> !# @enableSections = true

         # CheckTodo
         ## CheckUnreadTodo
         - check my unread todo
         - show my unread todos
         
         @ simple todoTitle

         ## CheckDeletedTodo
         - check my deleted todo
         - show my deleted todos
         
         @ simple todoSubject`;

        luresource = new SectionOperator(luresource).addSection(newFileConent);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 4);

        assert.equal(luresource.Sections[1].Errors.length, 0);
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.NESTEDINTENTSECTION);
        assert.equal(luresource.Sections[1].Name, 'CheckEmail');
        assert.equal(luresource.Sections[1].SimpleIntentSections.length, 2);
        assert.equal(luresource.Sections[1].SimpleIntentSections[0].Name, 'CheckUnreadEmail');
        assert.equal(luresource.Sections[1].SimpleIntentSections[0].Entities[0].SectionType, LUSectionTypes.NEWENTITYSECTION);
        assert.equal(luresource.Sections[1].SimpleIntentSections[0].Entities[0].Name, 'emailTitle');
        assert.equal(luresource.Sections[1].SimpleIntentSections[0].Entities[0].Type, 'simple');
        assert.equal(luresource.Sections[1].SimpleIntentSections[0].UtteranceAndEntitiesMap[1].utterance, 'show my unread emails');

        assert.equal(luresource.Sections[1].SimpleIntentSections[1].Name, 'CheckDeletedEmail');
        assert.equal(luresource.Sections[1].SimpleIntentSections[1].Entities[0].SectionType, LUSectionTypes.NEWENTITYSECTION);
        assert.equal(luresource.Sections[1].SimpleIntentSections[1].Entities[0].Name, 'emailSubject');
        assert.equal(luresource.Sections[1].SimpleIntentSections[1].Entities[0].Type, 'simple');
        assert.equal(luresource.Sections[1].SimpleIntentSections[1].UtteranceAndEntitiesMap[0].utterance, 'check my deleted email');

        assert.equal(luresource.Sections[2].Errors.length, 0);
        assert.equal(luresource.Sections[2].SectionType, LUSectionTypes.NESTEDINTENTSECTION);
        assert.equal(luresource.Sections[2].Name, 'CheckTodo');
        assert.equal(luresource.Sections[2].SimpleIntentSections.length, 2);
        assert.equal(luresource.Sections[2].SimpleIntentSections[0].Name, 'CheckUnreadTodo');
        assert.equal(luresource.Sections[2].SimpleIntentSections[0].Entities[0].SectionType, LUSectionTypes.NEWENTITYSECTION);
        assert.equal(luresource.Sections[2].SimpleIntentSections[0].Entities[0].Name, 'todoTitle');
        assert.equal(luresource.Sections[2].SimpleIntentSections[0].Entities[0].Type, 'simple');
        assert.equal(luresource.Sections[2].SimpleIntentSections[0].UtteranceAndEntitiesMap[1].utterance, 'show my unread todos');

        assert.equal(luresource.Sections[2].SimpleIntentSections[1].Name, 'CheckDeletedTodo');
        assert.equal(luresource.Sections[2].SimpleIntentSections[1].Entities[0].SectionType, LUSectionTypes.NEWENTITYSECTION);
        assert.equal(luresource.Sections[2].SimpleIntentSections[1].Entities[0].Name, 'todoSubject');
        assert.equal(luresource.Sections[2].SimpleIntentSections[1].Entities[0].Type, 'simple');
        assert.equal(luresource.Sections[2].SimpleIntentSections[1].UtteranceAndEntitiesMap[0].utterance, 'check my deleted todo');
    });
});