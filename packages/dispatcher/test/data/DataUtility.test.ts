/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { DataUtility } from "../../src/data/DataUtility";

import { Utility } from "../../src/utility/Utility";

import { UnitTestHelper } from "../utility/Utility.test";
import { NgramSubwordFeaturizer } from "../../src/model/language_understanding/featurizer/NgramSubwordFeaturizer";

describe("Test Suite - data/DataUtility", () => {
    it("Test.0000 getDataFileTypeFromFilenameExtension", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string = "resources/data/LU/skills/emailskill/en/Email.lu";
        const dataFileType: string = DataUtility.getDataFileTypeFromFilenameExtension(filename);
        Utility.debuggingLog(`dataFileType=${dataFileType},` +
            `DataUtility.DATA_FORMAT_TYPE_LU={DataUtility.DATA_FORMAT_TYPE_LU}`);
        assert.ok(dataFileType === DataUtility.DATA_FORMAT_TYPE_LU);
    });
    it("Test.0001 getDataFileTypeFromFilenameExtension", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string = "resources/data/Columnar/Email.tsv";
        const dataFileType: string = DataUtility.getDataFileTypeFromFilenameExtension(filename);
        Utility.debuggingLog(`dataFileType=${dataFileType},` +
            `DataUtility.DATA_FORMAT_TYPE_TAB_DELIMITED=${DataUtility.DATA_FORMAT_TYPE_TAB_DELIMITED}`);
        assert.ok(dataFileType === DataUtility.DATA_FORMAT_TYPE_TAB_DELIMITED);
    });
    it("Test.0002 getDataFileTypeFromFilenameExtension", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string = "resources/data/EntityAnnotatedCorpus/ner_dataset.eac";
        const dataFileType: string = DataUtility.getDataFileTypeFromFilenameExtension(filename);
        Utility.debuggingLog(`dataFileType=${dataFileType},` +
            `DataUtility.DATA_FORMAT_TYPE_ENTITY_ANNOTATED_CORPUS=${DataUtility.DATA_FORMAT_TYPE_ENTITY_ANNOTATED_CORPUS}`);
        assert.ok(dataFileType === DataUtility.DATA_FORMAT_TYPE_ENTITY_ANNOTATED_CORPUS);
    });
    it("Test.0003 getDataFileTypeFromFilenameExtension", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string = "resources/data/LU/MicrosoftFAQ/MicrosoftFaqForWindows.qna";
        const dataFileType: string = DataUtility.getDataFileTypeFromFilenameExtension(filename);
        Utility.debuggingLog(`dataFileType=${dataFileType},` +
            `DataUtility.DATA_FORMAT_TYPE_QUESTION_AND_ANSWER=${DataUtility.DATA_FORMAT_TYPE_QUESTION_AND_ANSWER}`);
        assert.ok(dataFileType === DataUtility.DATA_FORMAT_TYPE_QUESTION_AND_ANSWER);
    });
});
