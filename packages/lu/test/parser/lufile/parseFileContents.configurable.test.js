/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const chai = require('chai');
const assert = chai.assert;
const parseFile = require('../../../src/parser/lufile/parseFileContents').parseFile;
const retCode = require('../../../src/parser/utils/enums/CLI-errors').errorCode;

describe('ML entity config', () => {
    it('Throws when ML entity is disable', function(done){
      let fileContent = `@ ml userName`;
      parseFile(fileContent, false, null, {enableMLEntities: false})
          .then(res => done('Test fail! did not throw when expected'))
          .catch(err => {
              assert.include(err.text, 'Do not support ML entity');
              done()
          })
    });

    it('Throws when ML entity is disable in utterance(1)', function(done){
      let fileContent = `# AskForUserName
      - {userName=Jack}`;
      parseFile(fileContent, false, null, {enableMLEntities: false})
          .then(res => done('Test fail! did not throw when expected'))
          .catch(err => {
              assert.include(err.text, 'Do not support ML entity');
              done()
          })
    });

    it('Throws when ML entity is disable in utterance(2)', function(done){
      let fileContent = `# AskForUserName
      - {@userName=Jack}`;
      parseFile(fileContent, false, null, {enableMLEntities: false})
          .then(res => done('Test fail! did not throw when expected'))
          .catch(err => {
              assert.include(err.text, 'Do not support ML entity');
              done()
          })
    });
});

describe('list entity config', () => {
  it('Throws when list entity is disable', function(done){
    let fileContent = `@ list l1 hasRoles lr1,lr2 =
    - one :
        - two
        - three
    - four :
        - five
        - six`;
    parseFile(fileContent, false, null, {enableListEntities: false})
        .then(res => done('Test fail! did not throw when expected'))
        .catch(err => {
            assert.include(err.text, 'Do not support List entity');
            done()
        })
  });
});


describe('composite entity config', () => {
  it('Throws when composite entity is disable', function(done){
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
    parseFile(fileContent, false, null, {enableCompositeEntities: false})
        .then(res => done('Test fail! did not throw when expected'))
        .catch(err => {
            assert.include(err.text, 'Do not support Composite entity');
            done()
        })
  });
});


describe('prebuilt entity config', () => {
  it('Throws when prebuilt entity is disable', function(done){
    let fileContent = `# addAlarm
    - create an alarm for 7AM
    - create an alarm for {datetimeV2}

    $PREBUILT:datetimeV2`;
    parseFile(fileContent, false, null, {enablePrebuiltEntities: false})
        .then(res => done('Test fail! did not throw when expected'))
        .catch(err => {
            assert.include(err.text, 'Do not support Prebuilt entity');
            done()
        })
  });
});

describe('regex entity config', () => {
  it('Throws when regex entity is disable', function(done){
    let fileContent = `$HRF-number:/hrf-[0-9]{6}/`;
    parseFile(fileContent, false, null, {enableRegexEntities: false})
        .then(res => done('Test fail! did not throw when expected'))
        .catch(err => {
            assert.include(err.text, 'Do not support Regex entity');
            done()
        })
  });
});

describe('Phrase Lists config', () => {
  it('Throws when PhraseLists is disable', function(done){
    let fileContent = `$ChocolateType:phraseList
    - m&m,mars,mints,spearmings,payday,jelly,kit kat,kitkat,twix

    $question:PhraseList interchangeable
    - are you
    - you are`;
    parseFile(fileContent, false, null, {enablePhraseLists: false})
        .then(res => done('Test fail! did not throw when expected'))
        .catch(err => {
            assert.include(err.text, 'Do not support Phrase Lists');
            done()
        })
  });
});

describe('user features config', () => {
  it('Throws when PhraseLists is disable', function(done){
    let fileContent = `## intent1

    @ intent intent1 usesFeature phraselist1`;
    parseFile(fileContent, false, null, {enableFeatures: false})
        .then(res => done('Test fail! did not throw when expected'))
        .catch(err => {
            assert.include(err.text, 'Do not support Features');
            done()
        })
  });
});

describe('Model Description config', () => {
  it('Throws when model description is disable', function(done){
    let fileContent = `> !# @app.name = all

    # AskForUserName`;
    parseFile(fileContent, false, null, {enableModelDescription: false})
        .then(res => done('Test fail! did not throw when expected'))
        .catch(err => {
            assert.include(err.text, 'Do not support Model Description.');
            done()
        })
  });
});

describe('External References config', () => {
  it('Throws when external references is disable', function(done){
    let fileContent = `[all LU files](../**)`;
    parseFile(fileContent, false, null, {enableExternalReferences: false})
        .then(res => done('Test fail! did not throw when expected'))
        .catch(err => {
            assert.include(err.text, 'Do not support External References');
            done()
        })
  });
});

describe('Pattern config', () => {
  it('Throws when pattern is disable in utterance', function(done){
    let fileContent = `# addToDo
    - add {item} to my shopping list
    - pls add {item} to my list`;
    parseFile(fileContent, false, null, {enablePattern: false})
        .then(res => done('Test fail! did not throw when expected'))
        .catch(err => {
            assert.include(err.text, 'Do not support Pattern.');
            done()
        })
  });

  it('Throws when pattern is disable', function(done){
    let fileContent = `> # Pattern.Any entities
    @ patternany alarmTime`;
    parseFile(fileContent, false, null, {enablePattern: false})
        .then(res => done('Test fail! did not throw when expected'))
        .catch(err => {
            assert.include(err.text, 'Do not support Pattern.');
            done()
        })
  });
});
