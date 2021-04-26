/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { DictionaryMapUtility } from "../../../../../src/data_structure/DictionaryMapUtility";

import { TMapStringKeyGenericArray } from "../../../../../src/data_structure/TMapStringKeyGenericArray";
import { TMapStringKeyGenericValue } from "../../../../../src/data_structure/TMapStringKeyGenericValue";

import { AutoActiveLearner } from "../../../../../src/model/supervised/classifier/auto_active_learning/AutoActiveLearner";

import { AppSoftmaxRegressionSparse } from "../../../../../src/model/supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";
import { SoftmaxRegressionSparse } from "../../../../../src/model/supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { ColumnarContentEmail } from "../../../../data/ColumnarDataWithSubwordFeaturizer.test";

import { LuContentEmail } from "../../../../data/LuDataWithSubwordFeaturizer.test";

import { AppAutoActiveLearner } from "../../../../../src/model/supervised/classifier/auto_active_learning/AppAutoActiveLearner";

import { ColumnarDataWithSubwordFeaturizer } from "../../../../../src/data/ColumnarDataWithSubwordFeaturizer";

import { LuDataWithSubwordFeaturizer } from "../../../../../src/data/LuDataWithSubwordFeaturizer";

import { Utility } from "../../../../../src/utility/Utility";

import { UnitTestHelper } from "../../../../utility/Utility.test";

describe("Test Suite - model/supervised/classifier/auto_active_learning/AppAutoActiveLearner", () => {
    it("Test.0000 mainAutoActiveLearnerWithLuContent()", async function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const aalResult: {
            "newLuDataWithSubwordFeaturizer": LuDataWithSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
        } = await AppAutoActiveLearner.mainAutoActiveLearnerWithLuContent(
            LuContentEmail,
            AppAutoActiveLearner.defaultDoBootstrapResampling,
            DictionaryMapUtility.newTMapStringKeyGenericValue(),
            AutoActiveLearner.defaultDoAutoActiveLearning,
            AutoActiveLearner.defaultAalLimitInitialNumberOfInstancesPerCategory,
            AutoActiveLearner.defaultAalNumberOfInstancesPerIteration,
            AutoActiveLearner.defaultAalInstanceSelectionThreshold,
            AppSoftmaxRegressionSparse.defaultEpochs,
            32);
        // const luDataWithSubwordFeaturizer: LuDataWithSubwordFeaturizer = aalResult.newLuDataWithSubwordFeaturizer;
        // const learner: SoftmaxRegressionSparse = aalResult.learner;
    });

    it("Test.0100 mainAutoActiveLearnerWithColumnarContent()", async function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const aalResult: {
            "newColumnarDataWithSubwordFeaturizer": ColumnarDataWithSubwordFeaturizer,
            "learner": SoftmaxRegressionSparse,
        } = await AppAutoActiveLearner.mainAutoActiveLearnerWithColumnarContent(
            ColumnarContentEmail,
            0,
            2,
            1,
            1,
            AppAutoActiveLearner.defaultDoBootstrapResampling,
            DictionaryMapUtility.newTMapStringKeyGenericValue(),
            AutoActiveLearner.defaultDoAutoActiveLearning,
            AutoActiveLearner.defaultAalLimitInitialNumberOfInstancesPerCategory,
            AutoActiveLearner.defaultAalNumberOfInstancesPerIteration,
            AutoActiveLearner.defaultAalInstanceSelectionThreshold,
            AppSoftmaxRegressionSparse.defaultEpochs,
            32);
        // const luDataWithSubwordFeaturizer: LuDataWithSubwordFeaturizer = aalResult.newLuDataWithSubwordFeaturizer;
        // const learner: SoftmaxRegressionSparse = aalResult.learner;
    });

    it("Test.0200 mainAutoActiveLearner()", async function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string =
            "resources/data/LU/skills/emailskill/en/Email.lu";
        const outputReportFilenamePrefix: string =
            "resources/data/LU/skills/emailskill/en/Email_AppAutoActiveLearnerUnitTest_0200";
        process.argv.push("--filename");
        process.argv.push(filename);
        process.argv.push("--outputFilename");
        process.argv.push(outputReportFilenamePrefix);
        process.argv.push("--outputModelFilename");
        process.argv.push(outputReportFilenamePrefix + ".model.json");
        process.argv.push("--outputFeaturizerFilename");
        process.argv.push(outputReportFilenamePrefix + ".featurizer.json");
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
        const outputFilenames: string[] =
            await AppAutoActiveLearner.mainAutoActiveLearner();
        const toCleanUpAfterUnitTest: boolean = UnitTestHelper.getDefaultUnitTestCleanUpFlag();
        if (toCleanUpAfterUnitTest) {
            for (const outputFilename of outputFilenames) {
                Utility.deleteFile(outputFilename);
            }
        }
    });
    it("Test.0201 mainAutoActiveLearner()", async function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const filename: string =
            "resources/data/Columnar/Email.tsv";
        const outputReportFilenamePrefix: string =
            "resources/data/LU/skills/emailskill/en/Email_AppAutoActiveLearnerUnitTest_0201";
        process.argv.push("--filename");
        process.argv.push(filename);
        process.argv.push("--outputFilename");
        process.argv.push(outputReportFilenamePrefix);
        process.argv.push("--outputModelFilename");
        process.argv.push(outputReportFilenamePrefix + ".model.json");
        process.argv.push("--outputFeaturizerFilename");
        process.argv.push(outputReportFilenamePrefix + ".featurizer.json");
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
        process.argv.push("--weightColumnIndex");
        process.argv.push("1");
        process.argv.push("--linesToSkip");
        process.argv.push("1");
        const outputFilenames: string[] =
            await AppAutoActiveLearner.mainAutoActiveLearner();
        const toCleanUpAfterUnitTest: boolean = UnitTestHelper.getDefaultUnitTestCleanUpFlag();
        if (toCleanUpAfterUnitTest) {
            for (const outputFilename of outputFilenames) {
                Utility.deleteFile(outputFilename);
            }
        }
    });
});
