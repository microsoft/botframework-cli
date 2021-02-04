/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';

// require('fast-text-encoding');

import {Label} from '@microsoft/bf-dispatcher';
import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';
import {UtilityLabelResolver} from './utilitylabelresolver';
import {Utility} from './utility';

export class OrchestratorCreate {
  // eslint-disable-next-line max-params
  public static async runAsync(
    baseModelPath: string,
    entityBaseModelPath: string,
    inputPathConfiguration: string,
    outputPath: string,
    hierarchical: boolean = false,
    fullEmbeddings: boolean = false) {
    Utility.debuggingLog(`baseModelPath=${baseModelPath}`);
    Utility.debuggingLog(`entityBaseModelPath=${entityBaseModelPath}`);
    Utility.debuggingLog(`inputPathConfiguration=${inputPathConfiguration}`);
    Utility.debuggingLog(`outputPath=${outputPath}`);
    Utility.debuggingLog(`hierarchical=${hierarchical}`);
    Utility.debuggingLog(`fullEmbeddings=${fullEmbeddings}`);
    if (!baseModelPath || baseModelPath.length === 0) {
      throw new Error('Please provide path to Orchestrator model');
    }
    if (!inputPathConfiguration || inputPathConfiguration.length === 0) {
      throw new Error('Please provide path to input file/folder');
    }
    if (!outputPath || outputPath.length === 0) {
      throw new Error('Please provide output path');
    }

    baseModelPath = path.resolve(baseModelPath);
    if (entityBaseModelPath) {
      entityBaseModelPath = path.resolve(entityBaseModelPath);
    }
    outputPath = path.resolve(outputPath);

    Utility.debuggingLog('OrchestratorCreate.runAsync(), ready to call LabelResolver.createAsync()');
    if (entityBaseModelPath) {
      await LabelResolver.createAsync(baseModelPath, entityBaseModelPath);
    } else {
      await LabelResolver.createAsync(baseModelPath);
    }
    Utility.debuggingLog('OrchestratorCreate.runAsync(), after calling LabelResolver.createAsync()');
    UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(fullEmbeddings);
    const processedUtteranceLabelsMap: {
      'utteranceLabelsMap': Map<string, Set<string>>;
      'utteranceLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceEntityLabelsMap': Map<string, Label[]>;
      'utteranceEntityLabelDuplicateMap': Map<string, Label[]>; } =
      await OrchestratorHelper.getUtteranceLabelsMap(inputPathConfiguration, hierarchical);
    // Utility.debuggingLog(`OrchestratorCreate.runAsync(), processedUtteranceLabelsMap.utteranceLabelsMap.keys()=${[...processedUtteranceLabelsMap.utteranceLabelsMap.keys()]}`);
    // Utility.debuggingLog(`OrchestratorCreate.runAsync(), processedUtteranceLabelsMap.utteranceEntityLabelsMap.keys()=${[...processedUtteranceLabelsMap.utteranceEntityLabelsMap.keys()]}`);
    Utility.debuggingLog('OrchestratorCreate.runAsync(), ready to call LabelResolver.addExamples()');
    LabelResolver.addExamples(processedUtteranceLabelsMap);
    Utility.debuggingLog('OrchestratorCreate.runAsync(), after calling LabelResolver.addExamples()');
    // ---- NOTE-FOR-DEBUGGING ---- const labels: string[] = LabelResolver.getLabels(LabelType.Intent);
    // ---- NOTE-FOR-DEBUGGING ---- Utility.debuggingLog(`OrchestratorCreate.runAsync(), labels=${Utility.jsonStringify(labels)}`);
    // ---- NOTE-FOR-DEBUGGING ---- const examples: any = LabelResolver.getExamples();
    // ---- NOTE-FOR-DEBUGGING ---- const exampleStructureArray: Example[] = Utility.examplesToArray(examples);
    // ---- NOTE-FOR-DEBUGGING ---- for (const example of exampleStructureArray) {
    // ---- NOTE-FOR-DEBUGGING ----   const labels: Label[] = example.labels;
    // ---- NOTE-FOR-DEBUGGING ----   if (labels.length > 1) {
    // ---- NOTE-FOR-DEBUGGING ----     Utility.debuggingLog(`utterance=${example.text}`);
    // ---- NOTE-FOR-DEBUGGING ----   } else {
    // ---- NOTE-FOR-DEBUGGING ----     Utility.debuggingLog('');
    // ---- NOTE-FOR-DEBUGGING ----   }
    // ---- NOTE-FOR-DEBUGGING ----   for (const label of labels) {
    // ---- NOTE-FOR-DEBUGGING ----     Utility.debuggingLog(`label=${label.name}`);
    // ---- NOTE-FOR-DEBUGGING ----   }
    // ---- NOTE-FOR-DEBUGGING ---- }
    Utility.debuggingLog('OrchestratorCreate.runAsync(), ready to call LabelResolver.createSnapshot()');
    const snapshot: any = LabelResolver.createSnapshot();
    Utility.debuggingLog('OrchestratorCreate.runAsync(), after calling LabelResolver.createSnapshot()');
    // ---- NOTE-FOR-DEBUGGING ---- Utility.debuggingLog(`OrchestratorCreate.runAsync(), snapshot=${snapshot}`);
    // ---- NOTE-FOR-DEBUGGING ---- const snapshotInString: string = (new TextDecoder()).decode(snapshot);
    // ---- NOTE-FOR-DEBUGGING ---- Utility.debuggingLog(`OrchestratorCreate.runAsync(), snapshotInString=${snapshotInString}`);
    const outPath: string = OrchestratorHelper.getOutputPath(outputPath, inputPathConfiguration);
    const resolvedFilePath: string = OrchestratorHelper.writeToFile(outPath, snapshot);
    if (Utility.isEmptyString(resolvedFilePath)) {
      Utility.writeStringToConsoleStdout(`ERROR: failed writing the snapshot to file ${resolvedFilePath}`);
    } else {
      Utility.writeStringToConsoleStdout(`Snapshot written to ${resolvedFilePath}`);
    }
  }
}

/* ---- NOTE-FOR-REFERENCE ---- performance reference calling "AddExample()"
(base) D:\testsBfCliOrchestrator\EntityAssessment>REM ---- CALL D:\git\botframework-cli-beta\packages\orchestrator\bin\run orchestrator:create --debug --in .\test.json --out experiment_testing_EntityAssessment --model D:\testsBfCliOrchestrator\_model\model_bert_6l --entityModel D:\git\oc\oc\dep\model\bert_example_ner

(base) D:\testsBfCliOrchestrator\EntityAssessment>CALL D:\git\botframework-cli-beta\packages\orchestrator\bin\run orchestrator:create --debug --in .\train.json --out experiment_training_EntityAssessment --model D:\testsBfCliOrchestrator\_model\model_bert_6l --entityModel D:\git\oc\oc\dep\model\bert_example_ner
[2021-01-29T22:40:37.338Z] LOG-MESSAGE: "baseModelPath=D:\\testsBfCliOrchestrator\\_model\\model_bert_6l"
[2021-01-29T22:40:37.342Z] LOG-MESSAGE: "entityBaseModelPath=D:\\git\\oc\\oc\\dep\\model\\bert_example_ner"
[2021-01-29T22:40:37.342Z] LOG-MESSAGE: "inputPathConfiguration=D:\\testsBfCliOrchestrator\\EntityAssessment\\train.json"
[2021-01-29T22:40:37.344Z] LOG-MESSAGE: "outputPath=D:\\testsBfCliOrchestrator\\EntityAssessment\\experiment_training_EntityAssessment"
[2021-01-29T22:40:37.345Z] LOG-MESSAGE: "hierarchical=false"
[2021-01-29T22:40:37.345Z] LOG-MESSAGE: "fullEmbeddings=false"
[2021-01-29T22:40:37.347Z] LOG-MESSAGE: "OrchestratorCreate.runAsync(), ready to call LabelResolver.createAsync()"
[2021-01-29T22:40:37.351Z] LOG-MESSAGE: "LabelResolver.createAsync(): baseModelPath=D:\\testsBfCliOrchestrator\\_model\\model_bert_6l, entityBaseModelPath=D:\\git\\oc\\oc\\dep\\model\\bert_example_ner"
[2021-01-29T22:40:37.352Z] LOG-MESSAGE: "LabelResolver.loadNlrAsync(): creating Orchestrator."
[2021-01-29T22:40:37.352Z] LOG-MESSAGE: "LabelResolver.loadNlrAsync(): baseModelPath=D:\\testsBfCliOrchestrator\\_model\\model_bert_6l"
[2021-01-29T22:40:37.353Z] LOG-MESSAGE: "LabelResolver.loadNlrAsync(): entityBaseModelPath=D:\\git\\oc\\oc\\dep\\model\\bert_example_ner"
[2021-01-29T22:40:37.353Z] LOG-MESSAGE: "LabelResolver.loadNlrAsync(): baseModelPath-resolved=D:\\testsBfCliOrchestrator\\_model\\model_bert_6l"
[2021-01-29T22:40:37.355Z] LOG-MESSAGE: "LabelResolver.loadNlrAsync(): entityBaseModelPath-resolved=D:\\git\\oc\\oc\\dep\\model\\bert_example_ner"
[2021-01-29T22:40:37.358Z] LOG-MESSAGE: "LabelResolver.loadNlrAsync(): loading intent and entity base model"
[2021-01-29T22:40:39.400Z] LOG-MESSAGE: "LabelResolver.loadNlrAsync(): leaving."
[2021-01-29T22:40:39.402Z] LOG-MESSAGE: "LabelResolver.createAsync(): Creating label resolver."
[2021-01-29T22:40:39.406Z] LOG-MESSAGE: "LabelResolver.createAsync(): Finished creating label resolver."
[2021-01-29T22:40:39.406Z] LOG-MESSAGE: "OrchestratorCreate.runAsync(), after calling LabelResolver.createAsync()"
[2021-01-29T22:40:39.407Z] LOG-MESSAGE: "read to call LabelResolver.setRuntimeParams(), fullEmbeddings=false"
[2021-01-29T22:40:39.408Z] LOG-MESSAGE: "read to call LabelResolver.setRuntimeParams(), resetAll=false"
[2021-01-29T22:40:39.408Z] LOG-MESSAGE: "read to call LabelResolver.setRuntimeParams(), useCompactEmbeddingsObject=[object Object]"
[2021-01-29T22:40:39.409Z] LOG-MESSAGE: "read to call LabelResolver.setRuntimeParams(), useCompactEmbeddingsObject.use_compact_embeddings=true"
[2021-01-29T22:40:39.410Z] LOG-MESSAGE: "read to call LabelResolver.setRuntimeParams(), useCompactEmbeddingsObjectJson={\n    \"use_compact_embeddings\": true\n}"
[2021-01-29T22:40:39.410Z] LOG-MESSAGE: "read to call Utility.getConfigJson(), LabelResolver.LabelResolver=[object LabelResolver]"
"Processing D:\\testsBfCliOrchestrator\\EntityAssessment\\train.json..."
[2021-01-29T22:40:39.487Z] LOG-MESSAGE: "OrchestratorCreate.runAsync(), ready to call LabelResolver.addExamples()"
[2021-01-29T22:40:39.489Z] LOG-MESSAGE: "CALLING LabelResolver.addExamples()"
[2021-01-29T22:40:39.492Z] LOG-MESSAGE: "processed utteranceIntentEntityLabels.utteranceLabelsMap.size=8549"
[2021-01-29T22:40:39.492Z] LOG-MESSAGE: "processed utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size=329"
[2021-01-29T22:40:39.493Z] LOG-MESSAGE: "processed utteranceIntentEntityLabels.utteranceEntityLabelsMap.size=6347"
[2021-01-29T22:40:39.494Z] LOG-MESSAGE: "processed utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size=243"
[2021-01-29T22:40:39.494Z] LOG-MESSAGE: "processed utteranceIntentEntityLabels.utteranceLabelsMap.size=8549"
[2021-01-29T22:40:39.495Z] LOG-MESSAGE: "processed utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size=329"
[2021-01-29T22:40:39.495Z] LOG-MESSAGE: "READY to call labelResolver.addExample() on utteranceLabelsMap utterances and labels, utteranceLabelsMap.size=8549"
[2021-01-29T22:40:56.309Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=100"
[2021-01-29T22:41:29.531Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=200"
[2021-01-29T22:41:44.431Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=300"
[2021-01-29T22:42:01.460Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=400"
[2021-01-29T22:42:30.734Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=500"
[2021-01-29T22:42:59.049Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=600"
[2021-01-29T22:43:23.965Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=700"
[2021-01-29T22:43:43.963Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=800"
[2021-01-29T22:43:54.705Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=900"
[2021-01-29T22:44:06.996Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=1000"
[2021-01-29T22:44:21.314Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=1100"
[2021-01-29T22:44:38.898Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=1200"
[2021-01-29T22:44:51.473Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=1300"
[2021-01-29T22:45:06.223Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=1400"
[2021-01-29T22:45:22.373Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=1500"
[2021-01-29T22:45:37.026Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=1600"
[2021-01-29T22:45:48.858Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=1700"
[2021-01-29T22:46:14.655Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=1800"
[2021-01-29T22:46:33.450Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=1900"
[2021-01-29T22:46:45.869Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=2000"
[2021-01-29T22:46:54.570Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=2100"
[2021-01-29T22:47:21.728Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=2200"
[2021-01-29T22:47:49.081Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=2300"
[2021-01-29T22:48:14.946Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=2400"
[2021-01-29T22:48:37.939Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=2500"
[2021-01-29T22:49:02.952Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=2600"
[2021-01-29T22:49:29.801Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=2700"
[2021-01-29T22:49:36.057Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=2800"
[2021-01-29T22:49:44.097Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=2900"
[2021-01-29T22:50:04.982Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=3000"
[2021-01-29T22:50:35.607Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=3100"
[2021-01-29T22:51:09.118Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=3200"
[2021-01-29T22:51:35.797Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=3300"
[2021-01-29T22:51:59.709Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=3400"
[2021-01-29T22:52:04.866Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=3500"
[2021-01-29T22:52:36.715Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=3600"
[2021-01-29T22:52:54.472Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=3700"
[2021-01-29T22:53:21.779Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=3800"
[2021-01-29T22:53:48.877Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=3900"
[2021-01-29T22:53:55.509Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=4000"
[2021-01-29T22:53:58.834Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=4100"
[2021-01-29T22:54:02.407Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=4200"
[2021-01-29T22:54:13.838Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=4300"
[2021-01-29T22:54:16.844Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=4400"
[2021-01-29T22:54:20.512Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=4500"
[2021-01-29T22:54:39.965Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=4600"
[2021-01-29T22:54:42.290Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=4700"
[2021-01-29T22:54:49.627Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=4800"
[2021-01-29T22:55:24.534Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=4900"
[2021-01-29T22:55:50.788Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=5000"
[2021-01-29T22:55:55.039Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=5100"
[2021-01-29T22:55:59.494Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=5200"
[2021-01-29T22:56:09.551Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=5300"
[2021-01-29T22:56:40.777Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=5400"
[2021-01-29T22:57:00.445Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=5500"
[2021-01-29T22:57:04.990Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=5600"
[2021-01-29T22:57:09.165Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=5700"
[2021-01-29T22:57:13.382Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=5800"
[2021-01-29T22:57:15.788Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=5900"
[2021-01-29T22:57:18.313Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=6000"
[2021-01-29T22:57:40.881Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=6100"
[2021-01-29T22:58:09.920Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=6200"
[2021-01-29T22:58:14.762Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=6300"
[2021-01-29T22:58:28.869Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=6400"
[2021-01-29T22:58:43.793Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=6500"
[2021-01-29T22:58:58.768Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=6600"
[2021-01-29T22:59:13.909Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=6700"
[2021-01-29T22:59:28.956Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=6800"
[2021-01-29T22:59:44.248Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=6900"
[2021-01-29T23:00:03.177Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=7000"
[2021-01-29T23:00:39.813Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=7100"
[2021-01-29T23:01:10.087Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=7200"
[2021-01-29T23:01:39.277Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=7300"
[2021-01-29T23:01:44.627Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=7400"
[2021-01-29T23:02:18.343Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=7500"
[2021-01-29T23:02:37.830Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=7600"
[2021-01-29T23:02:44.300Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=7700"
[2021-01-29T23:02:46.742Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=7800"
[2021-01-29T23:02:50.347Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=7900"
[2021-01-29T23:03:08.787Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=8000"
[2021-01-29T23:03:22.689Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=8100"
[2021-01-29T23:03:37.063Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=8200"
[2021-01-29T23:03:47.384Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=8300"
[2021-01-29T23:04:05.989Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=8400"
[2021-01-29T23:04:19.146Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=8500"
[2021-01-29T23:04:20.921Z] LOG-MESSAGE: "processed utteranceIntentEntityLabels.utteranceEntityLabelsMap.size=6347"
[2021-01-29T23:04:20.922Z] LOG-MESSAGE: "processed utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size=243"
[2021-01-29T23:04:20.926Z] LOG-MESSAGE: "READY to call labelResolver.addExample() on utteranceEntityLabelsMap utterances and labels, utteranceEntityLabelsMap.size=6347"
[2021-01-29T23:07:28.936Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=100"
[2021-01-29T23:10:33.983Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=200"
[2021-01-29T23:13:47.206Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=300"
[2021-01-29T23:17:02.916Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=400"
[2021-01-29T23:20:06.523Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=500"
[2021-01-29T23:22:58.748Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=600"
[2021-01-29T23:25:49.818Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=700"
[2021-01-29T23:28:48.006Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=800"
[2021-01-29T23:31:55.145Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=900"
[2021-01-29T23:34:54.255Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=1000"
[2021-01-29T23:37:56.312Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=1100"
[2021-01-29T23:41:02.141Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=1200"
[2021-01-29T23:44:08.499Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=1300"
[2021-01-29T23:47:21.018Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=1400"
[2021-01-29T23:50:24.953Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=1500"
[2021-01-29T23:53:30.476Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=1600"
[2021-01-29T23:56:54.856Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=1700"
[2021-01-30T00:00:27.974Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=1800"
[2021-01-30T00:04:17.512Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=1900"
[2021-01-30T00:09:20.782Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=2000"
[2021-01-30T00:12:36.136Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=2100"
[2021-01-30T00:15:59.754Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=2200"
[2021-01-30T00:19:02.718Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=2300"
[2021-01-30T00:22:53.661Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=2400"
[2021-01-30T00:26:38.969Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=2500"
[2021-01-30T00:29:58.315Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=2600"
[2021-01-30T00:34:17.213Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=2700"
[2021-01-30T00:37:55.370Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=2800"
[2021-01-30T00:40:43.921Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=2900"
[2021-01-30T00:44:33.144Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=3000"
[2021-01-30T00:47:21.935Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=3100"
[2021-01-30T00:50:14.394Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=3200"
[2021-01-30T00:53:10.999Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=3300"
[2021-01-30T00:56:09.225Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=3400"
[2021-01-30T00:59:10.255Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=3500"
[2021-01-30T01:01:57.342Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=3600"
[2021-01-30T01:04:45.435Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=3700"
[2021-01-30T01:07:37.354Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=3800"
[2021-01-30T01:10:36.076Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=3900"
[2021-01-30T01:13:32.617Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=4000"
[2021-01-30T01:16:43.231Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=4100"
[2021-01-30T01:19:38.413Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=4200"
[2021-01-30T01:22:34.211Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=4300"
[2021-01-30T01:25:25.802Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=4400"
[2021-01-30T01:28:20.847Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=4500"
[2021-01-30T01:31:19.496Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=4600"
[2021-01-30T01:34:17.545Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=4700"
[2021-01-30T01:37:12.920Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=4800"
[2021-01-30T01:40:09.013Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=4900"
[2021-01-30T01:43:05.080Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=5000"
[2021-01-30T01:46:05.955Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=5100"
[2021-01-30T01:48:59.849Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=5200"
[2021-01-30T01:51:58.574Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=5300"
[2021-01-30T01:55:15.290Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=5400"
[2021-01-30T01:58:27.706Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=5500"
[2021-01-30T02:01:25.847Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=5600"
[2021-01-30T02:04:18.500Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=5700"
[2021-01-30T02:07:14.359Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=5800"
[2021-01-30T02:10:05.851Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=5900"
[2021-01-30T02:12:58.519Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=6000"
[2021-01-30T02:15:50.691Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=6100"
[2021-01-30T02:18:41.017Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=6200"
[2021-01-30T02:21:29.419Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=6300"
[2021-01-30T02:22:50.071Z] LOG-MESSAGE: "LEAVING LabelResolver.addExamples()"
[2021-01-30T02:22:50.072Z] LOG-MESSAGE: "OrchestratorCreate.runAsync(), after calling LabelResolver.addExamples()"
[2021-01-30T02:22:50.076Z] LOG-MESSAGE: "OrchestratorCreate.runAsync(), ready to call LabelResolver.createSnapshot()"
[2021-01-30T02:27:15.124Z] LOG-MESSAGE: "OrchestratorCreate.runAsync(), after calling LabelResolver.createSnapshot()"
[2021-01-30T02:27:15.135Z] LOG-MESSAGE: "Successfully wrote to file D:\\testsBfCliOrchestrator\\EntityAssessment\\experiment_training_EntityAssessment\\train.blu"
"Snapshot written to D:\\testsBfCliOrchestrator\\EntityAssessment\\experiment_training_EntityAssessment\\train.blu"
*/

/* ---- NOTE-FOR-REFERENCE ---- performance reference calling "AddExample()"
(base) D:\testsBfCliOrchestrator\EntityAssessment>CALL D:\git\botframework-cli-beta\packages\orchestrator\bin\run orchestrator:create --debug --in .\test.json --out experiment_testing_EntityAssessment --model D:\testsBfCliOrchestrator\_model\model_bert_6l --entityModel D:\git\oc\oc\dep\model\bert_example_ner
[2021-01-29T18:24:11.876Z] LOG-MESSAGE: "baseModelPath=D:\\testsBfCliOrchestrator\\_model\\model_bert_6l"
[2021-01-29T18:24:11.878Z] LOG-MESSAGE: "entityBaseModelPath=D:\\git\\oc\\oc\\dep\\model\\bert_example_ner"
[2021-01-29T18:24:11.879Z] LOG-MESSAGE: "inputPathConfiguration=D:\\testsBfCliOrchestrator\\EntityAssessment\\test.json"
[2021-01-29T18:24:11.882Z] LOG-MESSAGE: "outputPath=D:\\testsBfCliOrchestrator\\EntityAssessment\\experiment_testing_EntityAssessment"
[2021-01-29T18:24:11.883Z] LOG-MESSAGE: "hierarchical=false"
[2021-01-29T18:24:11.884Z] LOG-MESSAGE: "fullEmbeddings=false"
[2021-01-29T18:24:11.885Z] LOG-MESSAGE: "OrchestratorCreate.runAsync(), ready to call LabelResolver.createAsync()"
[2021-01-29T18:24:11.885Z] LOG-MESSAGE: "LabelResolver.createAsync(): baseModelPath=D:\\testsBfCliOrchestrator\\_model\\model_bert_6l, entityBaseModelPath=D:\\git\\oc\\oc\\dep\\model\\bert_example_ner"
[2021-01-29T18:24:11.886Z] LOG-MESSAGE: "LabelResolver.loadNlrAsync(): creating Orchestrator."
[2021-01-29T18:24:11.887Z] LOG-MESSAGE: "LabelResolver.loadNlrAsync(): baseModelPath=D:\\testsBfCliOrchestrator\\_model\\model_bert_6l"
[2021-01-29T18:24:11.887Z] LOG-MESSAGE: "LabelResolver.loadNlrAsync(): entityBaseModelPath=D:\\git\\oc\\oc\\dep\\model\\bert_example_ner"
[2021-01-29T18:24:11.888Z] LOG-MESSAGE: "LabelResolver.loadNlrAsync(): baseModelPath-resolved=D:\\testsBfCliOrchestrator\\_model\\model_bert_6l"
[2021-01-29T18:24:11.888Z] LOG-MESSAGE: "LabelResolver.loadNlrAsync(): entityBaseModelPath-resolved=D:\\git\\oc\\oc\\dep\\model\\bert_example_ner"
[2021-01-29T18:24:11.888Z] LOG-MESSAGE: "LabelResolver.loadNlrAsync(): loading intent and entity base model"
[2021-01-29T18:24:49.051Z] LOG-MESSAGE: "LabelResolver.loadNlrAsync(): leaving."[2021-01-29T18:24:49.052Z] LOG-MESSAGE: "LabelResolver.createAsync(): Creating label resolver."
[2021-01-29T18:24:49.066Z] LOG-MESSAGE: "LabelResolver.createAsync(): Finished creating label resolver."
[2021-01-29T18:24:49.070Z] LOG-MESSAGE: "OrchestratorCreate.runAsync(), after calling LabelResolver.createAsync()"
[2021-01-29T18:24:49.070Z] LOG-MESSAGE: "read to call LabelResolver.setRuntimeParams(), fullEmbeddings=false"
[2021-01-29T18:24:49.072Z] LOG-MESSAGE: "read to call LabelResolver.setRuntimeParams(), resetAll=false"
[2021-01-29T18:24:49.073Z] LOG-MESSAGE: "read to call LabelResolver.setRuntimeParams(), useCompactEmbeddingsObject=[object Object]"
[2021-01-29T18:24:49.074Z] LOG-MESSAGE: "read to call LabelResolver.setRuntimeParams(), useCompactEmbeddingsObject.use_compact_embeddings=true"
[2021-01-29T18:24:49.075Z] LOG-MESSAGE: "read to call LabelResolver.setRuntimeParams(), useCompactEmbeddingsObjectJson={\n    \"use_compact_embeddings\": true\n}"
[2021-01-29T18:24:49.076Z] LOG-MESSAGE: "read to call Utility.getConfigJson(), LabelResolver.LabelResolver=[object LabelResolver]"
"Processing D:\\testsBfCliOrchestrator\\EntityAssessment\\test.json..."
[2021-01-29T18:24:49.115Z] LOG-MESSAGE: "OrchestratorCreate.runAsync(), ready to call LabelResolver.addExamples()"
[2021-01-29T18:24:49.116Z] LOG-MESSAGE: "CALLING LabelResolver.addExamples()"
[2021-01-29T18:24:49.120Z] LOG-MESSAGE: "processed utteranceIntentEntityLabels.utteranceLabelsMap.size=2786"
[2021-01-29T18:24:49.120Z] LOG-MESSAGE: "processed utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size=109"
[2021-01-29T18:24:49.122Z] LOG-MESSAGE: "processed utteranceIntentEntityLabels.utteranceEntityLabelsMap.size=2250"
[2021-01-29T18:24:49.123Z] LOG-MESSAGE: "processed utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size=63"
[2021-01-29T18:24:49.124Z] LOG-MESSAGE: "READY to call labelResolver.addExample() on utteranceLabelsMap utterances and labels, utteranceLabelsMap.size=2786"
[2021-01-29T18:28:29.683Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=1000"
[2021-01-29T18:33:06.043Z] LOG-MESSAGE: "LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=2000"
[2021-01-29T18:36:57.046Z] LOG-MESSAGE: "READY to call labelResolver.addExample() on utteranceEntityLabelsMap utterances and labels, utteranceEntityLabelsMap.size=2250"
[2021-01-29T19:45:37.688Z] LOG-MESSAGE: "LEAVING LabelResolver.addExamples()"
[2021-01-29T19:45:37.688Z] LOG-MESSAGE: "OrchestratorCreate.runAsync(), after calling LabelResolver.addExamples()"
[2021-01-29T19:45:37.689Z] LOG-MESSAGE: "OrchestratorCreate.runAsync(), ready to call LabelResolver.createSnapshot()"
[2021-01-29T19:46:09.857Z] LOG-MESSAGE: "OrchestratorCreate.runAsync(), after calling LabelResolver.createSnapshot()"
[2021-01-29T19:46:09.864Z] LOG-MESSAGE: "Successfully wrote to file D:\\testsBfCliOrchestrator\\EntityAssessment\\experiment_testing_EntityAssessment\\test.blu"
"Snapshot written to D:\\testsBfCliOrchestrator\\EntityAssessment\\experiment_testing_EntityAssessment\\test.blu"
*/
