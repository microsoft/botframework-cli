/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';

import * as readline from 'readline';

import {DictionaryMapUtility} from '@microsoft/bf-dispatcher';
import {IConfusionMatrix} from '@microsoft/bf-dispatcher';
import {MultiLabelObjectConfusionMatrixExact} from '@microsoft/bf-dispatcher';
import {MultiLabelObjectConfusionMatrixSubset} from '@microsoft/bf-dispatcher';

import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';

import {ILabelArrayAndMap} from '@microsoft/bf-dispatcher';
import {Example} from '@microsoft/bf-dispatcher';
import {Label} from '@microsoft/bf-dispatcher';
import {LabelType} from '@microsoft/bf-dispatcher';
import {PredictionStructureWithScoreLabelString} from '@microsoft/bf-dispatcher';
import {PredictionStructureWithScoreLabelObject} from '@microsoft/bf-dispatcher';

import {StructNumberNumber} from '@microsoft/bf-dispatcher';
import {StructTextNumber} from '@microsoft/bf-dispatcher';
import {StructTextStringSet} from '@microsoft/bf-dispatcher';
import {StructTextText} from '@microsoft/bf-dispatcher';

import {UtilityLabelResolver} from './utilitylabelresolver';

import {Utility} from './utility';
import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';

/* eslint-disable no-console */
export class OrchestratorPredict {
  static readonly commandprefix: string =
    'Please enter a commandlet, "h" for help > ';

  static readonly questionForUtterance: string =
    'Please enter an utterance > ';

  static readonly questionForCurrentIntentLabel: string =
    'Please enter a "current" intent label > ';

  static readonly questionForNewIntentLabel: string =
    'Please enter a "new" intent label > ';

  static readonly questionForUtteranceLabelsFromDuplicates: string =
    'Please enter an index from the Duplicates report > ';

  static readonly questionForUtteranceLabelsFromAmbiguous: string =
    'Please enter an index from the Ambiguous report > ';

  static readonly questionForUtteranceLabelsFromMisclassified: string =
    'Please enter an index from the Misclassified report > ';

  static readonly questionForUtteranceLabelsFromLowConfidence: string =
    'Please enter an index from the Low-Confidence report > ';

  static readonly questionForAmbiguousThreshold: string =
    'Please enter a threshold for generating the Ambiguous report > ';

  static readonly questionForLowConfidenceThreshold: string =
    'Please enter a threshold for generating the Low-Confidence report > ';

  static readonly questionForMultiLabelPredictionThreshold: string =
    'Please enter a threshold for multi-label prediction > ';

  static readonly questionForUnknownLabelPredictionThreshold: string =
    'Please enter a threshold for unknow label prediction > ';

  static readonly questionForObfuscateEvaluationReport: string =
    'Please enter true/false for obfuscating lables/utterances in evaluation report > ';

  protected inputPath: string = '';

  protected outputPath: string = '';

  protected baseModelPath: string = '';

  protected entityBaseModelPath: string = '';

  protected cliCmmandId: string = '';

  protected trackEventFunction: any;

  protected ambiguousClosenessThreshold: number = Utility.DefaultAmbiguousClosenessThresholdParameter;

  protected lowConfidenceScoreThreshold: number = Utility.DefaultLowConfidenceScoreThresholdParameter;

  protected multiLabelPredictionThreshold: number = Utility.DefaultMultiLabelPredictionThresholdParameter;

  protected unknownLabelPredictionThreshold: number = Utility.DefaultUnknownLabelPredictionThresholdParameter;

  protected fullEmbeddings: boolean = false;

  protected obfuscateEvaluationReport: boolean = false;

  protected snapshotFile: string = '';

  protected predictingSetIntentGroundTruthJsonContentOutputFilename: string = '';

  protected predictingSetIntentPredictionJsonContentOutputFilename: string = '';

  protected predictingSetIntentScoreOutputFilename: string = '';

  protected predictingSetIntentSummaryOutputFilename: string = '';

  protected predictingSetIntentLabelsOutputFilename: string = '';

  protected predictingSetIntentSnapshotFilename: string = '';

  protected predictingSetEntityGroundTruthJsonContentOutputFilename: string = '';

  protected predictingSetEntityPredictionJsonContentOutputFilename: string = '';

  protected predictingSetEntityScoreOutputFilename: string = '';

  protected predictingSetEntitySummaryOutputFilename: string = '';

  protected predictingSetEntityLabelsOutputFilename: string = '';

  protected predictingSetEntitySnapshotFilename: string = '';

  // ---- NOTE-REFACTOR-LATER ---- protected labelResolver: any;

  protected currentUtterance: string = '';

  protected currentIntentLabels: string[] = [];

  protected newIntentLabels: string[] = [];

  protected currentLabelArrayAndMap: ILabelArrayAndMap = {
    stringArray: [],
    stringMap: new Map<string, number>()};

  protected currentUtteranceLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();

  protected currentUtteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();

  protected currentIntentEvaluationOutput: {
    'evaluationReportLabelUtteranceStatistics': {
      'evaluationSummary': string;
      'labelArrayAndMap': ILabelArrayAndMap;
      'labelStatisticsAndHtmlTable': {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;};
      'utteranceStatisticsAndHtmlTable': {
        'utteranceStatisticsMap': Map<number, number>;
        'utteranceStatistics': StructTextNumber[];
        'utteranceCount': number;
        'utteranceStatisticsHtml': string;};
      'spuriousLabelStatisticsAndHtmlTable': {
        'spuriousLabelUtterancesMap': StructTextStringSet[];
        'spuriousLabelUtterancesTotal': number;
        'spuriousLabelStatistics': string[][];
        'spuriousLabelStatisticsHtml': string; };
      'utterancesMultiLabelArrays': StructTextText[];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string; };
    'evaluationReportAnalyses': {
      'evaluationSummary': string;
      'ambiguousAnalysis': {
        'scoringAmbiguousUtterancesArrays': string[][];
        'scoringAmbiguousUtterancesArraysHtml': string;
        'scoringAmbiguousUtteranceSimpleArrays': string[][];};
      'misclassifiedAnalysis': {
        'scoringMisclassifiedUtterancesArrays': string[][];
        'scoringMisclassifiedUtterancesArraysHtml': string;
        'scoringMisclassifiedUtterancesSimpleArrays': string[][];};
      'lowConfidenceAnalysis': {
        'scoringLowConfidenceUtterancesArrays': string[][];
        'scoringLowConfidenceUtterancesArraysHtml': string;
        'scoringLowConfidenceUtterancesSimpleArrays': string[][];};
      'confusionMatrixAnalysis': {
        'confusionMatrix': IConfusionMatrix;
        'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
        'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
        'predictingConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;
        'confusionMatrixAverageDescriptionMetricsHtml': string;};};
    'predictionStructureWithScoreLabelStringArray': PredictionStructureWithScoreLabelString[];
    'scoreOutputLines': string[][];
    'groundTruthJsonContent': string;
    'predictionJsonContent': string;
  } = Utility.createEmptyLabelStringEvaluationReport();

  protected currentEntityEvaluationOutput: {
    'evaluationReportLabelUtteranceStatistics': {
      'evaluationSummary': string;
      'labelArrayAndMap': ILabelArrayAndMap;
      'labelStatisticsAndHtmlTable': {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;};
      'utteranceStatisticsAndHtmlTable': {
        'utteranceStatisticsMap': Map<number, number>;
        'utteranceStatistics': StructTextNumber[];
        'utteranceCount': number;
        'utteranceStatisticsHtml': string;};
      'spuriousLabelStatisticsAndHtmlTable': {
        'spuriousLabelUtterancesMap': StructTextStringSet[];
        'spuriousLabelUtterancesTotal': number;
        'spuriousLabelStatistics': string[][];
        'spuriousLabelStatisticsHtml': string; };
      'utterancesMultiLabelArrays': StructTextText[];
      'utterancesMultiLabelArraysHtml': string;
      'utteranceLabelDuplicateHtml': string; };
    'evaluationReportAnalyses': {
      'evaluationSummary': string;
      'ambiguousAnalysis': {
        'scoringAmbiguousUtterancesArrays': string[][];
        'scoringAmbiguousUtterancesArraysHtml': string;
        'scoringAmbiguousUtteranceSimpleArrays': string[][];};
      'misclassifiedAnalysis': {
        'scoringMisclassifiedUtterancesArrays': string[][];
        'scoringMisclassifiedUtterancesArraysHtml': string;
        'scoringMisclassifiedUtterancesSimpleArrays': string[][];};
      'lowConfidenceAnalysis': {
        'scoringLowConfidenceUtterancesArrays': string[][];
        'scoringLowConfidenceUtterancesArraysHtml': string;
        'scoringLowConfidenceUtterancesSimpleArrays': string[][];};
      'confusionMatrixAnalysis': {
        'confusionMatrix': IConfusionMatrix;
        'multiLabelObjectConfusionMatrixExact': MultiLabelObjectConfusionMatrixExact;
        'multiLabelObjectConfusionMatrixSubset': MultiLabelObjectConfusionMatrixSubset;
        'predictingConfusionMatrixOutputLines': string[][];
        'confusionMatrixMetricsHtml': string;
        'confusionMatrixAverageMetricsHtml': string;
        'confusionMatrixAverageDescriptionMetricsHtml': string;};};
    'predictionStructureWithScoreLabelObjectArray': PredictionStructureWithScoreLabelObject[];
    'scoreOutputLines': string[][];
    'groundTruthJsonContent': string;
    'predictionJsonContent': string;
  } = Utility.createEmptyLabelObjectEvaluationReport();

  /* eslint-disable max-params */
  /* eslint-disable complexity */
  constructor(
    baseModelPath: string,
    entityBaseModelPath: string,
    inputPath: string,
    outputPath: string,
    cliCmmandId: string,
    trackEventFunction: any,
    ambiguousClosenessThresholdParameter: number,
    lowConfidenceScoreThresholdParameter: number,
    multiLabelPredictionThresholdParameter: number,
    unknownLabelPredictionThresholdParameter: number,
    fullEmbeddings: boolean = false,
    obfuscateEvaluationReport: boolean = false) {
    // ---- NOTE ---- process arguments
    // if (Utility.isEmptyString(inputPath)) {
    //   Utility.debuggingThrow(`Please provide path to an input .blu file, CWD=${process.cwd()}, from OrchestratorPredict.constructor()`);
    // }
    if (Utility.isEmptyString(outputPath)) {
      Utility.debuggingThrow('Please provide an output directory');
    }
    // if (Utility.isEmptyString(baseModelPath)) {
    //   Utility.debuggingThrow('The baseModelPath argument is empty');
    // }
    // if (Utility.isEmptyString(entityBaseModelPath)) {
    //   Utility.debuggingThrow('The entityBaseModelPath argument is empty');
    // }
    if (inputPath) {
      inputPath = path.resolve(inputPath);
    } else {
      inputPath = '';
    }
    if (baseModelPath) {
      baseModelPath = path.resolve(baseModelPath);
      if (!Utility.exists(baseModelPath)) {
        Utility.debuggingThrow(`The input model file path "${baseModelPath}" does not exist!`);
      }
    } else {
      baseModelPath = '';
    }
    if (entityBaseModelPath) {
      entityBaseModelPath = path.resolve(entityBaseModelPath);
      if (!Utility.exists(entityBaseModelPath)) {
        Utility.debuggingThrow(`The input entity model file path "${entityBaseModelPath}" does not exist!`);
      }
    } else {
      entityBaseModelPath = '';
    }
    Utility.debuggingLog(`inputPath=${inputPath}`);
    Utility.debuggingLog(`outputPath=${outputPath}`);
    Utility.debuggingLog(`baseModelPath=${baseModelPath}`);
    Utility.debuggingLog(`entityBaseModelPath=${entityBaseModelPath}`);
    Utility.debuggingLog(`ambiguousClosenessThresholdParameter=${ambiguousClosenessThresholdParameter}`);
    Utility.debuggingLog(`lowConfidenceScoreThresholdParameter=${lowConfidenceScoreThresholdParameter}`);
    Utility.debuggingLog(`multiLabelPredictionThresholdParameter=${multiLabelPredictionThresholdParameter}`);
    Utility.debuggingLog(`unknownLabelPredictionThresholdParameter=${unknownLabelPredictionThresholdParameter}`);
    Utility.debuggingLog(`fullEmbeddings=${fullEmbeddings}`);
    Utility.debuggingLog(`obfuscateEvaluationReport=${obfuscateEvaluationReport}`);
    this.inputPath = inputPath;
    this.outputPath = outputPath;
    this.baseModelPath = baseModelPath;
    this.entityBaseModelPath = entityBaseModelPath;
    this.cliCmmandId = cliCmmandId;
    this.trackEventFunction = trackEventFunction;
    this.ambiguousClosenessThreshold = ambiguousClosenessThresholdParameter;
    this.lowConfidenceScoreThreshold = lowConfidenceScoreThresholdParameter;
    this.multiLabelPredictionThreshold = multiLabelPredictionThresholdParameter;
    this.unknownLabelPredictionThreshold = unknownLabelPredictionThresholdParameter;
    this.fullEmbeddings = fullEmbeddings;
    this.obfuscateEvaluationReport = obfuscateEvaluationReport;
    // ---- NOTE ---- load the snapshot set
    this.snapshotFile = this.inputPath;
    if (this.snapshotFile) {
      if (!Utility.exists(this.snapshotFile)) {
        Utility.debuggingThrow(`snapshot set file does not exist, snapshotFile=${this.snapshotFile}`);
      }
    }
    this.predictingSetIntentGroundTruthJsonContentOutputFilename = path.join(this.outputPath, 'orchestrator_predicting_set_intent_ground_truth._instancesjson');
    this.predictingSetIntentPredictionJsonContentOutputFilename = path.join(this.outputPath, 'orchestrator_predicting_set_intent_prediction_instances.json');
    this.predictingSetIntentScoreOutputFilename = path.join(this.outputPath, 'orchestrator_predicting_set_intent_scores.txt');
    this.predictingSetIntentSummaryOutputFilename = path.join(this.outputPath, 'orchestrator_predicting_set_intent_summary.html');
    this.predictingSetIntentLabelsOutputFilename = path.join(this.outputPath, 'orchestrator_predicting_set_intent_labels.txt');
    this.predictingSetIntentSnapshotFilename = path.join(this.outputPath, 'orchestrator_predicting_set_intent_snapshot.blu');
    this.predictingSetEntityGroundTruthJsonContentOutputFilename = path.join(this.outputPath, 'orchestrator_predicting_set_entity_ground_truth._instancesjson');
    this.predictingSetEntityPredictionJsonContentOutputFilename = path.join(this.outputPath, 'orchestrator_predicting_set_entity_prediction_instances.json');
    this.predictingSetEntityScoreOutputFilename = path.join(this.outputPath, 'orchestrator_predicting_set_entity_scores.txt');
    this.predictingSetEntitySummaryOutputFilename = path.join(this.outputPath, 'orchestrator_predicting_set_entity_summary.html');
    this.predictingSetEntityLabelsOutputFilename = path.join(this.outputPath, 'orchestrator_predicting_set_entity_labels.txt');
    this.predictingSetEntitySnapshotFilename = path.join(this.outputPath, 'orchestrator_predicting_set_entity_snapshot.blu');
  }

  public getPredictingSetIntentGroundTruthJsonContentOutputFilename(): string {
    return this.predictingSetIntentGroundTruthJsonContentOutputFilename;
  }

  public getPredictingSetIntentPredictionJsonContentOutputFilename(): string {
    return this.predictingSetIntentPredictionJsonContentOutputFilename;
  }

  public getPredictingSetIntentScoreOutputFilename(): string {
    return this.predictingSetIntentScoreOutputFilename;
  }

  public getPredictingSetIntentSummaryOutputFilename(): string {
    return this.predictingSetIntentSummaryOutputFilename;
  }

  public getPredictingSetIntentLabelsOutputFilename(): string {
    return this.predictingSetIntentLabelsOutputFilename;
  }

  public getPredictingSetIntentSnapshotFilename(): string {
    return this.predictingSetIntentSnapshotFilename;
  }

  public getPredictingSetEntityGroundTruthJsonContentOutputFilename(): string {
    return this.predictingSetEntityGroundTruthJsonContentOutputFilename;
  }

  public getPredictingSetEntityPredictionJsonContentOutputFilename(): string {
    return this.predictingSetEntityPredictionJsonContentOutputFilename;
  }

  public getPredictingSetEntityScoreOutputFilename(): string {
    return this.predictingSetEntityScoreOutputFilename;
  }

  public getPredictingSetEntitySummaryOutputFilename(): string {
    return this.predictingSetEntitySummaryOutputFilename;
  }

  public getPredictingSetEntityLabelsOutputFilename(): string {
    return this.predictingSetEntityLabelsOutputFilename;
  }

  public getPredictingSetEntitySnapshotFilename(): string {
    return this.predictingSetEntitySnapshotFilename;
  }

  public async buildLabelResolver(): Promise<void> {
    // ---- NOTE ---- create a LabelResolver object.
    Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), ready to create a LabelResolver object');
    if (Utility.exists(this.snapshotFile)) {
      // ---- NOTE ---- create a LabelResolver object.
      Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), ready to call LabelResolver.createAsync()');
      await LabelResolver.createAsync(this.baseModelPath, this.entityBaseModelPath);
      Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), after calling LabelResolver.createAsync()');
      Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), ready to call UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
      UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(this.fullEmbeddings);
      Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), after calling UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
      Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), ready to call OrchestratorHelper.getSnapshotFromFile()');
      const snapshot: Uint8Array = OrchestratorHelper.getSnapshotFromFile(this.snapshotFile);
      Utility.debuggingLog(`LabelResolver.createWithSnapshotAsync(): typeof(snapshot)=${typeof snapshot}`);
      Utility.debuggingLog(`LabelResolver.createWithSnapshotAsync(): snapshot.byteLength=${snapshot.byteLength}`);
      Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), after calling OrchestratorHelper.getSnapshotFromFile()');
      Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), ready to call LabelResolver.addSnapshot()');
      await LabelResolver.addSnapshot(snapshot);
      Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), after calling LabelResolver.addSnapshot()');
    } else {
      Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), ready to call LabelResolver.createAsync()');
      await LabelResolver.createAsync(this.baseModelPath, this.entityBaseModelPath);
      Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), after calling LabelResolver.createAsync()');
      Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), ready to call UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
      UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(this.fullEmbeddings);
      Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), after calling UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
    }
    Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), after creating a LabelResolver object');
  }

  public static async runAsync(
    baseModelPath: string,
    entityBaseModelPath: string,
    inputPath: string,
    outputPath: string,
    cliCmmandId: string,
    trackEventFunction: any,
    ambiguousClosenessThresholdParameter: number,
    lowConfidenceScoreThresholdParameter: number,
    multiLabelPredictionThresholdParameter: number,
    unknownLabelPredictionThresholdParameter: number,
    fullEmbeddings: boolean = false,
    obfuscateEvaluationReport: boolean = false): Promise<number> {
    const orchestratorPredict: OrchestratorPredict = new OrchestratorPredict(
      baseModelPath,
      entityBaseModelPath,
      inputPath,
      outputPath,
      cliCmmandId,
      trackEventFunction,
      ambiguousClosenessThresholdParameter,
      lowConfidenceScoreThresholdParameter,
      multiLabelPredictionThresholdParameter,
      unknownLabelPredictionThresholdParameter,
      fullEmbeddings,
      obfuscateEvaluationReport);
    // ---- NOTE ---- create a LabelResolver object.
    await orchestratorPredict.buildLabelResolver();
    // ---- NOTE ---- enter the command loop.
    return orchestratorPredict.commandLetLoop();
  }

  public async commandLetLoop(): Promise<number> {
    /** ---- NOTE ----
     *  need to dynamically create an 'interactive' object
     *  and call close() when it's not needed, otherwise this resource cannot be
     *  properly disposed of and a unit test on this object will hang.
     */
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetLoop`, {callee: 'commandLetLoop'});
    } catch (error) {
    }
    const interactive: readline.Interface = readline.createInterface(process.stdin, process.stdout);
    const question: any = function (prefix: string) {
      return new Promise((resolve: any, _reject: any) => {
        interactive.question(prefix, (answer: string) => {
          resolve(answer);
        });
      });
    };
    let command: string = '';
    // ---- NOTE ---- enter the interaction loop.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      this.displayInputs();
      // eslint-disable-next-line no-await-in-loop
      command = await question(OrchestratorPredict.commandprefix);
      command = command.trim();
      Utility.debuggingLog(`The command you entered is "${command}"`);
      if (command === 'q') {
        break;
      }
      switch (command) {
      case 'h': this.commandLetH();
        break;
      case 'd': this.commandLetD();
        break;
      case 's': this.commandLetS();
        break;
      // eslint-disable-next-line no-await-in-loop
      case 'u': await this.commandLetU(question);
        break;
      case 'cu': this.commandLetCU();
        break;
      // eslint-disable-next-line no-await-in-loop
      case 'i': await this.commandLetI(question);
        break;
      case 'ci': this.commandLetCI();
        break;
      // eslint-disable-next-line no-await-in-loop
      case 'ni': await this.commandLetNI(question);
        break;
      case 'cni': this.commandLetCNI();
        break;
      case 'f': this.commandLetF();
        break;
      case 'p': this.commandLetP();
        break;
      case 'v': this.commandLetV();
        break;
      // eslint-disable-next-line no-await-in-loop
      case 'vd': await this.commandLetVD(question);
        break;
      // eslint-disable-next-line no-await-in-loop
      case 'va': await this.commandLetVA(question);
        break;
      // eslint-disable-next-line no-await-in-loop
      case 'vm': await this.commandLetVM(question);
        break;
      // eslint-disable-next-line no-await-in-loop
      case 'vl': await this.commandLetVL(question);
        break;
      // eslint-disable-next-line no-await-in-loop
      case 'vat': await this.commandLetVAT(question);
        break;
      // eslint-disable-next-line no-await-in-loop
      case 'vlt': await this.commandLetVLT(question);
        break;
      // eslint-disable-next-line no-await-in-loop
      case 'vmt': await this.commandLetVMT(question);
        break;
      // eslint-disable-next-line no-await-in-loop
      case 'vut': await this.commandLetVUT(question);
        break;
      // eslint-disable-next-line no-await-in-loop
      case 'vo': await this.commandLetVO(question);
        break;
      case 'a': this.commandLetA();
        break;
      case 'r': this.commandLetR();
        break;
      case 'c': this.commandLetC();
        break;
      case 'rl': this.commandLetRL();
        break;
      case 'n': this.commandLetN();
        break;
      default:
        console.log(`> Cannot recognize the command you just entered "${command}",`);
        console.log('> please type "h" for help!');
        break;
      }
    }
    // eslint-disable-next-line no-console
    console.log('> Bye!');
    interactive.close();
    return 0;
  }

  public commandLetH(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetH`, {commandLet: 'commandLetH'});
    } catch (error) {
    }
    console.log('  Commandlets: h, q, d, s, u, cu, i, ci, ni, cni, q, p, v,');
    console.log('               vd, va, vm, vl, vat, vlt, vmt, vut, vo, a, r, c, rl, n');
    console.log('    h   - print this help message');
    console.log('    q   - quit');
    console.log('    d   - display utterance, intent label array inputs, Orchestrator config,');
    console.log('          and the label-index map');
    console.log('    s   - show label-utterance statistics of the model examples');
    console.log('    u   - enter a new utterance and save it as the "current" utterance input');
    console.log('    cu  - clear the "current" utterance input');
    console.log('    i   - enter an intent and add it to the "current" intent label array input ');
    console.log('          (can be an index for retrieving a label from the label-index map)');
    console.log('    ci  - clear the "current" intent label array input');
    console.log('    ni  - enter an intent and add it to the "new" intent label array input ');
    console.log('          (can be an index for retrieving a label from the label-index map)');
    console.log('    cni - clear the "new" intent label array input');
    console.log('    f   - find the "current" utterance if it is already in the model example set');
    console.log('    p   - make a prediction on the "current" utterance input');
    console.log('    v   - validate the model and save analyses (validation report) to ');
    console.log(`          "${this.predictingSetIntentSummaryOutputFilename}"`);
    console.log('    vd  - reference a validation Duplicates report ');
    console.log('          (previously generated by the "v" command) and enter an index');
    console.log('          for retrieving utterance/intents into "current"');
    console.log('    va  - reference a validation Ambiguous report ');
    console.log('          (previously generated by the "v" command) and enter an index');
    console.log('          for retrieving utterance/intents into "current"');
    console.log('    vm  - reference a validation Misclassified report and enter an index');
    console.log('          (previously generated by the "v" command) ');
    console.log('          for retrieving utterance/intents into "current"');
    console.log('    vl  - reference a validation LowConfidence report ');
    console.log('          (previously generated by the "v" command) and enter an index');
    console.log('          for retrieving utterance/intents into "current"');
    console.log('    vat - enter a new validation-report ambiguous closeness threshold');
    console.log('    vlt - enter a new validation-report low-confidence threshold');
    console.log('    vmt - enter a new multi-label threshold');
    console.log('    vut - enter a new unknown-label threshold');
    console.log('    vo  - enter a boolean for obfuscating labels/utterances or not in evaluation reports');
    console.log('          generated by the "v" command');
    console.log('    a   - add the "current" utterance and intent labels to the model example set');
    console.log('    r   - remove the "current" utterance and intent labels from the model example set');
    console.log('    c   - remove the "current" utterance\'s intent labels and then ');
    console.log('          add it with the "new" intent labels to the model example set');
    console.log('    rl  - remove the "current" intent labels from the model example set');
    console.log('    n   - create a new snapshot of model examples and save it to ');
    console.log(`          "${this.predictingSetIntentSnapshotFilename}"`);
    return 0;
  }

  public displayInputs(): void {
    console.log(`> "Current" utterance:          "${this.currentUtterance}"`);
    console.log(`> "Current" intent label array: "${this.currentIntentLabels}"`);
    console.log(`> "New"     intent label array: "${this.newIntentLabels}"`);
  }

  public commandLetD(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetD`, {commandLet: 'commandLetD'});
    } catch (error) {
    }
    console.log(`> Ambiguous closeness:           ${this.ambiguousClosenessThreshold}`);
    console.log(`> Low-confidence threshold:      ${this.lowConfidenceScoreThreshold}`);
    console.log(`> Multi-label threshold:         ${this.multiLabelPredictionThreshold}`);
    console.log(`> Unknown-label threshold:       ${this.unknownLabelPredictionThreshold}`);
    console.log(`> Obfuscation flag:              ${this.obfuscateEvaluationReport}`);
    const labelResolverConfig: any = LabelResolver.getConfigJson();
    console.log(`> Orchestrator configuration:    ${labelResolverConfig}`);
    const labels: string[] = LabelResolver.getLabels(LabelType.Intent);
    this.currentLabelArrayAndMap = Utility.buildStringIdNumberValueDictionaryFromStringArray(labels);
    const currentLabelStringMap: Map<string, number> = this.currentLabelArrayAndMap.stringMap;
    console.log(`> Current label-index map: ${DictionaryMapUtility.jsonStringifyStringKeyGenericValueNativeMap(currentLabelStringMap)}`);
    return 0;
  }

  public commandLetS(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetS`, {commandLet: 'commandLetS'});
    } catch (error) {
    }
    this.currentUtteranceLabelsMap = new Map<string, Set<string>>();
    this.currentUtteranceLabelDuplicateMap = new Map<string, Set<string>>();
    const examples: any = LabelResolver.getExamples();
    if (examples.length <= 0) {
      console.log('> There is no example');
      return -1;
    }
    const exampleStructureArray: Example[] = Utility.examplesToArray(examples);
    Utility.debuggingLog(`OrchestratorPredict.commandLetS(), exampleStructureArray.length=${exampleStructureArray.length}`);
    const labels: string[] = LabelResolver.getLabels(LabelType.Intent);
    // Utility.debuggingLog(`OrchestratorPredict.commandLetS(), labels.length=${labels.length}`);
    // Utility.debuggingLog(`OrchestratorPredict.commandLetS(), labels=${labels}`);
    this.currentLabelArrayAndMap = Utility.buildStringIdNumberValueDictionaryFromStringArray(labels);
    const numberAddedIntentLabels: StructNumberNumber = Utility.examplesToUtteranceLabelMaps(
      exampleStructureArray,
      this.currentUtteranceLabelsMap,
      this.currentUtteranceLabelDuplicateMap);
    const numberIntentUtteancesAdded: number = numberAddedIntentLabels.valueFirst;
    const numberIntentLabelsAdded: number = numberAddedIntentLabels.valueSecond;
    Utility.debuggingLog(`OrchestratorPredict.commandLetS(), numberAddedIntentLabels=${numberAddedIntentLabels}`);
    Utility.debuggingLog(`OrchestratorPredict.commandLetS(), numberIntentUtteancesAdded=${numberIntentUtteancesAdded}`);
    Utility.debuggingLog(`OrchestratorPredict.commandLetS(), numberIntentLabelsAdded=${numberIntentLabelsAdded}`);
    const labelStatisticsAndHtmlTable: {
      'labelUtterancesMap': Map<string, Set<string>>;
      'labelUtterancesTotal': number;
      'labelStatistics': string[][];
      'labelStatisticsHtml': string;
    } = Utility.generateLabelStringLabelStatisticsAndHtmlTable(
      this.currentUtteranceLabelsMap,
      this.currentLabelArrayAndMap);
    const labelUtteranceCount: Map<string, number> = new Map<string, number>();
    labelStatisticsAndHtmlTable.labelUtterancesMap.forEach(
      (value: Set<string>, key: string) => {
        labelUtteranceCount.set(key, value.size);
      });
    const labelUtteranceCountDictionary: { [id: string]: number } = DictionaryMapUtility.convertStringKeyGenericValueNativeMapToDictionary(
      labelUtteranceCount);
    // Utility.debuggingLog(`OrchestratorPredict.commandLetS(), labelUtteranceCount=${labelUtteranceCount}`);
    // Utility.debuggingLog(`OrchestratorPredict.commandLetS(), [...labelUtteranceCount]=${[...labelUtteranceCount]}`);
    // Utility.debuggingLog(`OrchestratorPredict.commandLetS(), labelUtteranceCountDictionary=${labelUtteranceCountDictionary}`);
    console.log(`> Per-label #examples: ${Utility.jsonStringify(labelUtteranceCountDictionary)}`);
    console.log(`> Total #examples:${labelStatisticsAndHtmlTable.labelUtterancesTotal}`);
    return 0;
  }

  public async commandLetU(question: any): Promise<number> {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetU`, {commandLet: 'commandLetU'});
    } catch (error) {
    }
    return this.commandLetUwithEntry(await question(OrchestratorPredict.questionForUtterance));
  }

  public commandLetUwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetUwithEntry`, {commandLet: 'commandLetUwithEntry'});
    } catch (error) {
    }
    this.currentUtterance = entry;
    return 0;
  }

  public commandLetCU(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetCU`, {commandLet: 'commandLetCU'});
    } catch (error) {
    }
    this.currentUtterance = '';
    return 0;
  }

  public async commandLetI(question: any): Promise<number> {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetI`, {commandLet: 'commandLetI'});
    } catch (error) {
    }
    return this.commandLetIwithEntry(await question(OrchestratorPredict.questionForCurrentIntentLabel));
  }

  public commandLetIwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetIwithEntry`, {commandLet: 'commandLetIwithEntry'});
    } catch (error) {
    }
    let label: string = entry;
    label = label.trim();
    const errorMessage: string = Utility.parseInputLabelEntryIntoInputLabelContainerArray(
      LabelResolver.getLabels(LabelType.Intent),
      label,
      this.currentIntentLabels);
    if (!Utility.isEmptyString(errorMessage)) {
      console.log(`ERROR: ${errorMessage}`);
      return -1;
    }
    return 0;
  }

  public commandLetCI(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetCI`, {commandLet: 'commandLetCI'});
    } catch (error) {
    }
    this.currentIntentLabels = [];
    return 0;
  }

  public async commandLetNI(question: any): Promise<number> {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetNI`, {commandLet: 'commandLetNI'});
    } catch (error) {
    }
    return this.commandLetNIwithEntry(await question(OrchestratorPredict.questionForNewIntentLabel));
  }

  public commandLetNIwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetNIwithEntry`, {commandLet: 'commandLetNIwithEntry'});
    } catch (error) {
    }
    let label: string = entry;
    label = label.trim();
    const errorMessage: string = Utility.parseInputLabelEntryIntoInputLabelContainerArray(
      LabelResolver.getLabels(LabelType.Intent),
      label,
      this.newIntentLabels);
    if (!Utility.isEmptyString(errorMessage)) {
      console.log(`ERROR: ${errorMessage}`);
      return -1;
    }
    return 0;
  }

  public commandLetCNI(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetCNI`, {commandLet: 'commandLetCNI'});
    } catch (error) {
    }
    this.newIntentLabels = [];
    return 0;
  }

  public commandLetF(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetF`, {commandLet: 'commandLetF'});
    } catch (error) {
    }
    if (this.currentUtteranceLabelsMap.size <= 0) {
      console.log('ERROR: Please run \'s\' commandlet first scanning the model snapshot for querying');
      return -1;
    }
    if (Utility.isEmptyString(this.currentUtterance)) {
      console.log('ERROR: The "current" utterance is empty, nothing to query for.');
      return -2;
    }
    if (this.currentUtterance in this.currentUtteranceLabelsMap) {
      console.log(`> The "current" utterance '${this.currentUtterance}' is in the model and it's intent labels are '${this.currentUtteranceLabelsMap.get(this.currentUtterance)}'`);
    } else {
      console.log(`> The "current" utterance '${this.currentUtterance}' is not in the model.`);
    }
    return 0;
  }

  public commandLetP(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetP`, {commandLet: 'commandLetP'});
    } catch (error) {
    }
    if (Utility.isEmptyString(this.baseModelPath)) {
      console.log('> No model is loaded, cannot make a prediction.');
    }
    UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample(false);
    const scoreResults: any = LabelResolver.score(this.currentUtterance, LabelType.Intent);
    if (!scoreResults) {
      return -1;
    }
    console.log(`> Prediction:\n${Utility.jsonStringify(scoreResults)}`);
    return 0;
  }

  public commandLetV(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetV`, {commandLet: 'commandLetV'});
    } catch (error) {
    }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- retrieve the examples.
    const examples: any = LabelResolver.getExamples();
    if (examples.length <= 0) {
      console.log('ERROR: There is no example in the snapshot set, please add some.');
      return -1;
    }
    Utility.debuggingLog(`OrchestratorPredict.commandLetV(), examples.length=${examples.length}`);
    const exampleStructureArray: Example[] = Utility.examplesToArray(examples);
    Utility.debuggingLog(`OrchestratorPredict.commandLetV(), exampleStructureArray.length=${exampleStructureArray.length}`);
    // -----------------------------------------------------------------------
    // ---- NOTE ---- process the snapshot set for intent.
    const labels: string[] = LabelResolver.getLabels(LabelType.Intent);
    const utteranceLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const numberAddedIntentLabels: StructNumberNumber = Utility.examplesToUtteranceLabelMaps(
      exampleStructureArray,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap);
    const numberIntentUtteancesAdded: number = numberAddedIntentLabels.valueFirst;
    const numberIntentLabelsAdded: number = numberAddedIntentLabels.valueSecond;
    Utility.debuggingLog(`OrchestratorPredict.commandLetV(), numberAddedIntentLabels=${numberAddedIntentLabels}`);
    Utility.debuggingLog(`OrchestratorPredict.commandLetV(), numberIntentUtteancesAdded=${numberIntentUtteancesAdded}`);
    Utility.debuggingLog(`OrchestratorPredict.commandLetV(), numberIntentLabelsAdded=${numberIntentLabelsAdded}`);
    // -----------------------------------------------------------------------
    // ---- NOTE ---- process the snapshot set for entity.
    const entityLabels: string[] = LabelResolver.getLabels(LabelType.Entity);
    const utteranceEntityLabelsMap: Map<string, Label[]> = new Map<string, Label[]>();
    const utteranceEntityLabelDuplicateMap: Map<string, Label[]> = new Map<string, Label[]>();
    const numberAddedEntityLabels: StructNumberNumber = Utility.examplesToUtteranceEntityLabelMaps(
      exampleStructureArray,
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap);
    const numberEntityUtteancesAdded: number = numberAddedEntityLabels.valueFirst;
    const numberEntityLabelsAdded: number = numberAddedEntityLabels.valueSecond;
    Utility.debuggingLog(`OrchestratorPredict.commandLetV(), numberAddedEntityLabels=${numberAddedEntityLabels}`);
    Utility.debuggingLog(`OrchestratorPredict.commandLetV(), numberEntityUtteancesAdded=${numberEntityUtteancesAdded}`);
    Utility.debuggingLog(`OrchestratorPredict.commandLetV(), numberEntityLabelsAdded=${numberEntityLabelsAdded}`);
    // -----------------------------------------------------------------------
    Utility.toObfuscateLabelTextInReportUtility = this.obfuscateEvaluationReport;
    UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver = this.obfuscateEvaluationReport;
    Utility.debuggingLog('OrchestratorPredict.commandLetV(), ready to call UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample("true")');
    UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample(true);
    Utility.debuggingLog('OrchestratorPredict.commandLetV(), finished calling UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample()');
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce intent analysis reports.
    Utility.debuggingLog('OrchestratorPredict.commandLetV(), ready to call UtilityLabelResolver.generateEvaluationReport()');
    this.currentIntentEvaluationOutput = Utility.generateLabelStringEvaluationReport(
      UtilityLabelResolver.scoreBatchStringLabels, // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- UtilityLabelResolver.scoreStringLabels,
      labels,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      this.ambiguousClosenessThreshold,
      this.lowConfidenceScoreThreshold,
      this.multiLabelPredictionThreshold,
      this.unknownLabelPredictionThreshold,
      Utility.createEmptyLabelStringUnknownSpuriousLabelsStructure());
    Utility.debuggingLog('OrchestratorPredict.commandLetV(), finished calling Utility.generateEvaluationReport()');
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce analysis report output files.
    Utility.debuggingLog('OrchestratorPredict.commandLetV(), ready to call Utility.generateEvaluationReportFiles()');
    let evaluationSummaryIntent: string =
      this.currentIntentEvaluationOutput.evaluationReportAnalyses.evaluationSummary;
    evaluationSummaryIntent = evaluationSummaryIntent.replace(
      '{APP_NAME}',
      '');
    evaluationSummaryIntent = evaluationSummaryIntent.replace(
      '{MODEL_SPECIFICATION}',
      '');
    // -----------------------------------------------------------------------
    Utility.generateEvaluationReportFiles(
      this.currentIntentEvaluationOutput.evaluationReportLabelUtteranceStatistics.labelArrayAndMap.stringArray,
      this.currentIntentEvaluationOutput.scoreOutputLines,
      this.currentIntentEvaluationOutput.groundTruthJsonContent,
      this.currentIntentEvaluationOutput.predictionJsonContent,
      evaluationSummaryIntent,
      this.getPredictingSetIntentLabelsOutputFilename(),
      this.getPredictingSetIntentScoreOutputFilename(),
      this.getPredictingSetIntentGroundTruthJsonContentOutputFilename(),
      this.getPredictingSetIntentPredictionJsonContentOutputFilename(),
      this.getPredictingSetIntentSummaryOutputFilename());
    Utility.debuggingLog('OrchestratorPredict.commandLetV(), finished calling Utility.generateEvaluationReportFiles()');
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`this.currentIntentEvaluationOutput=${Utility.jsonStringify(this.currentIntentEvaluationOutput)}`);
    }
    // -----------------------------------------------------------------------
    /** ---- NOTE ----
     *  Transfer non-object-label utterance from
     *  utteranceLabelsMap to utteranceEntityLabelsMap
     *  only do this when there is a entity model for evaluation.
     */
    if (!UtilityDispatcher.isEmptyString(this.entityBaseModelPath)) {
      const numberUtterancesCopied: number = Utility.copyNonExistentUtteranceLabelsFromStringToObjectStructure(
        utteranceLabelsMap,
        utteranceEntityLabelsMap);
      UtilityDispatcher.debuggingNamedLog1('OrchestratorEvaluate.runAsync()', numberUtterancesCopied, 'numberUtterancesCopied');
    }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce entity analysis reports.
    Utility.debuggingLog('OrchestratorPredict.commandLetV(), ready to call UtilityLabelResolver.generateEvaluationReport()');
    this.currentEntityEvaluationOutput = Utility.generateLabelObjectEvaluationReport(
      UtilityLabelResolver.scoreBatchObjectLabels, // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-LOGIC ---- UtilityLabelResolver.scoreObjectLabels,
      entityLabels,
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap,
      this.ambiguousClosenessThreshold,
      this.lowConfidenceScoreThreshold,
      this.multiLabelPredictionThreshold,
      this.unknownLabelPredictionThreshold,
      Utility.createEmptyLabelObjectUnknownSpuriousLabelsStructure());
    Utility.debuggingLog('OrchestratorPredict.commandLetV(), finished calling Utility.generateEvaluationReport()');
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce analysis report output files.
    Utility.debuggingLog('OrchestratorPredict.commandLetV(), ready to call Utility.generateEvaluationReportFiles()');
    let evaluationSummaryEntity: string =
      this.currentEntityEvaluationOutput.evaluationReportAnalyses.evaluationSummary;
    evaluationSummaryEntity = evaluationSummaryEntity.replace(
      '{APP_NAME}',
      '');
    evaluationSummaryEntity = evaluationSummaryEntity.replace(
      '{MODEL_SPECIFICATION}',
      '');
    // -----------------------------------------------------------------------
    Utility.generateEvaluationReportFiles(
      this.currentEntityEvaluationOutput.evaluationReportLabelUtteranceStatistics.labelArrayAndMap.stringArray,
      this.currentEntityEvaluationOutput.scoreOutputLines,
      this.currentEntityEvaluationOutput.groundTruthJsonContent,
      this.currentEntityEvaluationOutput.predictionJsonContent,
      evaluationSummaryEntity,
      this.getPredictingSetEntityLabelsOutputFilename(),
      this.getPredictingSetEntityScoreOutputFilename(),
      this.getPredictingSetEntityGroundTruthJsonContentOutputFilename(),
      this.getPredictingSetEntityPredictionJsonContentOutputFilename(),
      this.getPredictingSetEntitySummaryOutputFilename());
    Utility.debuggingLog('OrchestratorPredict.commandLetV(), finished calling Utility.generateEvaluationReportFiles()');
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`this.currentEntityEvaluationOutput=${Utility.jsonStringify(this.currentEntityEvaluationOutput)}`);
    }
    // -----------------------------------------------------------------------
    console.log(`> Leave-one-out cross validation is done and reports generated in '${this.predictingSetIntentSummaryOutputFilename}' and '${this.predictingSetEntitySummaryOutputFilename}'`);
    return 0;
  }

  public async commandLetVD(question: any): Promise<number> {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVD`, {commandLet: 'commandLetVD'});
    } catch (error) {
    }
    return this.commandLetVDwithEntry(await question(OrchestratorPredict.questionForUtteranceLabelsFromDuplicates));
  }

  public commandLetVDwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVDwithEntry`, {commandLet: 'commandLetVDwithEntry'});
    } catch (error) {
    }
    if (!this.currentIntentEvaluationOutput) {
      console.log('ERROR: There is no validation report, please use the "v" command to create one');
      return -1;
    }
    const labelUtterancesTotal: number =
    this.currentIntentEvaluationOutput.evaluationReportLabelUtteranceStatistics.labelStatisticsAndHtmlTable.labelUtterancesTotal;
    if (labelUtterancesTotal <= 0) {
      console.log('ERROR: There is no examples or there is no validation report, please use the "v" command to create one');
      return -2;
    }
    const utterancesMultiLabelArrays: StructTextText[] =
    this.currentIntentEvaluationOutput.evaluationReportLabelUtteranceStatistics.utterancesMultiLabelArrays;
    let indexInput: string = entry;
    indexInput = indexInput.trim();
    if (Utility.isEmptyString(indexInput)) {
      console.log('ERROR: Please enter an integer index to access the validation Duplicates entry');
      return -3;
    }
    if (Number.isInteger(Number(indexInput))) {
      const index: number = Number(indexInput);
      // eslint-disable-next-line max-depth
      if ((index < 0) || (index >= utterancesMultiLabelArrays.length)) {
        const errorMessage: string =
          ` The index "${index}" you entered is not in range, the array length is: ${utterancesMultiLabelArrays.length}`;
        console.log(`ERROR: ${errorMessage}`);
        return -4;
      }
      this.currentUtterance = utterancesMultiLabelArrays[index].textFirst;
      this.currentIntentLabels = utterancesMultiLabelArrays[index].textSecond.split(',');
    } else {
      console.log('> Please enter an integer index to access the validation Duplicates entry');
      return -5;
    }
    return 0;
  }

  public async commandLetVA(question: any): Promise<number> {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVA`, {commandLet: 'commandLetVA'});
    } catch (error) {
    }
    return this.commandLetVAwithEntry(await question(OrchestratorPredict.questionForUtteranceLabelsFromAmbiguous));
  }

  public commandLetVAwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVAwithEntry`, {commandLet: 'commandLetVAwithEntry'});
    } catch (error) {
    }
    if (!this.currentIntentEvaluationOutput) {
      console.log('ERROR: There is no validation report, please use the "v" command to create one');
      return -1;
    }
    const labelUtterancesTotal: number =
    this.currentIntentEvaluationOutput.evaluationReportLabelUtteranceStatistics.labelStatisticsAndHtmlTable.labelUtterancesTotal;
    if (labelUtterancesTotal <= 0) {
      console.log('ERROR: There is no examples or there is no validation report, please use the "v" command to create one');
      return -2;
    }
    const scoringAmbiguousUtterancesSimpleArrays: string[][] =
    this.currentIntentEvaluationOutput.evaluationReportAnalyses.ambiguousAnalysis.scoringAmbiguousUtteranceSimpleArrays;
    let indexInput: string = entry;
    indexInput = indexInput.trim();
    if (Utility.isEmptyString(indexInput)) {
      console.log('ERROR: Please enter an integer index to access the validation Ambiguous entry');
      return -3;
    }
    if (Number.isInteger(Number(indexInput))) {
      const index: number = Number(indexInput);
      // eslint-disable-next-line max-depth
      if ((index < 0) || (index >= scoringAmbiguousUtterancesSimpleArrays.length)) {
        const errorMessage: string =
          ` The index "${index}" you entered is not in range, the array length is: ${scoringAmbiguousUtterancesSimpleArrays.length}`;
        console.log(`ERROR: ${errorMessage}`);
        return -4;
      }
      this.currentUtterance = scoringAmbiguousUtterancesSimpleArrays[index][0];
      this.currentIntentLabels = scoringAmbiguousUtterancesSimpleArrays[index][1].split(',');
    } else {
      console.log('ERROR: Please enter an integer index to access the validation Ambiguous entry');
      return -5;
    }
    return 0;
  }

  public async commandLetVM(question: any): Promise<number> {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVM`, {commandLet: 'commandLetVM'});
    } catch (error) {
    }
    return this.commandLetVMwithEntry(await question(OrchestratorPredict.questionForUtteranceLabelsFromMisclassified));
  }

  public commandLetVMwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVMwithEntry`, {commandLet: 'commandLetVMwithEntry'});
    } catch (error) {
    }
    if (!this.currentIntentEvaluationOutput) {
      console.log('ERROR: There is no validation report, please use the "v" command to create one');
      return -1;
    }
    const labelUtterancesTotal: number =
    this.currentIntentEvaluationOutput.evaluationReportLabelUtteranceStatistics.labelStatisticsAndHtmlTable.labelUtterancesTotal;
    if (labelUtterancesTotal <= 0) {
      console.log('ERROR: There is no examples or there is no validation report, please use the "v" command to create one');
      return -2;
    }
    const scoringMisclassifiedUtterancesSimpleArrays: string[][] =
    this.currentIntentEvaluationOutput.evaluationReportAnalyses.misclassifiedAnalysis.scoringMisclassifiedUtterancesSimpleArrays;
    let indexInput: string = entry;
    indexInput = indexInput.trim();
    if (Utility.isEmptyString(indexInput)) {
      console.log('ERROR: Please enter an integer index to access the validation Misclassified entry');
      return -3;
    }
    if (Number.isInteger(Number(indexInput))) {
      const index: number = Number(indexInput);
      // eslint-disable-next-line max-depth
      if ((index < 0) || (index >= scoringMisclassifiedUtterancesSimpleArrays.length)) {
        const errorMessage: string =
          ` The index "${index}" you entered is not in range, the array length is: ${scoringMisclassifiedUtterancesSimpleArrays.length}`;
        console.log(`ERROR: ${errorMessage}`);
        return -4;
      }
      this.currentUtterance = scoringMisclassifiedUtterancesSimpleArrays[index][0];
      this.currentIntentLabels = scoringMisclassifiedUtterancesSimpleArrays[index][1].split(',');
    } else {
      console.log('ERROR: Please enter an integer index to access the validation Misclassified entry');
      return -5;
    }
    return 0;
  }

  public async commandLetVL(question: any): Promise<number> {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVL`, {commandLet: 'commandLetVL'});
    } catch (error) {
    }
    return this.commandLetVLwithEntry(await question(OrchestratorPredict.questionForUtteranceLabelsFromLowConfidence));
  }

  public commandLetVLwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVLwithEntry`, {commandLet: 'commandLetVLwithEntry'});
    } catch (error) {
    }
    if (!this.currentIntentEvaluationOutput) {
      console.log('ERROR: There is no validation report, please use the "v" command to create one');
      return -1;
    }
    const labelUtterancesTotal: number =
    this.currentIntentEvaluationOutput.evaluationReportLabelUtteranceStatistics.labelStatisticsAndHtmlTable.labelUtterancesTotal;
    if (labelUtterancesTotal <= 0) {
      console.log('ERROR: There is no examples or there is no validation report, please use the "v" command to create one');
      return -2;
    }
    const scoringLowConfidenceUtterancesSimpleArrays: string[][] =
    this.currentIntentEvaluationOutput.evaluationReportAnalyses.lowConfidenceAnalysis.scoringLowConfidenceUtterancesSimpleArrays;
    let indexInput: string = entry;
    indexInput = indexInput.trim();
    if (Utility.isEmptyString(indexInput)) {
      console.log('ERROR: Please enter an integer index to access the validation LowConfidence entry');
      return -3;
    }
    if (Number.isInteger(Number(indexInput))) {
      const index: number = Number(indexInput);
      // eslint-disable-next-line max-depth
      if ((index < 0) || (index >= scoringLowConfidenceUtterancesSimpleArrays.length)) {
        const errorMessage: string =
          ` The index "${index}" you entered is not in range, the array length is: ${scoringLowConfidenceUtterancesSimpleArrays.length}`;
        console.log(`ERROR: ${errorMessage}`);
        return -4;
      }
      this.currentUtterance = scoringLowConfidenceUtterancesSimpleArrays[index][0];
      this.currentIntentLabels = scoringLowConfidenceUtterancesSimpleArrays[index][1].split(',');
    } else {
      console.log('ERROR: Please enter an integer index to access the validation LowConfidence entry');
      return -5;
    }
    return 0;
  }

  public async commandLetVAT(question: any): Promise<number> {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVAT`, {commandLet: 'commandLetVAT'});
    } catch (error) {
    }
    return this.commandLetVATwithEntry(await question(OrchestratorPredict.questionForAmbiguousThreshold));
  }

  public commandLetVATwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVATwithEntry`, {commandLet: 'commandLetVATwithEntry'});
    } catch (error) {
    }
    const ambiguousClosenessThresholdParameter: string = entry;
    const ambiguousClosenessThreshold: number = Number(ambiguousClosenessThresholdParameter);
    if (Number.isNaN(ambiguousClosenessThreshold)) {
      Utility.debuggingLog(`The input "${ambiguousClosenessThresholdParameter}" is not a number.`);
      return -1;
    }
    this.ambiguousClosenessThreshold = ambiguousClosenessThreshold;
    return 0;
  }

  public async commandLetVLT(question: any): Promise<number> {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVLT`, {commandLet: 'commandLetVLT'});
    } catch (error) {
    }
    return this.commandLetVLTwithEntry(await question(OrchestratorPredict.questionForLowConfidenceThreshold));
  }

  public commandLetVLTwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVLTwithEntry`, {commandLet: 'commandLetVLTwithEntry'});
    } catch (error) {
    }
    const lowConfidenceScoreThresholdParameter: string = entry;
    const lowConfidenceScoreThreshold: number = Number(lowConfidenceScoreThresholdParameter);
    if (Number.isNaN(lowConfidenceScoreThreshold)) {
      Utility.debuggingLog(`The input "${lowConfidenceScoreThresholdParameter}" is not a number.`);
      return -1;
    }
    this.lowConfidenceScoreThreshold = lowConfidenceScoreThreshold;
    return 0;
  }

  public async commandLetVMT(question: any): Promise<number> {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVMT`, {commandLet: 'commandLetVMT'});
    } catch (error) {
    }
    return this.commandLetVMTwithEntry(await question(OrchestratorPredict.questionForMultiLabelPredictionThreshold));
  }

  public commandLetVMTwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVMTwithEntry`, {commandLet: 'commandLetVMTwithEntry'});
    } catch (error) {
    }
    const multiLabelPredictionThresholdParameter: string = entry;
    const multiLabelPredictionThreshold: number = Number(multiLabelPredictionThresholdParameter);
    if (Number.isNaN(multiLabelPredictionThreshold)) {
      Utility.debuggingLog(`The input "${multiLabelPredictionThresholdParameter}" is not a number.`);
      return -1;
    }
    this.multiLabelPredictionThreshold = multiLabelPredictionThreshold;
    return 0;
  }

  public async commandLetVUT(question: any): Promise<number> {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVUT`, {commandLet: 'commandLetVUT'});
    } catch (error) {
    }
    return this.commandLetVUTwithEntry(await question(OrchestratorPredict.questionForUnknownLabelPredictionThreshold));
  }

  public commandLetVUTwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVUTwithEntry`, {commandLet: 'commandLetVUTwithEntry'});
    } catch (error) {
    }
    const unknownLabelPredictionThresholdParameter: string = entry;
    const unknownLabelPredictionThreshold: number = Number(unknownLabelPredictionThresholdParameter);
    if (Number.isNaN(unknownLabelPredictionThreshold)) {
      Utility.debuggingLog(`The input "${unknownLabelPredictionThresholdParameter}" is not a number.`);
      return -1;
    }
    this.unknownLabelPredictionThreshold = unknownLabelPredictionThreshold;
    return 0;
  }

  public async commandLetVO(question: any): Promise<number> {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVO`, {commandLet: 'commandLetVO'});
    } catch (error) {
    }
    return this.commandLetVOwithEntry(await question(OrchestratorPredict.questionForObfuscateEvaluationReport));
  }

  public commandLetVOwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetVOwithEntry`, {commandLet: 'commandLetVOwithEntry'});
    } catch (error) {
    }
    const obfuscateEvaluationReportParameter: string = entry;
    const obfuscateEvaluationReport: boolean = UtilityDispatcher.toBoolean(obfuscateEvaluationReportParameter);
    this.obfuscateEvaluationReport = obfuscateEvaluationReport;
    return 0;
  }

  public commandLetA(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetA`, {commandLet: 'commandLetA'});
    } catch (error) {
    }
    const example: Example = Example.newIntentExample(
      this.currentUtterance,
      this.currentIntentLabels);
    const exampleObject: any = example.toAlternateObject();
    Utility.debuggingLog(`exampleObject=${Utility.jsonStringify(exampleObject)}`);
    const rvAddExample: any = LabelResolver.addExample(exampleObject);
    Utility.debuggingLog(`rv=${rvAddExample}`);
    if (!rvAddExample) {
      console.log(`ERROR: There is an error, the example was not added, example: ${Utility.jsonStringify(exampleObject)}`);
      return -1;
    }
    console.log(`> Utterance '${this.currentUtterance}' has been added to '${Utility.jsonStringify(this.currentIntentLabels)}'`);
    return 0;
  }

  public commandLetR(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetR`, {commandLet: 'commandLetR'});
    } catch (error) {
    }
    const example: Example = Example.newIntentExample(
      this.currentUtterance,
      this.currentIntentLabels);
    const exampleObject: any = example.toAlternateObject();
    Utility.debuggingLog(`exampleObject=${Utility.jsonStringify(exampleObject)}`);
    const rvRemoveExample: any = LabelResolver.removeExample(exampleObject);
    Utility.debuggingLog(`rv=${rvRemoveExample}`);
    if (!rvRemoveExample) {
      console.log(`ERROR: There is an error, the example was not removed, example: ${Utility.jsonStringify(exampleObject)}`);
      return -1;
    }
    console.log(`> Utterance '${this.currentUtterance}' has been removed from '${Utility.jsonStringify(this.currentIntentLabels)}'`);
    return 0;
  }

  public commandLetC(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetC`, {commandLet: 'commandLetC'});
    } catch (error) {
    }
    const exampleToRemove: Example = Example.newIntentExample(
      this.currentUtterance,
      this.currentIntentLabels);
    const exampleObjectToRemove: any = exampleToRemove.toAlternateObject();
    Utility.debuggingLog(`exampleObjectToRemove=${Utility.jsonStringify(exampleObjectToRemove)}`);
    const rvRemoveExample: any = LabelResolver.removeExample(exampleObjectToRemove);
    Utility.debuggingLog(`rvRemoveExample=${rvRemoveExample}`);
    if (!rvRemoveExample) {
      console.log(`ERROR: There is an error, the example was not removed, example: ${Utility.jsonStringify(exampleObjectToRemove)}`);
      return -1;
    }
    const exampleToAdd: Example = Example.newIntentExample(
      this.currentUtterance,
      this.newIntentLabels);
    const exampleObjectToAdd: any = exampleToAdd.toAlternateObject();
    Utility.debuggingLog(`exampleObjectToAdd=${Utility.jsonStringify(exampleObjectToAdd)}`);
    const rvAddExample: any = LabelResolver.addExample(exampleObjectToAdd);
    Utility.debuggingLog(`rvAddExample=${rvAddExample}`);
    if (!rvAddExample) {
      console.log(`ERROR: There is an error, the example was not added, example: ${Utility.jsonStringify(exampleObjectToAdd)}`);
      return -2;
    }
    console.log(`> Utterance '${this.currentUtterance}' has been moved from '${Utility.jsonStringify(this.currentIntentLabels)}' to '${Utility.jsonStringify(this.newIntentLabels)}'`);
    return 0;
  }

  public commandLetRL(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetRL`, {commandLet: 'commandLetRL'});
    } catch (error) {
    }
    if (Utility.isEmptyStringArray(this.currentIntentLabels)) {
      console.log('ERROR: "Current" intent label array is empty.');
      return -1;
    }
    for (const label of this.currentIntentLabels) {
      const rvRemoveLabel: any = LabelResolver.removeLabel(label);
      if (!rvRemoveLabel) {
        console.log(`ERROR: Failed to remove label: '${label}'`);
        return -1;
      }
    }
    console.log(`> Labels '${this.currentIntentLabels}' have been removed from the model.`);
    return 0;
  }

  public commandLetN(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}:commandLetN`, {commandLet: 'commandLetN'});
    } catch (error) {
    }
    const snapshot: any = LabelResolver.createSnapshot();
    Utility.dumpFile(this.getPredictingSetIntentSnapshotFilename(), snapshot);
    Utility.debuggingLog(`Snapshot written to ${this.getPredictingSetIntentSnapshotFilename()}`);
    console.log(`> A new snapshot has been saved to '${this.getPredictingSetIntentSnapshotFilename()}'`);
    return 0;
  }
}
