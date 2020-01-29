@microsoft/bf-dispatcher
========================

'bf-dispatcher' is a generic NLP intent classification package/library.
It currently can do:

> Sampling
    > Bootstrap resampling
    > Auto active learning down sampling
    > Stratified down sampling

> Evaluation and Reporting
    > Cross Validation against a training set
    > Test again a test set

To support these features, it internally contains a Softmax Regression (MaxEnt) learner that can consume sparse text features and train models to support auto-active-learning down-sampling and cross validation. It can also produce model quality reports.

Currently, 'bf-dispatcher' can consume two forms of input sources: LU and TSV columnar files. It uses the bf-lu package (https://github.com/microsoft/botframework-cli/tree/master/packages/lu) to parse and load a .lu file as input.

To demonstrate the auto active learning process, there are some example functions implemented in
"src/model/supervised/classifier/auto_active_learning/AppAutoActiveLearner.ts" that can do the following:
    a) consume a LU or columnar TSV file,
    b) use a bootstrap resampler to select training instances based on a prior label/instance (intent/utterance)
       distribition,
    c) iterate through batches of input utterance/label records, and train models to select most relevant utterance/intent
       pairs through an auto active learning process, and
    d) use a stratifier sampler to limit the training size.

Below are some examples of using the AutoActiveLearner class.
```
    /**
     * This function can read a LU file with intent and utterance data and run through 3 steps of
     * sampling processes:
     * 0) Bootstrap Resampling
     * 1) Auto Active Learning Sampling
     * 2) Stratified Sampling
     *
     * @param luContent - a .lu file content in string form as input.
     * @param doBootstrapResampling - boolean flag to activate bootstrap resampling (BRS) logic or not.
     * @param brsDistribution - explicit distribution to control bootstrap resampling process
     * @param doAutoActiveLearning - boolean flag to activate auto active leaning (AAL) process or not.
     * @param aalLimitInitialNumberOfInstancesPerCategory - AAL initial number of instances per category/label/intent.
     * @param aalNumberOfInstancesPerIteration - AAL number of instances processed per iterations.
     * @param aalInstanceSelectionThreshold - AAL threshold to pick a tested instance for training in next iteration
     * @param learnerParameterEpochs - AAL Softmax Regression learner parameter - number of epochs.
     * @param learnerParameterMiniBatchSize - AAL Softmax Regression learner parameter - mini-batch size.
     * @param learnerParameterL1Regularization - AAL Softmax Regression learner parameter - L1 regularization.
     * @param learnerParameterL2Regularization - AAL Softmax Regression learner parameter - L2 regularization.
     * @param learnerParameterLossEarlyStopRatio - AAL Softmax Regression learner parameter - early stop ratio.
     * @param learnerParameterLearningRate - AAL Softmax Regression learner parameter - learning rate.
     * @param learnerParameterToCalculateOverallLossAfterEpoch - AAL Softmax Regression learner parameter - flag
     * @param limitingSampleSize - sample size controled by a final stratified sampling process.
     */
    public static async mainAutoActiveLearnerWithLuContent(
        luContent: string,
        doBootstrapResampling: boolean =
            AppAutoActiveLearner.defaultDoBootstrapResampling,
        brsDistribution: TMapStringKeyGenericValue<number> =
            DictionaryMapUtility.newTMapStringKeyGenericValue<number>(),
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
            true,
        limitingSampleSize: number =
            DefaultLimitingSampleSize): Promise<{
            "newLuData": LuData,
            "learner": SoftmaxRegressionSparse,
            "seedingInstanceIndexArray": number[],
            "seedingInstanceIndexArrayInitial": number[],
            }> {
        // -----------------------------------------------------------------------
        let luData: LuData =
            await LuData.createLuData(
                luContent,
                new NgramSubwordFeaturizer(),
                true);
        // -----------------------------------------------------------------------
        if (doBootstrapResampling) {
            const bootstrapSamplerKeyMap: BootstrapSamplerKeyMapDistribution<number> =
                new BootstrapSamplerKeyMapDistribution<number>(
                    brsDistribution,
                    luData.getIntentInstanceIndexMapArray());
            // ---- NOTE-FOR-REFERENCE ---- const bootstrapSamplerKeyMap: BootstrapSamplerKeyMap<number> =
            // ---- NOTE-FOR-REFERENCE ----     new BootstrapSamplerKeyMap(data.getIntentInstanceIndexMapArray());
            Utility.debuggingLog(`luData.getIntentInstanceIndexMapArray()=` +
                `${Utility.mapToJsonSerialization(luData.getIntentInstanceIndexMapArray())}`);
            Utility.debuggingLog(`bootstrapSamplerKeyMap.computeSamplingNumberInstancesPerLabel()=` +
                `${bootstrapSamplerKeyMap.computeSamplingNumberInstancesPerLabel()}`);
            // ---- NOTE-FOR-DEBUGGING ---- const samplingIndexArrayGenerator =
            // ---- NOTE-FOR-DEBUGGING ----     bootstrapSamplerKeyMap.sampleInstances();
            // ---- NOTE-FOR-DEBUGGING ---- for (const element of samplingIndexArrayGenerator) {
            // ---- NOTE-FOR-DEBUGGING ----     Utility.debuggingLog(`element of samplingIndexArrayGenerator=` +
            // ---- NOTE-FOR-DEBUGGING ----         `${element}`);
            // ---- NOTE-FOR-DEBUGGING ---- }
            const samplingIndexArray: number[] =
                [...bootstrapSamplerKeyMap.sampleInstances()];
            Utility.debuggingLog(`samplingIndexArray.length=` +
                `${samplingIndexArray.length}`);
            const luDataBootstrapSampled: Data =
                await luData.createDataFromSamplingExistingDataUtterances(
                    luData,
                    -1, // ---- NOTE-NO-NEED-FOR-LuData ---- labelColumnIndex,
                    -1, // ---- NOTE-NO-NEED-FOR-LuData ---- textColumnIndex,
                    -1, // ---- NOTE-NO-NEED-FOR-LuData ---- linesToSkip,
                    samplingIndexArray,
                    false);
            luData = luDataBootstrapSampled as LuData;
        }
        // -----------------------------------------------------------------------
        const results =
            luData.collectSmallUtteranceIndexSetCoveringAllIntentEntityLabels();
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
        const resultsInitialSampling: {
            "seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels": Map<string, Set<number>>,
            "candidateUtteranceIndexSetSampled": Set<number>,
            "candidateUtteranceIndexSetRemaining": Set<number>,
            } = luData.collectUtteranceIndexSetSeedingIntentTrainingSet(
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
                (accumulation: number, entry: [string, Set<number>]) =>
                accumulation + entry[1].size, 0);
        Utility.debuggingLog(`countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
            `${countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels}`);
        // -------------------------------------------------------------------
        const seedingUtteranceIndexArray: number[] =
            [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
                (accumulation: number[], entry: [string, Set<number>]) =>
                accumulation.concat(Array.from(entry[1])), []);
        Utility.debuggingLog(`seedingUtteranceIndexArray.length=` +
            `${seedingUtteranceIndexArray.length}`);
        // -------------------------------------------------------------------
        const seedingInstanceIndexArray: number[] =
            Utility.cloneArray(seedingUtteranceIndexArray);
        const intentLabelIndexArray: number[] =
            luData.getIntentLabelIndexArray();
        const utteranceFeatureIndexArrays: number[][] =
            luData.getUtteranceFeatureIndexArrays();
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
                luData.getFeaturizerLabels(),
                luData.getFeaturizerLabelMap(),
                luData.getFeaturizer().getNumberLabels(),
                luData.getFeaturizer().getNumberFeatures(),
                intentLabelIndexArray,
                utteranceFeatureIndexArrays,
                seedingInstanceIndexArray,
                Array.from(candidateUtteranceIndexSetRemaining));
        let aalSampledInstanceIndexArray: number[] =
            learned.seedingInstanceIndexArray;
        const learner: SoftmaxRegressionSparse =
            learned.learner;
        // -----------------------------------------------------------------------
        const numberInstancesPreSelected: number =
            seedingUtteranceIndexArray.length;
        if (limitingSampleSize > numberInstancesPreSelected) {
            limitingSampleSize -= numberInstancesPreSelected;
            const reservoirArraySampler: ReservoirArraySampler<number> = new ReservoirArraySampler(
                aalSampledInstanceIndexArray,
                numberInstancesPreSelected);
            aalSampledInstanceIndexArray =
                [...reservoirArraySampler.sampleInstances(limitingSampleSize)];
        }
        // -----------------------------------------------------------------------
        const newLuData: LuData = await LuData.createLuDataFromFilteringExistingLuDataUtterances(
            luData,
            new Set<number>(aalSampledInstanceIndexArray),
            false);
        return {
            newLuData,
            learner,
            seedingInstanceIndexArray: aalSampledInstanceIndexArray,
            seedingInstanceIndexArrayInitial: seedingUtteranceIndexArray };
        // -----------------------------------------------------------------------
    }

    /**
     * This function can read a TSV columnar file with label and text data and run through 3 steps of
     * sampling processes:
     * 0) Bootstrap Resampling
     * 1) Auto Active Learning Sampling
     * 2) Stratified Sampling
     *
     * @param columnarContent - content of a TSV columnar file in string form as input.
     * @param labelColumnIndex - label/intent column index.
     * @param textColumnIndex - text/utterace column index.
     * @param linesToSkip - number of header lines skipped before processing each line as an instance record.
     * @param doBootstrapResampling - boolean flag to activate bootstrap resampling (BRS) logic or not.
     * @param brsDistribution - explicit distribution to control bootstrap resampling process
     * @param doAutoActiveLearning - boolean flag to activate auto active leaning (AAL) process or not.
     * @param aalLimitInitialNumberOfInstancesPerCategory - AAL initial number of instances per category/label/intent.
     * @param aalNumberOfInstancesPerIteration - AAL number of instances processed per iterations.
     * @param aalInstanceSelectionThreshold - AAL threshold to pick a tested instance for training in next iteration
     * @param learnerParameterEpochs - AAL Softmax Regression learner parameter - number of epochs.
     * @param learnerParameterMiniBatchSize - AAL Softmax Regression learner parameter - mini-batch size.
     * @param learnerParameterL1Regularization - AAL Softmax Regression learner parameter - L1 regularization.
     * @param learnerParameterL2Regularization - AAL Softmax Regression learner parameter - L2 regularization.
     * @param learnerParameterLossEarlyStopRatio - AAL Softmax Regression learner parameter - early stop ratio.
     * @param learnerParameterLearningRate - AAL Softmax Regression learner parameter - learning rate.
     * @param learnerParameterToCalculateOverallLossAfterEpoch - AAL Softmax Regression learner parameter - flag
     * @param limitingSampleSize - sample size controled by a final stratified sampling process.
     */
    public static async mainAutoActiveLearnerWithColumnarContent(
        columnarContent: string,
        labelColumnIndex: number,
        textColumnIndex: number,
        linesToSkip: number,
        doBootstrapResampling: boolean =
            AppAutoActiveLearner.defaultDoBootstrapResampling,
        brsDistribution: TMapStringKeyGenericValue<number> =
            DictionaryMapUtility.newTMapStringKeyGenericValue<number>(),
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
            true,
        limitingSampleSize: number =
            DefaultLimitingSampleSize): Promise<{
            "newColumnarData": ColumnarData,
            "learner": SoftmaxRegressionSparse,
            "seedingInstanceIndexArray": number[],
            "seedingInstanceIndexArrayInitial": number[],
            }> {
        // -----------------------------------------------------------------------
        let columnarData: ColumnarData =
            ColumnarData.createColumnarData(
                columnarContent,
                new NgramSubwordFeaturizer(),
                labelColumnIndex,
                textColumnIndex,
                linesToSkip,
                true);
        // -----------------------------------------------------------------------
        if (doBootstrapResampling) {
            const bootstrapSamplerKeyMap: BootstrapSamplerKeyMapDistribution<number> =
                new BootstrapSamplerKeyMapDistribution<number>(
                    brsDistribution,
                    columnarData.getIntentInstanceIndexMapArray());
            // ---- NOTE-FOR-REFERENCE ---- const bootstrapSamplerKeyMap: BootstrapSamplerKeyMap<number> =
            // ---- NOTE-FOR-REFERENCE ----     new BootstrapSamplerKeyMap(data.getIntentInstanceIndexMapArray());
            Utility.debuggingLog(`columnarData.getIntentInstanceIndexMapArray()=` +
                `${Utility.mapToJsonSerialization(columnarData.getIntentInstanceIndexMapArray())}`);
            Utility.debuggingLog(`bootstrapSamplerKeyMap.computeSamplingNumberInstancesPerLabel()=` +
                `${bootstrapSamplerKeyMap.computeSamplingNumberInstancesPerLabel()}`);
            // ---- NOTE-FOR-DEBUGGING ---- const samplingIndexArrayGenerator =
            // ---- NOTE-FOR-DEBUGGING ----     bootstrapSamplerKeyMap.sampleInstances();
            // ---- NOTE-FOR-DEBUGGING ---- for (const element of samplingIndexArrayGenerator) {
            // ---- NOTE-FOR-DEBUGGING ----     Utility.debuggingLog(`element of samplingIndexArrayGenerator=` +
            // ---- NOTE-FOR-DEBUGGING ----         `${element}`);
            // ---- NOTE-FOR-DEBUGGING ---- }
            const samplingIndexArray: number[] =
                [...bootstrapSamplerKeyMap.sampleInstances()];
            Utility.debuggingLog(`samplingIndexArray.length=` +
                `${samplingIndexArray.length}`);
            const columnarDataBootstrapSampled: Data =
                await columnarData.createDataFromSamplingExistingDataUtterances(
                    columnarData,
                    labelColumnIndex,
                    textColumnIndex,
                    linesToSkip,
                    samplingIndexArray,
                    false);
            columnarData = columnarDataBootstrapSampled as ColumnarData;
        }
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
        const resultsInitialSampling: {
            "seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels": Map<string, Set<number>>,
            "candidateUtteranceIndexSetSampled": Set<number>,
            "candidateUtteranceIndexSetRemaining": Set<number>,
            } = columnarData.collectUtteranceIndexSetSeedingIntentTrainingSet(
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
                (accumulation: number, entry: [string, Set<number>]) =>
                accumulation + entry[1].size, 0);
        Utility.debuggingLog(`countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
            `${countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels}`);
        // -------------------------------------------------------------------
        const seedingUtteranceIndexArray: number[] =
            [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
                (accumulation: number[], entry: [string, Set<number>]) =>
                accumulation.concat(Array.from(entry[1])), []);
        Utility.debuggingLog(`seedingUtteranceIndexArray.length=` +
            `${seedingUtteranceIndexArray.length}`);
        // -------------------------------------------------------------------
        const seedingInstanceIndexArray: number[] =
            Utility.cloneArray(seedingUtteranceIndexArray);
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
                seedingInstanceIndexArray,
                Array.from(candidateUtteranceIndexSetRemaining));
        let aalSampledInstanceIndexArray: number[] =
            learned.seedingInstanceIndexArray;
        const learner: SoftmaxRegressionSparse =
            learned.learner;
        // -----------------------------------------------------------------------
        const numberInstancesPreSelected: number =
            seedingUtteranceIndexArray.length;
        if (limitingSampleSize > numberInstancesPreSelected) {
            limitingSampleSize -= numberInstancesPreSelected;
            const reservoirArraySampler: ReservoirArraySampler<number> = new ReservoirArraySampler(
                aalSampledInstanceIndexArray,
                numberInstancesPreSelected);
            aalSampledInstanceIndexArray =
                [...reservoirArraySampler.sampleInstances(limitingSampleSize)];
        }
        // -----------------------------------------------------------------------
        const newColumnarData: ColumnarData =
            ColumnarData.createColumnarDataFromFilteringExistingColumnarDataUtterances(
                columnarData,
                labelColumnIndex,
                textColumnIndex,
                linesToSkip,
                new Set<number>(aalSampledInstanceIndexArray),
                false);
        return {
            newColumnarData,
            learner,
            seedingInstanceIndexArray: aalSampledInstanceIndexArray,
            seedingInstanceIndexArrayInitial: seedingUtteranceIndexArray };
        // -----------------------------------------------------------------------
    }
```

In "src/model/evaluation/cross_validation/AppCrossValidator.ts", there are some example functions that
demonstrates how to use 'bf-dispatcher' to run cross validation and evaluate model performance.

```
/**
 * This function consumes a LU file content as input and run cross validation (CV) to evaluate models trained from
 * the input label/text (intent/utterance) instance set.
 *
 * @param luContent - input LU file content as input.
 * @param numberOfCrossValidationFolds - number of cross validation (CV) folds.
 * @param learnerParameterEpochs - CV Softmax Regression Learner parameter - number of epochs
 * @param learnerParameterMiniBatchSize - CV Softmax Regression learner parameter - mini-batch size.
 * @param learnerParameterL1Regularization - CV Softmax Regression learner parameter - L1 regularization.
 * @param learnerParameterL2Regularization - CV Softmax Regression learner parameter - L2 regularization.
 * @param learnerParameterLossEarlyStopRatio - CV Softmax Regression learner parameter - early stop ratio.
 * @param learnerParameterLearningRate - CV Softmax Regression learner parameter - learning rate.
 * @param learnerParameterToCalculateOverallLossAfterEpoch - CV Softmax Regression learner parameter - flag
 */
export async function mainCrossValidatorWithLuContent(
    luContent: string,
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
        true): Promise<CrossValidator> {
    // -----------------------------------------------------------------------
    const luData: LuData =
        await LuData.createLuData(
            luContent,
            new NgramSubwordFeaturizer(),
            true);
    // -----------------------------------------------------------------------
    if (!numberOfCrossValidationFolds) {
        numberOfCrossValidationFolds = CrossValidator.defaultNumberOfCrossValidationFolds;
    }
    // -------------------------------------------------------------------
    const intents: string[] =
        luData.getIntents();
    const utterances: string[] =
        luData.getUtterances();
    const intentLabelIndexArray: number[] =
        luData.getIntentLabelIndexArray();
    const utteranceFeatureIndexArrays: number[][] =
        luData.getUtteranceFeatureIndexArrays();
    assert(intentLabelIndexArray, "intentLabelIndexArray is undefined.");
    assert(utteranceFeatureIndexArrays, "utteranceFeatureIndexArrays is undefined.");
    const crossValidator: CrossValidator =
        new CrossValidator(
            luData.getFeaturizerLabels(),
            luData.getFeaturizerLabelMap(),
            luData.getFeaturizer().getNumberLabels(),
            luData.getFeaturizer().getNumberFeatures(),
            intents,
            utterances,
            intentLabelIndexArray,
            utteranceFeatureIndexArrays,
            luData.getIntentInstanceIndexMapArray(),
            numberOfCrossValidationFolds,
            learnerParameterEpochs,
            learnerParameterMiniBatchSize,
            learnerParameterL1Regularization,
            learnerParameterL2Regularization,
            learnerParameterLossEarlyStopRatio,
            learnerParameterLearningRate,
            learnerParameterToCalculateOverallLossAfterEpoch);
    return crossValidator;
    // -----------------------------------------------------------------------
}

/**
 * This function consumes a columnar TSV file content as input and run cross validation (CV) to
 * evaluate models trained from the input label/text (intent/utterance) instance set.
 *
 * @param columnarContent - content of a TSV columnar file in string form as input.
 * @param labelColumnIndex - label/intent column index.
 * @param textColumnIndex - text/utterace column index.
 * @param linesToSkip - number of header lines skipped before processing each line as an instance record.
 * @param numberOfCrossValidationFolds - number of cross validation (CV) folds.
 * @param learnerParameterEpochs - CV Softmax Regression Learner parameter - number of epochs
 * @param learnerParameterMiniBatchSize - CV Softmax Regression learner parameter - mini-batch size.
 * @param learnerParameterL1Regularization - CV Softmax Regression learner parameter - L1 regularization.
 * @param learnerParameterL2Regularization - CV Softmax Regression learner parameter - L2 regularization.
 * @param learnerParameterLossEarlyStopRatio - CV Softmax Regression learner parameter - early stop ratio.
 * @param learnerParameterLearningRate - CV Softmax Regression learner parameter - learning rate.
 * @param learnerParameterToCalculateOverallLossAfterEpoch - CV Softmax Regression learner parameter - flag
 */
export function mainCrossValidatorWithColumnarContent(
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
        true): CrossValidator {
    // -----------------------------------------------------------------------
    const columnarData: ColumnarData =
        ColumnarData.createColumnarData(
            columnarContent,
            new NgramSubwordFeaturizer(),
            labelColumnIndex,
            textColumnIndex,
            linesToSkip,
            true);
    // -----------------------------------------------------------------------
    if (!numberOfCrossValidationFolds) {
        numberOfCrossValidationFolds = CrossValidator.defaultNumberOfCrossValidationFolds;
    }
    // -------------------------------------------------------------------
    const intents: string[] =
        columnarData.getIntents();
    const utterances: string[] =
        columnarData.getUtterances();
    const intentLabelIndexArray: number[] =
        columnarData.getIntentLabelIndexArray();
    const utteranceFeatureIndexArrays: number[][] =
        columnarData.getUtteranceFeatureIndexArrays();
    assert(intentLabelIndexArray, "intentLabelIndexArray is undefined.");
    assert(utteranceFeatureIndexArrays, "utteranceFeatureIndexArrays is undefined.");
    const crossValidator: CrossValidator =
        new CrossValidator(
            columnarData.getFeaturizerLabels(),
            columnarData.getFeaturizerLabelMap(),
            columnarData.getFeaturizer().getNumberLabels(),
            columnarData.getFeaturizer().getNumberFeatures(),
            intents,
            utterances,
            intentLabelIndexArray,
            utteranceFeatureIndexArrays,
            columnarData.getIntentInstanceIndexMapArray(),
            numberOfCrossValidationFolds,
            learnerParameterEpochs,
            learnerParameterMiniBatchSize,
            learnerParameterL1Regularization,
            learnerParameterL2Regularization,
            learnerParameterLossEarlyStopRatio,
            learnerParameterLearningRate,
            learnerParameterToCalculateOverallLossAfterEpoch);
    return crossValidator;
    // -----------------------------------------------------------------------
}
```

At last, 'bf-dispatcher' also contains several model performance reporter classes in "src/model/evaluation/report" For now, there are three report classes:
    a) DataProfileReporter.ts: consume a data file and report label distribution and feature distribution. Some example functions are implemented in AppDataProfileReporter.ts.
    b) ModelMetaDataProfileReporter.ts: load a model previously trained and generated and report its parameters. Some example functions are implemented in AppModelMetaDataProfileReporter.ts.
    c) ThresholdReporter.ts: load a model and a test file, then report the model performance. Some example functions are implemented in AppThresholdReporter.ts.
