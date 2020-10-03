/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const chai = require('chai');
const assert = chai.assert;
const validateResource = require('../../../src/parser/lufile/parseFileContents').validateResource;
const luparser = require('../../../src/parser/lufile/luParser')

describe('ML entity config', () => {
  it('Throws when ML entity is disable', function () {
    let fileContent = `@ ml userName`;
    let luresource = luparser.parse(fileContent);
    let errors = validateResource(luresource, { enableMLEntities: false })
    assert.include(errors[0].Message, 'Do not support ML entity')
  });

  it('Throws when ML entity is disable in utterance(1)', function () {
    let fileContent = `# AskForUserName
      - {userName=Jack}`;
    let luresource = luparser.parse(fileContent);
    let errors = validateResource(luresource, { enableMLEntities: false })
    assert.include(errors[0].Message, 'Do not support ML entity')
  });

  it('Throws when ML entity is disable in utterance(2)', function () {
    let fileContent = `# AskForUserName
      - {@userName=Jack}`;
    let luresource = luparser.parse(fileContent);
    let errors = validateResource(luresource, { enableMLEntities: false })
    assert.include(errors[0].Message, 'Do not support ML entity')
  });
});

describe('list entity config', () => {
  it('Throws when list entity is disable', function () {
    let fileContent = `@ list l1 hasRoles lr1,lr2 =
    - one :
        - two
        - three
    - four :
        - five
        - six`;
    let luresource = luparser.parse(fileContent);
    let errors = validateResource(luresource, { enableListEntities: false })
    assert.include(errors[0].Message, 'Do not support List entity')
  });
});

describe('composite entity config', () => {
  it('Throws when composite entity is disable', function () {
    let fileContent = `# setThermostat
        - Please set {deviceTemperature = thermostat to 72}
        - Set {deviceTemperature = {customDevice = owen} to 72}

    $deviceTemperature: [device, customDevice, temperature]

    $device : thermostat=
        - Thermostat
        - Heater
        - AC
        - Air conditioner

    $device : refrigerator=
        - Fridge
        - Cooler

    $customDevice : simple

    $PREBUILT : temperature
    `;
    let luresource = luparser.parse(fileContent);
    let errors = validateResource(luresource, { enableCompositeEntities: false })
    assert.include(errors[0].Message, 'Do not support Composite entity')
  });
});

describe('prebuilt entity config', () => {
  it('Throws when prebuilt entity is disable', function () {
    let fileContent = `# addAlarm
    - create an alarm for 7AM
    - create an alarm for {datetimeV2}

    $PREBUILT:datetimeV2`;
    let luresource = luparser.parse(fileContent);
    let errors = validateResource(luresource, { enablePrebuiltEntities: false })
    assert.include(errors[0].Message, 'Do not support Prebuilt entity')
  });
});

describe('regex entity config', () => {
  it('Throws when regex entity is disable', function () {
    let fileContent = `$HRF-number:/hrf-[0-9]{6}/`;
    let luresource = luparser.parse(fileContent);
    let errors = validateResource(luresource, { enableRegexEntities: false })
    assert.include(errors[0].Message, 'Do not support Regex entity')
  });
});

describe('Phrase Lists config', () => {
  it('Throws when PhraseLists is disable', function () {
    let fileContent = `$ChocolateType:phraseList
    - m&m,mars,mints,spearmings,payday,jelly,kit kat,kitkat,twix

    $question:PhraseList interchangeable
    - are you
    - you are`;
    let luresource = luparser.parse(fileContent);
    let errors = validateResource(luresource, { enablePhraseLists: false })
    assert.include(errors[0].Message, 'Do not support Phrase Lists')
  });
});

describe('user features config', () => {
  it('Throws when PhraseLists is disable', function () {
    let fileContent = `## intent1

    @ intent intent1 usesFeature phraselist1`;
    let luresource = luparser.parse(fileContent);
    let errors = validateResource(luresource, { enableFeatures: false })
    assert.include(errors[0].Message, 'Do not support Features')
  });
});

describe('Model Description config', () => {
  it('Throws when model description is disable', function () {
    let fileContent = `> !# @app.name = all

    # AskForUserName`;
    let luresource = luparser.parse(fileContent);
    let errors = validateResource(luresource, { enableModelDescription: false })
    assert.include(errors[0].Message, 'Do not support Model Description')
  });
});

describe('External References config', () => {
  it('Throws when external references is disable', function () {
    let fileContent = `[all LU files](../**)`;
    let luresource = luparser.parse(fileContent);
    let errors = validateResource(luresource, { enableExternalReferences: false })
    assert.include(errors[0].Message, 'Do not support External References')
  });
});

describe('Pattern config', () => {
  it('Throws when pattern is disable in utterance', function () {
    let fileContent = `# addToDo
    - add {item} to my shopping list
    - pls add {item} to my list`;
    let luresource = luparser.parse(fileContent);
    let errors = validateResource(luresource, { enablePattern: false })
    assert.include(errors[0].Message, 'Do not support Pattern')
  });

  it('Throws when pattern is disable', function () {
    let fileContent = `> # Pattern.Any entities
    @ patternany alarmTime`;
    let luresource = luparser.parse(fileContent);
    let errors = validateResource(luresource, { enablePattern: false })
    assert.include(errors[0].Message, 'Do not support Pattern')
  });
});

describe('ValidateResource don\'t change resource in memory', () => {
  it('ValidateResource don\'t change resource in memory', function () {
    let fileContent = `> !# @enableSections = true
 
    # CheckTodo
    ## CheckUnreadTodo
    - check my unread todo
    - show my unread todos
     
    @ simple todoTitle
     
    ## CheckDeletedTodo
    - check my deleted todo
    - show my deleted todos
     
    @ simple todoSubject`;
    let luresource = luparser.parse(fileContent);
    let errors = validateResource(luresource);
    assert.equal(errors.length, 0);
    assert.equal(luresource.Sections.length, 2);
  });
});
