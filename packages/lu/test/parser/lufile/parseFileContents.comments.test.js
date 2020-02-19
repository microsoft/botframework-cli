/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var chai = require('chai');
var assert = chai.assert;
const parseFileContents = require('./../../../src/parser/lufile/parseFileContents');
var inputFileContent = `> Definition for greeting intent
        # Greeting
        - Hi
        - Hello
        > users might say these
        - Good morning 
        - Good evening`;
var outputBlob =
{
    "intents": [
        {
            "name": "Greeting"
        }
    ],
    "entities": [],
    "composites": [],
    "closedLists": [],
    "regex_entities": [],
    "model_features": [],
    "regex_features": [],
    "utterances": [
        {
            "text": "Hi",
            "intent": "Greeting",
            "entities": []
        },
        {
            "text": "Hello",
            "intent": "Greeting",
            "entities": []
        },
        {
            "text": "Good morning",
            "intent": "Greeting",
            "entities": []
        },
        {
            "text": "Good evening",
            "intent": "Greeting",
            "entities": []
        }
    ],
    "patterns": [],
    "patternAnyEntities": [],
    "prebuiltEntities": [],
    "luis_schema_version": "3.2.0",
    "versionId": "0.1",
    "name": "",
    "desc": "",
    "culture": "en-us"
};

describe('Comment blocks in .lu files', function() {
    it('should be parsed correctly with 1 intent and comments specified', function(done) {
        parseFileContents.parseFile(inputFileContent, false, 'en-us')
            .then(function(parsedContent){
                assert.deepEqual(parsedContent.LUISJsonStructure, outputBlob);
                done();
            })
            .catch(err => done(err))
    });
});