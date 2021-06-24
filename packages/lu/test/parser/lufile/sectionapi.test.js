/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const chai = require('chai');
const assert = chai.assert;
const luparser = require('./../../../src/parser/lufile/luParser');
const SectionOperator = require('./../../../src/parser/lufile/sectionOperator');
const LUSectionTypes = require('./../../../src/parser/utils/enums/lusectiontypes');
const NEWLINE = require('os').EOL;

describe('luParser parse test', () => {
    let luresource = undefined;
    it('new Entity name should not use reserved keywords', () => {
        let fileContent = 
        `@ ml age
        @ prebuilt number`;

        luresource = luparser.parse(fileContent);
        assert.equal(luresource.Sections[0].Errors.length, 1);
        assert.equal(luresource.Sections[0].Errors[0].Message, 'The model name age is reserved.');
    })
});

describe('Section CRUD tests for intent', () => {
    let luresource = undefined;
    
    it('init section test', () => {
        let fileContent = 
        `# Greeting
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
        let newFileConent = 
        `# CheckEmail
        - check my email
        - show my emails
        
        > this is comment when adding simpleIntentSection`;

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

        let newFileConent = 
        `# CheckEmail
        - check my email
        - show my emails
        - check my mail box please
        
        > this is comment when updating simpleIntentSection`;

        let sectionId = luresource.Sections[1].Id;
        luresource = new SectionOperator(luresource).updateSection(luresource.Sections[1].Id, newFileConent);
        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 2);
        assert.equal(luresource.Sections[1].Errors.length, 0);
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[1].Name, 'CheckEmail');
        assert.equal(luresource.Sections[1].Id, sectionId);
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap.length, 3);
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap[0].utterance, 'check my email');
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap[1].utterance, 'show my emails');
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap[2].utterance, 'check my mail box please');
        assert.isTrue(luresource.Sections[1].Body.includes('> this is comment when updating simpleIntentSection'));
        assert.isFalse(luresource.Sections[1].Body.includes('> this is comment when adding simpleIntentSection'));
    });

    it('delete section test', () => {
        luresource = new SectionOperator(luresource).deleteSection(luresource.Sections[1].Id);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 1);
        assert.equal(luresource.Sections[0].Errors.length, 0);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[0].Name, 'Greeting');
        assert.isFalse(luresource.Sections[0].Body.includes('> this is comment when adding simpleIntentSection'));
        assert.isFalse(luresource.Sections[0].Body.includes('> this is comment when updating simpleIntentSection'));
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
        assert.equal(luresource.Errors.length, 1);
        assert.equal(luresource.Sections.length, 4);
        assert.equal(luresource.Sections[1].Errors.length, 0);
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[1].Name, 'CheckEmail');
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap.length, 0);
        
        assert.equal(luresource.Sections[2].Errors.length, 0);
        assert.equal(luresource.Sections[2].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[2].Name, 'CheckUnreadEmail');
        assert.equal(luresource.Sections[2].UtteranceAndEntitiesMap.length, 2);
        assert.equal(luresource.Sections[2].UtteranceAndEntitiesMap[0].utterance, 'check my unread email');
        assert.equal(luresource.Sections[2].UtteranceAndEntitiesMap[1].utterance, 'show my unread emails');
        assert.equal(luresource.Sections[2].Entities.length, 1);
        assert.equal(luresource.Sections[2].Entities[0].SectionType, LUSectionTypes.NEWENTITYSECTION);
        assert.equal(luresource.Sections[2].Entities[0].Name, 'emailTitle');
        assert.equal(luresource.Sections[2].Entities[0].Type, 'simple');

        assert.equal(luresource.Sections[3].Errors.length, 0);
        assert.equal(luresource.Sections[3].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[3].Name, 'CheckDeletedEmail');
        assert.equal(luresource.Sections[3].UtteranceAndEntitiesMap.length, 2);
        assert.equal(luresource.Sections[3].UtteranceAndEntitiesMap[0].utterance, 'check my deleted email');
        assert.equal(luresource.Sections[3].UtteranceAndEntitiesMap[1].utterance, 'show my deleted emails');
        assert.equal(luresource.Sections[3].Entities[0].SectionType, LUSectionTypes.NEWENTITYSECTION);
        assert.equal(luresource.Sections[3].Entities[0].Name, 'emailSubject');
        assert.equal(luresource.Sections[3].Entities[0].Type, 'simple');
    });

    it('add nestedIntentSection test with enableSections flag set', () => {
        let newFileConent = `# CheckTodo${NEWLINE}## CheckUnreadTodo${NEWLINE}- check my unread todo${NEWLINE}- show my unread todos${NEWLINE}${NEWLINE}@ simple todoTitle${NEWLINE}${NEWLINE}## CheckDeletedTodo${NEWLINE}- check my deleted todo${NEWLINE}- show my deleted todos${NEWLINE}${NEWLINE}@ simple todoSubject`;
        luresource = luparser.parse(luresource.Content + NEWLINE + '> !# @enableSections = true');
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

        assert.equal(luresource.Sections[3].Errors.length, 0);
        assert.equal(luresource.Sections[3].SectionType, LUSectionTypes.NESTEDINTENTSECTION);
        assert.equal(luresource.Sections[3].Name, 'CheckTodo');
        assert.equal(luresource.Sections[3].Body, `## CheckUnreadTodo${NEWLINE}- check my unread todo${NEWLINE}- show my unread todos${NEWLINE}${NEWLINE}@ simple todoTitle${NEWLINE}${NEWLINE}## CheckDeletedTodo${NEWLINE}- check my deleted todo${NEWLINE}- show my deleted todos${NEWLINE}${NEWLINE}@ simple todoSubject`);
        assert.equal(luresource.Sections[3].SimpleIntentSections.length, 2);
        assert.equal(luresource.Sections[3].SimpleIntentSections[0].Name, 'CheckUnreadTodo');
        assert.equal(luresource.Sections[3].SimpleIntentSections[0].Body, `- check my unread todo${NEWLINE}- show my unread todos${NEWLINE}${NEWLINE}@ simple todoTitle${NEWLINE}`);
        assert.equal(luresource.Sections[3].SimpleIntentSections[0].Entities[0].SectionType, LUSectionTypes.NEWENTITYSECTION);
        assert.equal(luresource.Sections[3].SimpleIntentSections[0].Entities[0].Name, 'todoTitle');
        assert.equal(luresource.Sections[3].SimpleIntentSections[0].Entities[0].Type, 'simple');
        assert.equal(luresource.Sections[3].SimpleIntentSections[0].UtteranceAndEntitiesMap[1].utterance, 'show my unread todos');

        assert.equal(luresource.Sections[3].SimpleIntentSections[1].Name, 'CheckDeletedTodo');
        assert.equal(luresource.Sections[3].SimpleIntentSections[1].Entities[0].SectionType, LUSectionTypes.NEWENTITYSECTION);
        assert.equal(luresource.Sections[3].SimpleIntentSections[1].Entities[0].Name, 'todoSubject');
        assert.equal(luresource.Sections[3].SimpleIntentSections[1].Entities[0].Type, 'simple');
        assert.equal(luresource.Sections[3].SimpleIntentSections[1].UtteranceAndEntitiesMap[0].utterance, 'check my deleted todo');
    });

    it('update section test for invalid content', () => {
        // missing '-' before utterance hello
        let newFileConent = `# Greeting${NEWLINE}> comment1${NEWLINE}- hi${NEWLINE}hello${NEWLINE}$${NEWLINE}@${NEWLINE}> comment2`;

        let sectionId = luresource.Sections[0].Id;
        luresource = new SectionOperator(luresource).updateSection(luresource.Sections[0].Id, newFileConent);
        
        assert.equal(luresource.Errors.length, 4);
        assert.equal(luresource.Sections.length, 4);
        assert.equal(luresource.Sections[0].Errors.length, 4);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[0].Name, 'Greeting');
        assert.equal(luresource.Sections[0].Id, sectionId);
        assert.equal(luresource.Sections[0].UtteranceAndEntitiesMap.length, 1);
        assert.equal(luresource.Sections[0].UtteranceAndEntitiesMap[0].utterance, 'hi');
        assert.equal(luresource.Sections[0].Body, `> comment1${NEWLINE}- hi${NEWLINE}hello${NEWLINE}$${NEWLINE}@${NEWLINE}> comment2`);
    });

    it('update section test for invalid content2', () => {
        // missing entity type after '$a', here 'a' is entity name
        let newFileConent = `# Greeting${NEWLINE}> comment1${NEWLINE}- hi${NEWLINE}$a${NEWLINE}> comment2`;

        let sectionId = luresource.Sections[0].Id;
        luresource = new SectionOperator(luresource).updateSection(luresource.Sections[0].Id, newFileConent);
        assert.equal(luresource.Errors.length, 1);
        assert.equal(luresource.Sections.length, 4);
        assert.equal(luresource.Sections[0].Errors.length, 1);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[0].Name, 'Greeting');
        assert.equal(luresource.Sections[0].Id, sectionId);
        assert.equal(luresource.Sections[0].UtteranceAndEntitiesMap.length, 1);
        assert.equal(luresource.Sections[0].UtteranceAndEntitiesMap[0].utterance, 'hi');
        assert.equal(luresource.Sections[0].Body, `> comment1${NEWLINE}- hi${NEWLINE}$a${NEWLINE}> comment2`);
    });

    it('add section test for nested section content with comments', () => {
        let simpleIntentBody1 = `- hello${NEWLINE}- hi${NEWLINE}> this is comment 1${NEWLINE}@${NEWLINE}> this is comment 2${NEWLINE}`
        let simpleIntentBody2 = `- bye${NEWLINE}$${NEWLINE}> this is comment 3${NEWLINE}${NEWLINE}> this is comment 4${NEWLINE}${NEWLINE}`
        let nestedIntentBody = `## greeting${NEWLINE}${simpleIntentBody1}${NEWLINE}## goodbye${NEWLINE}${simpleIntentBody2}`
        let newFileConent = `# nestedIntentWithComments${NEWLINE}${nestedIntentBody}${NEWLINE}[xxx](b.lu)`

        luresource = new SectionOperator(luresource).addSection(newFileConent);

        assert.equal(luresource.Errors.length, 4);
        assert.equal(luresource.Sections.length, 6);
        assert.equal(luresource.Sections[4].Errors.length, 3);
        assert.equal(luresource.Sections[4].SectionType, LUSectionTypes.NESTEDINTENTSECTION);
        assert.equal(luresource.Sections[4].Name, 'nestedIntentWithComments');
        assert.equal(luresource.Sections[4].SimpleIntentSections[0].Body, simpleIntentBody1);
        assert.equal(luresource.Sections[4].SimpleIntentSections[1].Body, simpleIntentBody2);
        assert.equal(luresource.Sections[4].Body, nestedIntentBody);
    });
});

describe('Section CRUD tests for entity', () => {
    let luresource = undefined;
    
    it('init section test', () => {
        let fileContent = 
`@ list BreadEntity =
    - multiGrainWheat:
        - multi
    - rye:
        - rye

# Greeting
- hi`;

        luresource = luparser.parse(fileContent);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 2);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.NEWENTITYSECTION);
        assert.equal(luresource.Sections[0].Name, 'BreadEntity');
        assert.equal(luresource.Sections[0].Type, 'list');
        assert.equal(luresource.Sections[0].ListBody.length, 4);
        assert.equal(luresource.Sections[0].ListBody[0], '    - multiGrainWheat:');
        assert.equal(luresource.Sections[0].ListBody[1], '        - multi');
        assert.equal(luresource.Sections[0].ListBody[2], '    - rye:');
        assert.equal(luresource.Sections[0].ListBody[3], '        - rye');
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[1].Name, 'Greeting');
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap.length, 1);
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap[0].utterance, 'hi');
    });

    it('update entity section test', () => {
        let newFileConent =
`@ list BreadEntity =
    - multiGrainWheat:
        - multi grain
    - white:
        - white`;

        luresource = new SectionOperator(luresource).updateSection(luresource.Sections[0].Id, newFileConent);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 2);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.NEWENTITYSECTION);
        assert.equal(luresource.Sections[0].Name, 'BreadEntity');
        assert.equal(luresource.Sections[0].Type, 'list');
        assert.equal(luresource.Sections[0].ListBody.length, 4);
        assert.equal(luresource.Sections[0].ListBody[0], '    - multiGrainWheat:');
        assert.equal(luresource.Sections[0].ListBody[1], '        - multi grain');
        assert.equal(luresource.Sections[0].ListBody[2], '    - white:');
        assert.equal(luresource.Sections[0].ListBody[3], '        - white');
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[1].Name, 'Greeting');
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap.length, 1);
        assert.equal(luresource.Sections[1].UtteranceAndEntitiesMap[0].utterance, 'hi');
    });
});

describe('Section CRUD tests for error import in utterances', () => {
    let luresource = undefined;
    
    it('init section test', () => {
        let fileContent = 
`# Greeting
- hi
[]
[
]
> @ ml city
# Cancel
- cancel that`;

        luresource = luparser.parse(fileContent);
        assert.equal(luresource.Errors.length, 1);
        assert.equal(luresource.Errors[0].Message, 'Invalid intent body line, did you miss \'-\' at line begin')
        assert.equal(luresource.Sections.length, 2);
        assert.equal(luresource.Sections[0].Body, `- hi${NEWLINE}[]${NEWLINE}[${NEWLINE}]${NEWLINE}> @ ml city`);
        assert.equal(luresource.Sections[1].Name, 'Cancel')
        assert.equal(luresource.Sections[1].Body, '- cancel that')
    });
});

describe('Section CRUD tests for qna', () => {
    let luresource = undefined;

    let fileContent = 
`# ? who is CEO of Microsoft
- Microsoft CEO

\`\`\`
Satya Nadella
\`\`\``;

    let addedFileContent = 
`# ? what about the weather of Seattle
- how about the weather of Seattle

\`\`\`
warm and rainy
\`\`\``
    
    let updatedFileConent = 
`# ? who is CEO of Facebook
- Facebook CEO

\`\`\`
Mark Zuckerberg
\`\`\``;

    let insertFileContent =
`# ? how to greet

\`\`\`
hello
\`\`\``

    it('add qna section test', () => {
        luresource = luparser.parse(fileContent);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 1);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[0].Body.replace(/\r\n/g,"\n"), fileContent);
        
        luresource = new SectionOperator(luresource).addSection(addedFileContent);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 2);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[1].Body.replace(/\r\n/g,"\n"), addedFileContent);
    });

    it('update qna section test', () => {
        luresource = new SectionOperator(luresource).updateSection(luresource.Sections[0].Id, updatedFileConent);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 2);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[0].Body.replace(/\r\n/g,"\n"), updatedFileConent);
    });

    it('insert qna section at begining test', () => {
        luresource = new SectionOperator(luresource).insertSection(luresource.Sections[0].Id, insertFileContent);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 3);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[2].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[0].Body.replace(/\r\n/g,"\n"), insertFileContent);
        assert.equal(luresource.Sections[1].Body.replace(/\r\n/g,"\n"), updatedFileConent);
        assert.equal(luresource.Sections[2].Body.replace(/\r\n/g,"\n"), addedFileContent);
    });

    it('delete qna section test', () => {
        luresource = new SectionOperator(luresource).deleteSection(luresource.Sections[0].Id);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 2);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[0].Body.replace(/\r\n/g,"\n"), updatedFileConent);
        assert.equal(luresource.Sections[1].Body.replace(/\r\n/g,"\n"), addedFileContent);
    });

    it('insert qna section at middle test', () => {
        luresource = new SectionOperator(luresource).insertSection(luresource.Sections[1].Id, insertFileContent);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 3);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[2].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[0].Body.replace(/\r\n/g,"\n"), updatedFileConent);
        assert.equal(luresource.Sections[1].Body.replace(/\r\n/g,"\n"), insertFileContent);
        assert.equal(luresource.Sections[2].Body.replace(/\r\n/g,"\n"), addedFileContent);
    });

    it('insert qna section at empty file', () => {
        luresource = luparser.parse('');
        luresource = new SectionOperator(luresource).insertSection(0, insertFileContent);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 1);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[0].Body.replace(/\r\n/g,"\n"), insertFileContent);
    });
});

describe('Section range tests', () => {    
    it('simple intent section test', () => {
        let fileContent =
`# Cancel
- cancel it

#    Greeting
## HelloGreeting
- hi

@simple e1

## ByeGreeting
- bye

@ ml e2`;

        let luresource = luparser.parse(fileContent);

        assert.equal(luresource.Errors.length, 1);
        assert.equal(luresource.Sections.length, 4);

        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[0].Name, 'Cancel');
        assert.equal(luresource.Sections[0].Range.Start.Line, 1)
        assert.equal(luresource.Sections[0].Range.Start.Character, 0)
        assert.equal(luresource.Sections[0].Range.End.Line, 3)
        assert.equal(luresource.Sections[0].Range.End.Character, 0)

        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[1].Name, 'Greeting');
        assert.equal(luresource.Sections[1].Range.Start.Line, 4)
        assert.equal(luresource.Sections[1].Range.Start.Character, 0)
        assert.equal(luresource.Sections[1].Range.End.Line, 4)
        assert.equal(luresource.Sections[1].Range.End.Character, 13)

        assert.equal(luresource.Sections[2].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[2].Name, 'HelloGreeting');
        assert.equal(luresource.Sections[2].Range.Start.Line, 5)
        assert.equal(luresource.Sections[2].Range.Start.Character, 0)
        assert.equal(luresource.Sections[2].Range.End.Line, 9)
        assert.equal(luresource.Sections[2].Range.End.Character, 0)

        assert.equal(luresource.Sections[3].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[3].Name, 'ByeGreeting');
        assert.equal(luresource.Sections[3].Range.Start.Line, 10)
        assert.equal(luresource.Sections[3].Range.Start.Character, 0)
        assert.equal(luresource.Sections[3].Range.End.Line, 13)
        assert.equal(luresource.Sections[3].Range.End.Character, 7)
    });

    it('nested intent section test', () => {
        let fileContent =
`> !# @enableSections = true
# Greeting
## HelloGreeting
- hi

@simple e1

## ByeGreeting
- bye

@ ml e2`;

        let luresource = luparser.parse(fileContent);
        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 2);

        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.NESTEDINTENTSECTION);
        assert.equal(luresource.Sections[1].Name, 'Greeting');
        assert.equal(luresource.Sections[1].Range.Start.Line, 2)
        assert.equal(luresource.Sections[1].Range.Start.Character, 0)
        assert.equal(luresource.Sections[1].Range.End.Line, 11)
        assert.equal(luresource.Sections[1].Range.End.Character, 7)
    });

    it('simple intent section with errors test', () => {
        let fileContent =
`#WhoAreYou
- my name is {@userName=luhan}
@ prebuilt personName hasRoles
`;

        let updatedContent = 
`#WhoAreYou
- my name is {@userName=luhan}
@ prebuilt personName hasRoles userName`;

        let luresource = luparser.parse(fileContent);

        assert.equal(luresource.Errors.length, 2);
        assert.equal(luresource.Sections.length, 1);
        assert.equal(luresource.Content.replace(/\r\n/g, "\n"), `${fileContent}`);
        assert.equal(`#WhoAreYou${NEWLINE}${luresource.Sections[0].Body}`.replace(/\r\n/g, "\n"), fileContent);

        luresource = new SectionOperator(luresource).updateSection(luresource.Sections[0].Id, updatedContent);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 1);
        assert.equal(luresource.Content.replace(/\r\n/g, "\n"), updatedContent);
        assert.equal(`#WhoAreYou${NEWLINE}${luresource.Sections[0].Body}`.replace(/\r\n/g, "\n"), updatedContent);
    });
})

describe('Section CRUD tests for insert and update sections with newline', () => {
    let luresource = undefined;

    let fileContent =
`# ? who is CEO of Microsoft
- Microsoft CEO

\`\`\`
Satya Nadella
\`\`\``;

    let updatedQnAConent =
`# ? who is CEO of Facebook
- Facebook CEO

\`\`\`
Mark Zuckerberg
\`\`\``;

    let insertQnAContent =
`# ? how to greet

\`\`\`
hello
\`\`\``

    let insertQnAContent2 =
`# ? how to cancel

\`\`\`
cancel that
\`\`\``

    let insertLuContent =
`# welcome
- welcome here`

    let insertLuContent2 =
`# stop
- stop that`

    it('update qna section test', () => {
        luresource = luparser.parse(fileContent);

        luresource = new SectionOperator(luresource).updateSection(luresource.Sections[0].Id, `${NEWLINE}${updatedQnAConent}${NEWLINE}`);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 1);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[0].Body.replace(/\r\n/g, "\n"), `${updatedQnAConent}\n`);
    });

    it('insert qna section at begining test', () => {
        luresource = new SectionOperator(luresource).insertSection(luresource.Sections[0].Id, `${NEWLINE}${insertQnAContent}`);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 2);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[0].Body.replace(/\r\n/g, "\n"), `${insertQnAContent}`);
        assert.equal(luresource.Sections[1].Body.replace(/\r\n/g, "\n"), `${updatedQnAConent}\n`);
    });

    it('insert qna section at middle test', () => {
        luresource = new SectionOperator(luresource).insertSection(luresource.Sections[1].Id, `${NEWLINE}${NEWLINE}${insertQnAContent2}${NEWLINE}`);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 3);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[2].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[0].Body.replace(/\r\n/g, "\n"), `${insertQnAContent}\n\n`);
        assert.equal(luresource.Sections[1].Body.replace(/\r\n/g, "\n"), `${insertQnAContent2}\n`);
        assert.equal(luresource.Sections[2].Body.replace(/\r\n/g, "\n"), `${updatedQnAConent}\n`);
        assert.equal(luresource.Content.replace(/\r\n/g, "\n"), `\n\n${insertQnAContent}\n\n\n${insertQnAContent2}\n\n${updatedQnAConent}\n`);
    });

    it('insert lu section at begining test', () => {
        luresource = new SectionOperator(luresource).insertSection(luresource.Sections[0].Id, `${NEWLINE}${insertLuContent}${NEWLINE}${NEWLINE}`);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 4);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(`# welcome\n${luresource.Sections[0].Body.replace(/\r\n/g, "\n")}`, `${insertLuContent}\n\n`);
    });

    it('update qna section with lu section test', () => {
        luresource = new SectionOperator(luresource).updateSection(luresource.Sections[3].Id, `${NEWLINE}${insertLuContent2}${NEWLINE}`);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 4);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[2].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Sections[3].SectionType, LUSectionTypes.SIMPLEINTENTSECTION);
        assert.equal(`# welcome\n${luresource.Sections[0].Body.replace(/\r\n/g, "\n")}`, `${insertLuContent}\n\n`);
        assert.equal(luresource.Sections[1].Body.replace(/\r\n/g, "\n"), `${insertQnAContent}\n\n`);
        assert.equal(luresource.Sections[2].Body.replace(/\r\n/g, "\n"), `${insertQnAContent2}\n\n`);
        assert.equal(`# stop\n${luresource.Sections[3].Body.replace(/\r\n/g, "\n")}`, `${insertLuContent2}\n`);
        assert.equal(luresource.Content.replace(/\r\n/g, "\n"), `\n\n\n${insertLuContent}\n\n\n${insertQnAContent}\n\n\n${insertQnAContent2}\n\n\n${insertLuContent2}\n`);
    });
});

describe('Section CRUD tests for import section', () => {
    let luresource = undefined;

    let importContent1 = `[import](howto.source.qna)`;
    let importContent2 = ` [import](guide.source.qna)`;

    let qnaContent = 
`# ? who is CEO of Microsoft
- Microsoft CEO

\`\`\`
Satya Nadella
\`\`\``;

    let insertImportConent = ` [import](windows.source.qna)`;

    it('insert qna section test', () => {
        luresource = luparser.parse(`${importContent1}${NEWLINE}${importContent2}${NEWLINE}${NEWLINE}${qnaContent}`);
        luresource = new SectionOperator(luresource).insertSection(luresource.Sections[2].Id, `${NEWLINE}${insertImportConent}`);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 4);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.IMPORTSECTION);
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.IMPORTSECTION);
        assert.equal(luresource.Sections[2].SectionType, LUSectionTypes.IMPORTSECTION);
        assert.equal(luresource.Sections[3].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Content.replace(/\r\n/g, "\n"), `${importContent1}\n${importContent2}\n\n\n${insertImportConent}\n${qnaContent}`);
    });

    it('delete qna section test', () => {
        luresource = new SectionOperator(luresource).deleteSection(luresource.Sections[1].Id);

        assert.equal(luresource.Errors.length, 0);
        assert.equal(luresource.Sections.length, 3);
        assert.equal(luresource.Sections[0].SectionType, LUSectionTypes.IMPORTSECTION);
        assert.equal(luresource.Sections[1].SectionType, LUSectionTypes.IMPORTSECTION);
        assert.equal(luresource.Sections[2].SectionType, LUSectionTypes.QNASECTION);
        assert.equal(luresource.Content.replace(/\r\n/g, "\n"), `${importContent1}\n\n\n${insertImportConent}\n${qnaContent}`);
    });
});