/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { ColumnarContentEmail } from "../../../data/ColumnarData.test";

import { LuContentEmail } from "../../../data/LuData.test";

import { mainCrossValidatorWithColumnarContent } from "../../../../src/model/evaluation/cross_validation/AppCrossValidator";
import { mainCrossValidatorWithLuContent } from "../../../../src/model/evaluation/cross_validation/AppCrossValidator";
import { mainCrossValidator } from "../../../../src/model/evaluation/cross_validation/AppCrossValidator";

import { IDictionaryStringIdGenericArrays } from "../../../../src/data_structure/IDictionaryStringIdGenericArrays";
import { IDictionaryStringIdGenericValue } from "../../../../src/data_structure/IDictionaryStringIdGenericValue";

import { ConfusionMatrix } from "../../../../src/mathematics/confusion_matrix/ConfusionMatrix";

import { CrossValidator } from "../../../../src/model/evaluation/cross_validation/CrossValidator";

import { Utility } from "../../../../src/utility/Utility";

import { UnitTestHelper } from "../../../utility/Utility.test";

describe("Test Suite - model/evaluation/cross_validator/AppCrossValidator", () => {
    it("Test.0000 mainCrossValidatorWithLuContent()", async function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const crossValidator: CrossValidator = await mainCrossValidatorWithLuContent(
            LuContentEmail,
            5,
            10,
            100,
            0.95,
            150,
            32);
    });

    it("Test.0100 mainCrossValidatorWithColumnarContent()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const crossValidator: CrossValidator = mainCrossValidatorWithColumnarContent(
            ColumnarContentEmail,
            0,
            2,
            1,
            5,
            10,
            100,
            0.95,
            150,
            32);
    });

    it("Test.0200 mainCrossValidator()", async function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string =
            "resources/data/Columnar/Email.tsv";
        const outputReportFilenamePrefix: string =
            "resources/data/Columnar/Email_AppCrossValidatorUnitTest_0200";
        process.argv.push("--filename");
        process.argv.push(filename);
        process.argv.push("--outputReportFilenamePrefix");
        process.argv.push(outputReportFilenamePrefix);
        process.argv.push("--labelColumnIndex");
        process.argv.push("0");
        process.argv.push("--textColumnIndex");
        process.argv.push("2");
        process.argv.push("--linesToSkip");
        process.argv.push("1");
        const mainCrossValidatorResult: {
            "evaluationJsonReportResult": {
                "outputEvaluationReportJson": IDictionaryStringIdGenericValue<any>,
                "outputFilenames": string[],
                },
            "evaluationDataArraysReportResult": {
                "outputEvaluationReportDataArrays": IDictionaryStringIdGenericArrays<string>,
                "outputFilenames": string[],
                },
                } = await mainCrossValidator();
        const toCleanUpAfterUnitTest: boolean = UnitTestHelper.getDefaultUnitTestCleanUpFlag();
        if (toCleanUpAfterUnitTest) {
            for (const outputFilename of mainCrossValidatorResult.evaluationJsonReportResult.outputFilenames) {
                Utility.deleteFile(outputFilename);
            }
            for (const outputFilename of mainCrossValidatorResult.evaluationDataArraysReportResult.outputFilenames) {
                Utility.deleteFile(outputFilename);
            }
        }
    });
    it("Test.0201 mainCrossValidator()", async function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string =
            "resources/data/LU/skills/emailskill/en/Email.lu";
        const outputReportFilenamePrefix: string =
            "resources/data/LU/skills/emailskill/en/Email_AppCrossValidatorUnitTest_0201";
        process.argv.push("--filename");
        process.argv.push(filename);
        process.argv.push("--outputReportFilenamePrefix");
        process.argv.push(outputReportFilenamePrefix);
        const mainCrossValidatorResult: {
            "evaluationJsonReportResult": {
                "outputEvaluationReportJson": IDictionaryStringIdGenericValue<any>,
                "outputFilenames": string[],
                },
            "evaluationDataArraysReportResult": {
                "outputEvaluationReportDataArrays": IDictionaryStringIdGenericArrays<string>,
                "outputFilenames": string[],
                },
                } = await mainCrossValidator();
        const toCleanUpAfterUnitTest: boolean = UnitTestHelper.getDefaultUnitTestCleanUpFlag();
        if (toCleanUpAfterUnitTest) {
            for (const outputFilename of mainCrossValidatorResult.evaluationJsonReportResult.outputFilenames) {
                Utility.deleteFile(outputFilename);
            }
            for (const outputFilename of mainCrossValidatorResult.evaluationDataArraysReportResult.outputFilenames) {
                Utility.deleteFile(outputFilename);
            }
        }
    });
});
