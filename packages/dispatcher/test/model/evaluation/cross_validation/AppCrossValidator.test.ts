/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { ColumnarContentEmail } from "../../../data/ColumnarData.test";
import { LuContentEmail } from "../../../data/LuData.test";

import { exampleFunctionCrossValidatorWithLuContent } from "../../../../src/model/evaluation/cross_validation/AppCrossValidator";
import { exampleFunctionCrossValidatorWithColumnarContent } from "../../../../src/model/evaluation/cross_validation/AppCrossValidator";
import { exampleFunctionCrossValidator } from "../../../../src/model/evaluation/cross_validation/AppCrossValidator";

import { ConfusionMatrix } from "../../../../src/model/evaluation/confusion_matrix/ConfusionMatrix";

import { Utility } from "../../../../src/utility/Utility";

describe("Test Suite - model/evaluation/cross_validator/app_cross_validator", () => {
    it("Test.0000 exampleFunctionCrossValidatorWithLuContent()", async function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const cvResult: ConfusionMatrix = await exampleFunctionCrossValidatorWithLuContent(
            LuContentEmail,
            5,
            10,
            100,
            0.95,
            150,
            32);
    });

    it("Test.0100 exampleFunctionCrossValidatorWithColumnarContent()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const cvResult: ConfusionMatrix = exampleFunctionCrossValidatorWithColumnarContent(
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

    it("Test.0200 exampleFunctionCrossValidator()", async function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const filename: string = "data/Columnar/Email.tsv";
        process.argv.push("--filename");
        process.argv.push(filename);
        process.argv.push("--labelColumnIndex");
        process.argv.push("0");
        process.argv.push("--textColumnIndex");
        process.argv.push("2");
        process.argv.push("--linesToSkip");
        process.argv.push("1");
        await exampleFunctionCrossValidator();
    });
    it("Test.0201 exampleFunctionCrossValidator()", async function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const filename: string = "data/LU/skills/emailskill/en/Email.lu";
        process.argv.push("--filename");
        process.argv.push(filename);
        await exampleFunctionCrossValidator();
    });
});
