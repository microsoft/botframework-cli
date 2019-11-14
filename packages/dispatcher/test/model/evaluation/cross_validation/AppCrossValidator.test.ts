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

import { ConfusionMatrix } from "../../../../src/model/evaluation/confusion_matrix/ConfusionMatrix";

import { Utility } from "../../../../src/utility/Utility";

import { UnitTestHelper } from "../../../utility/Utility.test";

describe("Test Suite - model/evaluation/cross_validator/app_cross_validator", () => {
    it("Test.0000 mainCrossValidatorWithLuContent()", async function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const cvResult: ConfusionMatrix = await mainCrossValidatorWithLuContent(
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
        const cvResult: ConfusionMatrix = mainCrossValidatorWithColumnarContent(
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
        const filename: string = "resources/data/Columnar/Email.tsv";
        process.argv.push("--filename");
        process.argv.push(filename);
        process.argv.push("--labelColumnIndex");
        process.argv.push("0");
        process.argv.push("--textColumnIndex");
        process.argv.push("2");
        process.argv.push("--linesToSkip");
        process.argv.push("1");
        await mainCrossValidator();
    });
    it("Test.0201 mainCrossValidator()", async function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string = "resources/data/LU/skills/emailskill/en/Email.lu";
        process.argv.push("--filename");
        process.argv.push(filename);
        await mainCrossValidator();
    });
});
