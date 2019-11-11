/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { AutoActiveLearner } from "../../../../../src/model/supervised/classifier/auto_active_learning/AutoActiveLearner";

import { AppSoftmaxRegressionSparse } from "../../../../../src/model/supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";
import { SoftmaxRegressionSparse } from "../../../../../src/model/supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { ColumnarContentEmail } from "../../../../data/ColumnarData.test";

import { LuContentEmail } from "../../../../data/LuData.test";

import { exampleFunctionAutoActiveLearnerWithColumnarContent } from "../../../../../src/model/supervised/classifier/auto_active_learning/AppAutoActiveLearner";
import { exampleFunctionAutoActiveLearnerWithLuContent } from "../../../../../src/model/supervised/classifier/auto_active_learning/AppAutoActiveLearner";
import { exampleFunctionAutoActiveLearner } from "../../../../../src/model/supervised/classifier/auto_active_learning/AppAutoActiveLearner";

import { ColumnarData } from "../../../../../src/data/ColumnarData";

import { LuData } from "../../../../../src/data/LuData";

import { Utility } from "../../../../../src/utility/Utility";

import { UnitTestHelper } from "../../../../utility/Utility.test";

describe("Test Suite - model/supervised/classifier/auto_active_learning/app_auto_active_learner", () => {
    it("Test.0000 exampleFunctionAutoActiveLearnerWithLuContent()", async function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const aalResult: {
            "newLuData": LuData,
            "learner": SoftmaxRegressionSparse,
        } = await exampleFunctionAutoActiveLearnerWithLuContent(
            LuContentEmail,
            AutoActiveLearner.defaultDoAutoActiveLearning,
            AutoActiveLearner.defaultAalLimitInitialNumberOfInstancesPerCategory,
            AutoActiveLearner.defaultAalNumberOfInstancesPerIteration,
            AutoActiveLearner.defaultAalInstanceSelectionThreshold,
            AppSoftmaxRegressionSparse.defaultEpochs,
            32);
        // const luData: LuData = aalResult.newLuData;
        // const learner: SoftmaxRegressionSparse = aalResult.learner;
    });

    it("Test.0100 exampleFunctionAutoActiveLearnerWithColumnarContent()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const aalResult: {
            "newColumnarData": ColumnarData,
            "learner": SoftmaxRegressionSparse,
        } = exampleFunctionAutoActiveLearnerWithColumnarContent(
            ColumnarContentEmail,
            0,
            2,
            1,
            AutoActiveLearner.defaultDoAutoActiveLearning,
            AutoActiveLearner.defaultAalLimitInitialNumberOfInstancesPerCategory,
            AutoActiveLearner.defaultAalNumberOfInstancesPerIteration,
            AutoActiveLearner.defaultAalInstanceSelectionThreshold,
            AppSoftmaxRegressionSparse.defaultEpochs,
            32);
        // const luData: LuData = aalResult.newLuData;
        // const learner: SoftmaxRegressionSparse = aalResult.learner;
    });

    it("Test.0200 exampleFunctionAutoActiveLearner()", async function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string = "data/LU/skills/emailskill/en/Email.lu";
        process.argv.push("--filename");
        process.argv.push(filename);
        process.argv.push("--outputModelFilename");
        process.argv.push(filename + ".model.json");
        process.argv.push("--outputFeaturizerFilename");
        process.argv.push(filename + ".featurizer.json");
        process.argv.push("--doAutoActiveLearning");
        process.argv.push(`${AutoActiveLearner.defaultDoAutoActiveLearning}`);
        process.argv.push("--aalLimitInitialNumberOfInstancesPerCategory");
        process.argv.push(`${AutoActiveLearner.defaultAalLimitInitialNumberOfInstancesPerCategory}`);
        process.argv.push("--aalNumberOfInstancesPerIteration");
        process.argv.push(`${AutoActiveLearner.defaultAalNumberOfInstancesPerIteration}`);
        process.argv.push("--aalInstanceSelectionThreshold");
        process.argv.push(`${AutoActiveLearner.defaultAalInstanceSelectionThreshold}`);
        process.argv.push("--learnerParameterEpochs");
        process.argv.push(`${AppSoftmaxRegressionSparse.defaultEpochs}`);
        process.argv.push("--learnerParameterMiniBatchSize");
        process.argv.push(`${32}`);
        await exampleFunctionAutoActiveLearner();
    });
    it("Test.0201 exampleFunctionAutoActiveLearner()", async function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string = "data/Columnar/Email.tsv";
        process.argv.push("--filename");
        process.argv.push(filename);
        process.argv.push("--outputModelFilename");
        process.argv.push(filename + ".model.json");
        process.argv.push("--outputFeaturizerFilename");
        process.argv.push(filename + ".featurizer.json");
        process.argv.push("--doAutoActiveLearning");
        process.argv.push(`${AutoActiveLearner.defaultDoAutoActiveLearning}`);
        process.argv.push("--aalLimitInitialNumberOfInstancesPerCategory");
        process.argv.push(`${AutoActiveLearner.defaultAalLimitInitialNumberOfInstancesPerCategory}`);
        process.argv.push("--aalNumberOfInstancesPerIteration");
        process.argv.push(`${AutoActiveLearner.defaultAalNumberOfInstancesPerIteration}`);
        process.argv.push("--aalInstanceSelectionThreshold");
        process.argv.push(`${AutoActiveLearner.defaultAalInstanceSelectionThreshold}`);
        process.argv.push("--learnerParameterEpochs");
        process.argv.push(`${AppSoftmaxRegressionSparse.defaultEpochs}`);
        process.argv.push("--learnerParameterMiniBatchSize");
        process.argv.push(`${32}`);
        process.argv.push("--labelColumnIndex");
        process.argv.push("0");
        process.argv.push("--textColumnIndex");
        process.argv.push("2");
        process.argv.push("--linesToSkip");
        process.argv.push("1");
        await exampleFunctionAutoActiveLearner();
    });
});
