/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { DataUtility } from "../../src/data/DataUtility";
import { DataWithSubwordFeaturizerUtility } from "../../src/data/DataWithSubwordFeaturizerUtility";

import { Utility } from "../../src/utility/Utility";

import { UnitTestHelper } from "../utility/Utility.test";
import { NgramSubwordFeaturizer } from "../../src/model/language_understanding/featurizer/NgramSubwordFeaturizer";

describe("Test Suite - data/DataWithSubwordFeaturizerUtility", () => {
    it("Test.0000 getDataFileTypeFromFilenameExtension", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string = "resources/data/LU/skills/emailskill/en/Email.lu";
        const dataFileType: string = DataWithSubwordFeaturizerUtility.getDataFileTypeFromFilenameExtension(filename);
        Utility.debuggingLog(`dataFileType=${dataFileType},` +
            `DataUtility.DATA_FORMAT_TYPE_LU=${DataUtility.DATA_FORMAT_TYPE_LU}`);
        assert.ok(dataFileType === DataWithSubwordFeaturizerUtility.DATA_FORMAT_TYPE_LU);
    });
    it("Test.0001 getDataFileTypeFromFilenameExtension", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string = "resources/data/Columnar/Email.tsv";
        const dataFileType: string = DataWithSubwordFeaturizerUtility.getDataFileTypeFromFilenameExtension(filename);
        Utility.debuggingLog(`dataFileType=${dataFileType},` +
            `DataUtility.DATA_FORMAT_TYPE_TAB_DELIMITED=${DataUtility.DATA_FORMAT_TYPE_TAB_DELIMITED}`);
        assert.ok(dataFileType === DataUtility.DATA_FORMAT_TYPE_TAB_DELIMITED);
    });
    it("Test.0002 getDataFileTypeFromFilenameExtension", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string = "resources/data/EntityAnnotatedCorpus/ner_dataset.eac";
        const dataFileType: string = DataWithSubwordFeaturizerUtility.getDataFileTypeFromFilenameExtension(filename);
        Utility.debuggingLog(`dataFileType=${dataFileType},` +
            `DataUtility.DATA_FORMAT_TYPE_ENTITY_ANNOTATED_CORPUS=${DataUtility.DATA_FORMAT_TYPE_ENTITY_ANNOTATED_CORPUS}`);
        assert.ok(dataFileType === DataUtility.DATA_FORMAT_TYPE_ENTITY_ANNOTATED_CORPUS);
    });
    it("Test.0003 getDataFileTypeFromFilenameExtension", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string = "resources/data/LU/MicrosoftFAQ/MicrosoftFaqForWindows.qna";
        const dataFileType: string = DataWithSubwordFeaturizerUtility.getDataFileTypeFromFilenameExtension(filename);
        Utility.debuggingLog(`dataFileType=${dataFileType},` +
            `DataUtility.DATA_FORMAT_TYPE_QUESTION_AND_ANSWER=${DataUtility.DATA_FORMAT_TYPE_QUESTION_AND_ANSWER}`);
        assert.ok(dataFileType === DataUtility.DATA_FORMAT_TYPE_QUESTION_AND_ANSWER);
    });

    it("Test.0100 LoadDataWithSubwordFeaturizer", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string = "resources/data/LU/skills/emailskill/en/Email.lu";
        DataWithSubwordFeaturizerUtility.LoadDataWithSubwordFeaturizer(filename).then(
            (luDataWithSubwordFeaturizer) => {
                const numberFeaturizerLabels: number = luDataWithSubwordFeaturizer.getFeaturizerLabels().length;
                Utility.debuggingLog(`numberFeaturizerLabels=${numberFeaturizerLabels},` +
                    `luDataWithSubwordFeaturizer.getFeaturizerLabels()=${luDataWithSubwordFeaturizer.getFeaturizerLabels()}`);
                assert.ok(numberFeaturizerLabels === 15);
            });
    });

    it("Test.0101 LoadDataWithSubwordFeaturizer", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string = "resources/data/LU/MicrosoftFAQ/MicrosoftFaqForWindows.qna";
        DataWithSubwordFeaturizerUtility.LoadDataWithSubwordFeaturizer(filename).then(
            (luDataWithSubwordFeaturizer) => {
                const luDataWithSubwordFeaturizerContent: string = luDataWithSubwordFeaturizer.getContent();
                // Utility.debuggingLog(
                //     `luDataWithSubwordFeaturizerContent-MicrosoftFaqForWindows=` +
                //     `${luDataWithSubwordFeaturizerContent}`);
                const luQnaJsonStructure: string =
                    luDataWithSubwordFeaturizer.getLuQnaJsonStructure();
                Utility.debuggingLog(
                    `luQnaJsonStructure-MicrosoftFaqForWindows=${Utility.jsonStringify(luQnaJsonStructure)}`);
            });
    });
    it("Test.0102 LoadDataWithSubwordFeaturizer", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string = "resources/data/LU/MicrosoftFAQ/MicrosoftFaqForOffice.qna";
        DataWithSubwordFeaturizerUtility.LoadDataWithSubwordFeaturizer(filename).then(
            (luDataWithSubwordFeaturizer) => {
                const luDataWithSubwordFeaturizerContent: string = luDataWithSubwordFeaturizer.getContent();
                // Utility.debuggingLog(
                //     `luDataWithSubwordFeaturizerContent-MicrosoftFaqForOffice=` +
                //     `${luDataWithSubwordFeaturizerContent}`);
                const luQnaJsonStructure: string =
                    luDataWithSubwordFeaturizer.getLuQnaJsonStructure();
                Utility.debuggingLog(
                    `luQnaJsonStructure-MicrosoftFaqForOffice=${Utility.jsonStringify(luQnaJsonStructure)}`);
            });
    });
});
