@microsoft/bf-dispatcher
========================

The bf-dispatcher package/library contains a Softmax Regression (MaxEnt) learner initially designed and used for auto-active-learning down-sampling. It also has a Machine Learning cross validation evaluator for evaluating intent classification models.

The package can consume two forms of input sources: LU and TSV columnar files. It uses the bf-lu package (https://github.com/microsoft/botframework-cli/tree/master/packages/lu) to parse a .lu file.

In "src/model/supervised/classifier/auto_active_learning/AppAutoActiveLearner.ts", there are example functions demonstrating how to use bf-dispatcher to consume a LU or TSV file, iterate through batches of input utterance/label records, and train models to select most relevant utterance/intent pairs through an auto active learning process.

```
export function exampleFunctionAutoActiveLearnerWithColumnarContent(
    columnarContent: string,
    labelColumnIndex: number,
    textColumnIndex: number,
    linesToSkip: number,
    doAutoActiveLearning: boolean =
        AutoActiveLearner.defaultDoAutoActiveLearning,
    aalLimitInitialNumberOfInstancesPerCategory: number =
        AutoActiveLearner.defaultAalLimitInitialNumberOfInstancesPerCategory,
    aalNumberOfInstancesPerIteration: number =
        AutoActiveLearner.defaultAalNumberOfInstancesPerIteration,
    aalInstanceSelectionThreshold: number =
        AutoActiveLearner.defaultAalInstanceSelectionThreshold,
    learnerParameterEpochs: number =
        AppSoftmaxRegressionSparse.defaultEpochs,
    learnerParameterMiniBatchSize: number =
        AppSoftmaxRegressionSparse.defaultMiniBatchSize,
    learnerParameterL1Regularization: number =
        AppSoftmaxRegressionSparse.defaultL1Regularization,
    learnerParameterL2Regularization: number =
        AppSoftmaxRegressionSparse.defaultL2Regularization,
    learnerParameterLossEarlyStopRatio: number =
        AppSoftmaxRegressionSparse.defaultLossEarlyStopRatio,
    learnerParameterLearningRate: number =
        AppSoftmaxRegressionSparse.defaultLearningRate,
    learnerParameterToCalculateOverallLossAfterEpoch: boolean =
        true): {
        "newColumnarData": ColumnarData,
        "learner": SoftmaxRegressionSparse,
        } {
    // -----------------------------------------------------------------------
    const columnarData: ColumnarData =
        ColumnarData.createColumnarData(
            columnarContent,
            new NgramSubwordFeaturizer(),
            labelColumnIndex,
            textColumnIndex,
            linesToSkip);
    // -----------------------------------------------------------------------
    const results =
        columnarData.collectSmallUtteranceIndexSetCoveringAllIntentEntityLabels();
    const smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
        results.smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels;
    const smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
        results.smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels;
    const smallUtteranceIndexSetCoveringAllIntentEntityLabels: Set<number> =
        results.smallUtteranceIndexSetCoveringAllIntentEntityLabels;
    const remainingUtteranceIndexSet: Set<number> =
        results.remainingUtteranceIndexSet;
    Utility.debuggingLog(`smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
        `${Utility.stringMapSetToJson(smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels)}`);
    Utility.debuggingLog(`smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels=` +
        `${Utility.stringMapSetToJson(smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels)}`);
    Utility.debuggingLog(`smallUtteranceIndexSetCoveringAllIntentEntityLabels=` +
        `${Utility.setToJsonSerialization(smallUtteranceIndexSetCoveringAllIntentEntityLabels)}`);
    Utility.debuggingLog(`remainingUtteranceIndexSet=` +
        `${Utility.setToJsonSerialization(remainingUtteranceIndexSet)}`);
    Utility.debuggingLog(`smallUtteranceIndexSetCoveringAllIntentEntityLabels.size=` +
        `${smallUtteranceIndexSetCoveringAllIntentEntityLabels.size}`);
    Utility.debuggingLog(`remainingUtteranceIndexSet.size=` +
        `${remainingUtteranceIndexSet.size}`);
    // -------------------------------------------------------------------
    if (!doAutoActiveLearning) {
        aalLimitInitialNumberOfInstancesPerCategory = -1;
    }
    const resultsInitialSampling =
        columnarData.collectUtteranceIndexSetSeedingIntentTrainingSet(
            smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels,
            remainingUtteranceIndexSet,
            aalLimitInitialNumberOfInstancesPerCategory);
    const seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
        resultsInitialSampling.seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels;
    const candidateUtteranceIndexSetSampled: Set<number> =
        resultsInitialSampling.candidateUtteranceIndexSetSampled;
    const candidateUtteranceIndexSetRemaining: Set<number> =
        resultsInitialSampling.candidateUtteranceIndexSetRemaining;
    Utility.debuggingLog(`seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
        `${Utility.stringMapSetToJson(seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels)}`);
    Utility.debuggingLog(`candidateUtteranceIndexSetSampled=` +
        `${Utility.setToJsonSerialization(candidateUtteranceIndexSetSampled)}`);
    Utility.debuggingLog(`candidateUtteranceIndexSetRemaining=` +
        `${Utility.setToJsonSerialization(candidateUtteranceIndexSetRemaining)}`);
    Utility.debuggingLog(`candidateUtteranceIndexSetSampled.size=` +
        `${candidateUtteranceIndexSetSampled.size}`);
    Utility.debuggingLog(`candidateUtteranceIndexSetRemaining.size=` +
        `${candidateUtteranceIndexSetRemaining.size}`);
    const countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: number =
        [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
            (accumulation: number, entry: [string, Set<number>]) => accumulation + entry[1].size, 0);
    Utility.debuggingLog(`countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
        `${countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels}`);
    // -------------------------------------------------------------------
    const seedingUtteranceIndexArray: number[] =
        [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
            (accumulation: number[], entry: [string, Set<number>]) => accumulation.concat(Array.from(entry[1])), []);
    Utility.debuggingLog(`seedingUtteranceIndexArray.length=` +
        `${seedingUtteranceIndexArray.length}`);
    // -------------------------------------------------------------------
    const intentLabelIndexArray: number[] =
        columnarData.getIntentLabelIndexArray();
    const utteranceFeatureIndexArrays: number[][] =
        columnarData.getUtteranceFeatureIndexArrays();
    const autoActiveLearner: AutoActiveLearner =
        new AutoActiveLearner(
            doAutoActiveLearning,
            aalLimitInitialNumberOfInstancesPerCategory,
            aalNumberOfInstancesPerIteration,
            aalInstanceSelectionThreshold,
            learnerParameterEpochs,
            learnerParameterMiniBatchSize,
            learnerParameterL1Regularization,
            learnerParameterL2Regularization,
            learnerParameterLossEarlyStopRatio,
            learnerParameterLearningRate,
            learnerParameterToCalculateOverallLossAfterEpoch);
    const learned: {
        "seedingInstanceIndexArray": number[],
        "learner": SoftmaxRegressionSparse,
        } = autoActiveLearner.learn(
        columnarData.getFeaturizerLabels(),
        columnarData.getFeaturizerLabelMap(),
        columnarData.getFeaturizer().getNumberLabels(),
        columnarData.getFeaturizer().getNumberFeatures(),
        intentLabelIndexArray,
        utteranceFeatureIndexArrays,
        seedingUtteranceIndexArray,
        Array.from(candidateUtteranceIndexSetRemaining));
    const aalSampledInstanceIndexArray: number[] =
        learned.seedingInstanceIndexArray;
    const learner: SoftmaxRegressionSparse =
        learned.learner;
    const newColumnarData: ColumnarData =  ColumnarData.createColumnarDataFromFilteringExistingColumnarDataUtterances(
        columnarData,
        labelColumnIndex,
        textColumnIndex,
        linesToSkip,
        new Set<number>(aalSampledInstanceIndexArray));
    return { newColumnarData, learner };
    // -----------------------------------------------------------------------
}
```

In "src/model/evaluation/cross_validation/AppCrossValidator.ts", there are example functions demonstrating how to use bf-dispatcher to run a Cross Validation process to evaluate model performance.

```
export function exampleFunctionCrossValidatorWithColumnarContent(
    columnarContent: string,
    labelColumnIndex: number,
    textColumnIndex: number,
    linesToSkip: number,
    numberOfCrossValidationFolds: number =
        CrossValidator.defaultNumberOfCrossValidationFolds,
    learnerParameterEpochs: number =
        AppSoftmaxRegressionSparse.defaultEpochs,
    learnerParameterMiniBatchSize: number =
        AppSoftmaxRegressionSparse.defaultMiniBatchSize,
    learnerParameterL1Regularization: number =
        AppSoftmaxRegressionSparse.defaultL1Regularization,
    learnerParameterL2Regularization: number =
        AppSoftmaxRegressionSparse.defaultL2Regularization,
    learnerParameterLossEarlyStopRatio: number =
        AppSoftmaxRegressionSparse.defaultLossEarlyStopRatio,
    learnerParameterLearningRate: number =
        AppSoftmaxRegressionSparse.defaultLearningRate,
    learnerParameterToCalculateOverallLossAfterEpoch: boolean =
        true): ConfusionMatrix {
    // -----------------------------------------------------------------------
    const columnarData: ColumnarData =
        ColumnarData.createColumnarData(
            columnarContent,
            new NgramSubwordFeaturizer(),
            labelColumnIndex,
            textColumnIndex,
            linesToSkip);
    // -----------------------------------------------------------------------
    // const results =
    //     columnarData.collectSmallUtteranceIndexSetCoveringAllIntentEntityLabels();
    // const smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
    //     results.smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels;
    // const smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
    //     results.smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels;
    // const smallUtteranceIndexSetCoveringAllIntentEntityLabels: Set<number> =
    //     results.smallUtteranceIndexSetCoveringAllIntentEntityLabels;
    // const remainingUtteranceIndexSet: Set<number> =
    //     results.remainingUtteranceIndexSet;
    // Utility.debuggingLog(`smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
    //     `${Utility.stringMapSetToJson(smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels)}`);
    // Utility.debuggingLog(`smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels=` +
    //     `${Utility.stringMapSetToJson(smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels)}`);
    // Utility.debuggingLog(`smallUtteranceIndexSetCoveringAllIntentEntityLabels=` +
    //     `${Utility.setToJson(smallUtteranceIndexSetCoveringAllIntentEntityLabels)}`);
    // Utility.debuggingLog(`remainingUtteranceIndexSet=` +
    //     `${Utility.setToJson(remainingUtteranceIndexSet)}`);
    // Utility.debuggingLog(`smallUtteranceIndexSetCoveringAllIntentEntityLabels.size=` +
    //     `${smallUtteranceIndexSetCoveringAllIntentEntityLabels.size}`);
    // Utility.debuggingLog(`remainingUtteranceIndexSet.size=` +
    //     `${remainingUtteranceIndexSet.size}`);
    // -------------------------------------------------------------------
    if (!numberOfCrossValidationFolds) {
        numberOfCrossValidationFolds = CrossValidator.defaultNumberOfCrossValidationFolds;
    }
    // const resultsInitialSampling =
    //     columnarData.collectUtteranceIndexSetSeedingIntentTrainingSet(
    //         smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels,
    //         remainingUtteranceIndexSet,
    //         numberOfCrossValidationFolds);
    // const seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
    //     resultsInitialSampling.seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels;
    // const candidateUtteranceIndexSetSampled: Set<number> =
    //     resultsInitialSampling.candidateUtteranceIndexSetSampled;
    // const candidateUtteranceIndexSetRemaining: Set<number> =
    //     resultsInitialSampling.candidateUtteranceIndexSetRemaining;
    // Utility.debuggingLog(`seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
    //     `${Utility.stringMapSetToJson(seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels)}`);
    // Utility.debuggingLog(`candidateUtteranceIndexSetSampled=` +
    //     `${Utility.setToJson(candidateUtteranceIndexSetSampled)}`);
    // Utility.debuggingLog(`candidateUtteranceIndexSetRemaining=` +
    //     `${Utility.setToJson(candidateUtteranceIndexSetRemaining)}`);
    // Utility.debuggingLog(`candidateUtteranceIndexSetSampled.size=` +
    //     `${candidateUtteranceIndexSetSampled.size}`);
    // Utility.debuggingLog(`candidateUtteranceIndexSetRemaining.size=` +
    //     `${candidateUtteranceIndexSetRemaining.size}`);
    // const countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: number =
    //     [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
    //         (accumulation: number, entry: [string, Set<number>]) => accumulation + entry[1].size, 0);
    // Utility.debuggingLog(`countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
    //     `${countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels}`);
    // -------------------------------------------------------------------
    // const seedingUtteranceIndexArray: number[] =
    //     [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
    //         (accumulation: number[], entry: [string, Set<number>]) => accumulation.concat(Array.from(entry[1])), []);
    // Utility.debuggingLog(`seedingUtteranceIndexArray.length=` +
    //     `${seedingUtteranceIndexArray.length}`);
    // -------------------------------------------------------------------
    const intentLabelIndexArray: number[] =
        columnarData.getIntentLabelIndexArray();
    const utteranceFeatureIndexArrays: number[][] =
        columnarData.getUtteranceFeatureIndexArrays();
    assert(intentLabelIndexArray, "intentLabelIndexArray is undefined.");
    assert(utteranceFeatureIndexArrays, "utteranceFeatureIndexArrays is undefined.");
    const crossValidator: CrossValidator =
        new CrossValidator(
            numberOfCrossValidationFolds,
            learnerParameterEpochs,
            learnerParameterMiniBatchSize,
            learnerParameterL1Regularization,
            learnerParameterL2Regularization,
            learnerParameterLossEarlyStopRatio,
            learnerParameterLearningRate,
            learnerParameterToCalculateOverallLossAfterEpoch);
    const confusionMatrixCrossValidation: ConfusionMatrix =
        crossValidator.crossValidate(
            columnarData.getFeaturizerLabels(),
            columnarData.getFeaturizerLabelMap(),
            columnarData.getFeaturizer().getNumberLabels(),
            columnarData.getFeaturizer().getNumberFeatures(),
            intentLabelIndexArray,
            utteranceFeatureIndexArrays,
            columnarData.getIntentInstanceIndexMapArray());
    Utility.debuggingLog(
        `confusionMatrixCrossValidation.getMicroAverageMetrics()=` +
        `${confusionMatrixCrossValidation.getMicroAverageMetrics()}` +
        `,confusionMatrixCrossValidation.getMacroAverageMetrics()=` +
        `${confusionMatrixCrossValidation.getMacroAverageMetrics()}` +
        `,confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()=` +
        `${confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()}`);
    return confusionMatrixCrossValidation;
    // -----------------------------------------------------------------------
}
```

<!-- ==== NOTE ==== PLACE-HOLDER-BEGIN ====
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-dispatcher.svg)](https://npmjs.org/package/@microsoft/bf-dispatcher)
[![Downloads/week](https://img.shields.io/npm/dw/@microsoft/bf-dispatcher.svg)](https://npmjs.org/package/@microsoft/bf-dispatcher)
[![License](https://img.shields.io/npm/l/@microsoft/bf-dispatcher.svg)](https://github.com/microsoft/botframework-cli/blob/master/package.json)
     ==== NOTE ====  PLACE-HOLDER-END  ==== -->

<!-- toc -->
<!-- ==== NOTE ==== PLACE-HOLDER-BEGIN ====
* [Usage](#usage)
* [Commands](#commands)
     ==== NOTE ====  PLACE-HOLDER-END  ==== -->
<!-- tocstop -->
<!-- ==== NOTE ==== PLACE-HOLDER-BEGIN ====
# Usage
     ==== NOTE ====  PLACE-HOLDER-END  ==== -->
<!-- usage -->
<!-- ==== NOTE ==== PLACE-HOLDER-BEGIN ====
```sh-session
$ npm install -g @microsoft/bf-dispatcher
$ oclif-example COMMAND
running command...
$ oclif-example (-v|--version|version)
@microsoft/bf-dispatcher/1.0.0 win32-x64 node-v10.16.3
$ oclif-example --help [COMMAND]
USAGE
  $ oclif-example COMMAND
...
```
     ==== NOTE ====  PLACE-HOLDER-END  ==== -->
<!-- usagestop -->
<!-- ==== NOTE ==== PLACE-HOLDER-BEGIN ====
# Commands
     ==== NOTE ====  PLACE-HOLDER-END  ==== -->
<!-- commands -->
<!-- ==== NOTE ==== PLACE-HOLDER-BEGIN ====
* [`oclif-example hello [FILE]`](#oclif-example-hello-file)

## `oclif-example hello [FILE]`

describe the command here

```
USAGE
  $ oclif-example hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ oclif-example hello
  hello world from ./src/hello.ts!
```

_See code: [src\commands\hello.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\hello.ts)_
     ==== NOTE ====  PLACE-HOLDER-END  ==== -->
<!-- commandsstop -->
