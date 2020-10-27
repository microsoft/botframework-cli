/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';

import * as readline from 'readline';

import {DictionaryMapUtility, IConfusionMatrix} from '@microsoft/bf-dispatcher';
import {MultiLabelObjectConfusionMatrixExact} from '@microsoft/bf-dispatcher';
import {MultiLabelObjectConfusionMatrixSubset} from '@microsoft/bf-dispatcher';

import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';

import {Example} from './example';
// import {Label} from './label';
import {LabelType} from './labeltype';
// import {OrchestratorHelper} from './orchestratorhelper';
// import {Result} from './result';
import {PredictionScoreStructure} from './predictionscorestructure';
// import {Span} from './span';

import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';

import {Utility} from './utility';
import {UtilityLabelResolver} from './utilitylabelresolver';

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

  protected cliCmmandId: string = '';

  protected trackEventFunction: any;

  protected ambiguousClosenessThreshold: number = Utility.DefaultAmbiguousClosenessThresholdParameter;

  protected lowConfidenceScoreThreshold: number = Utility.DefaultLowConfidenceScoreThresholdParameter;

  protected multiLabelPredictionThreshold: number = Utility.DefaultMultiLabelPredictionThresholdParameter;

  protected unknownLabelPredictionThreshold: number = Utility.DefaultUnknownLabelPredictionThresholdParameter;

  protected fullEmbeddings: boolean = false;

  protected obfuscateEvaluationReport: boolean = false;

  protected snapshotFile: string = '';

  protected predictingSetGroundTruthJsonContentOutputFilename: string = '';

  protected predictingSetPredictionJsonContentOutputFilename: string = '';

  protected predictingSetScoreOutputFilename: string = '';

  protected predictingSetSummaryOutputFilename: string = '';

  protected predictingLabelsOutputFilename: string = '';

  protected predictingSetSnapshotFilename: string = '';

  // ---- NOTE-REFACTOR-LATER ---- protected labelResolver: any;

  protected currentUtterance: string = '';

  protected currentIntentLabels: string[] = [];

  protected newIntentLabels: string[] = [];

  protected currentLabelArrayAndMap: {
    'stringArray': string[];
    'stringMap': Map<string, number>;} = {
      stringArray: [],
      stringMap: new Map<string, number>()};

  protected currentUtteranceLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();

  protected currentUtteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();

  protected currentEvaluationOutput: {
    'evaluationReportLabelUtteranceStatistics': {
      'evaluationSummary': string;
      'labelArrayAndMap': {
        'stringArray': string[];
        'stringMap': Map<string, number>;};
      'labelStatisticsAndHtmlTable': {
        'labelUtterancesMap': Map<string, Set<string>>;
        'labelUtterancesTotal': number;
        'labelStatistics': string[][];
        'labelStatisticsHtml': string;};
      'utteranceStatisticsAndHtmlTable': {
        'utteranceStatisticsMap': Map<number, number>;
        'utteranceStatistics': [string, number][];
        'utteranceCount': number;
        'utteranceStatisticsHtml': string;};
      'utterancesMultiLabelArrays': [string, string][];
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
    'predictionScoreStructureArray': PredictionScoreStructure[];
    'scoreOutputLines': string[][];
    'groundTruthJsonContent': string;
    'predictionJsonContent': string;
  } = Utility.generateEmptyEvaluationReport();

  /* eslint-disable max-params */
  /* eslint-disable complexity */
  constructor(
    baseModelPath: string, inputPath: string, outputPath: string,
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
    Utility.debuggingLog(`inputPath=${inputPath}`);
    Utility.debuggingLog(`outputPath=${outputPath}`);
    Utility.debuggingLog(`baseModelPath=${baseModelPath}`);
    Utility.debuggingLog(`ambiguousClosenessThresholdParameter=${ambiguousClosenessThresholdParameter}`);
    Utility.debuggingLog(`lowConfidenceScoreThresholdParameter=${lowConfidenceScoreThresholdParameter}`);
    Utility.debuggingLog(`multiLabelPredictionThresholdParameter=${multiLabelPredictionThresholdParameter}`);
    Utility.debuggingLog(`unknownLabelPredictionThresholdParameter=${unknownLabelPredictionThresholdParameter}`);
    Utility.debuggingLog(`fullEmbeddings=${fullEmbeddings}`);
    Utility.debuggingLog(`obfuscateEvaluationReport=${obfuscateEvaluationReport}`);
    this.inputPath = inputPath;
    this.outputPath = outputPath;
    this.baseModelPath = baseModelPath;
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
    this.predictingSetGroundTruthJsonContentOutputFilename = path.join(this.outputPath, 'orchestrator_predicting_set_ground_truth._instancesjson');
    this.predictingSetPredictionJsonContentOutputFilename = path.join(this.outputPath, 'orchestrator_predicting_set_prediction_instances.json');
    this.predictingSetScoreOutputFilename = path.join(this.outputPath, 'orchestrator_predicting_set_scores.txt');
    this.predictingSetSummaryOutputFilename = path.join(this.outputPath, 'orchestrator_predicting_set_summary.html');
    this.predictingLabelsOutputFilename = path.join(this.outputPath, 'orchestrator_predicting_set_labels.txt');
    this.predictingSetSnapshotFilename = path.join(this.outputPath, 'orchestrator_predicting_snapshot_set.blu');
  }

  public getPredictingSetGroundTruthJsonContentOutputFilename(): string {
    return this.predictingSetGroundTruthJsonContentOutputFilename;
  }

  public getPredictingSetPredictionJsonContentOutputFilename(): string {
    return this.predictingSetPredictionJsonContentOutputFilename;
  }

  public getPredictingSetScoreOutputFilename(): string {
    return this.predictingSetScoreOutputFilename;
  }

  public getPredictingSetSummaryOutputFilename(): string {
    return this.predictingSetSummaryOutputFilename;
  }

  public getPredictingLabelsOutputFilename(): string {
    return this.predictingLabelsOutputFilename;
  }

  public getPredictingSetSnapshotFilename(): string {
    return this.predictingSetSnapshotFilename;
  }

  public async buildLabelResolver(): Promise<void> {
    // ---- NOTE ---- create a LabelResolver object.
    Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), ready to create a LabelResolver object');
    if (Utility.exists(this.snapshotFile)) {
      // ---- NOTE ---- create a LabelResolver object.
      Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), ready to call LabelResolver.createAsync()');
      await LabelResolver.createAsync(this.baseModelPath,);
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
      await LabelResolver.createAsync(this.baseModelPath);
      Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), after calling LabelResolver.createAsync()');
      Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), ready to call UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
      UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(this.fullEmbeddings);
      Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), after calling UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings()');
    }
    Utility.debuggingLog('OrchestratorPredict.buildLabelResolver(), after creating a LabelResolver object');
  }

  public static async runAsync(
    baseModelPath: string, inputPath: string, outputPath: string,
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
    // ---- NOTE ---- need to dynamically create an 'interactive' object
    // ---- NOTE ---- and call close() when it's not needed, otherwise this resource cannot be
    // ---- NOTE ---- properly disposed of and a unit test on this object will hang.
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {callee: 'commandLetLoop'});
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
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetH'});
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
    console.log(`          "${this.predictingSetSummaryOutputFilename}"`);
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
    console.log(`          "${this.predictingSetSnapshotFilename}"`);
    return 0;
  }

  public displayInputs(): void {
    console.log(`> "Current" utterance:          "${this.currentUtterance}"`);
    console.log(`> "Current" intent label array: "${this.currentIntentLabels}"`);
    console.log(`> "New"     intent label array: "${this.newIntentLabels}"`);
  }

  public commandLetD(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetD'});
    } catch (error) {
    }
    console.log(`> Ambiguous closeness:           ${this.ambiguousClosenessThreshold}`);
    console.log(`> Low-confidence closeness:      ${this.lowConfidenceScoreThreshold}`);
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
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetS'});
    } catch (error) {
    }
    this.currentUtteranceLabelsMap = new Map<string, Set<string>>();
    this.currentUtteranceLabelDuplicateMap = new Map<string, Set<string>>();
    const examples: any = LabelResolver.getExamples();
    if (examples.length <= 0) {
      console.log('> There is no example');
      return -1;
    }
    const labels: string[] = LabelResolver.getLabels(LabelType.Intent);
    // Utility.debuggingLog(`OrchestratorPredict.commandLetS(), labels.length=${labels.length}`);
    // Utility.debuggingLog(`OrchestratorPredict.commandLetS(), labels=${labels}`);
    this.currentLabelArrayAndMap = Utility.buildStringIdNumberValueDictionaryFromStringArray(labels);
    Utility.examplesToUtteranceLabelMaps(
      examples,
      this.currentUtteranceLabelsMap,
      this.currentUtteranceLabelDuplicateMap);
    const labelStatisticsAndHtmlTable: {
      'labelUtterancesMap': Map<string, Set<string>>;
      'labelUtterancesTotal': number;
      'labelStatistics': string[][];
      'labelStatisticsHtml': string;
    } = Utility.generateLabelStatisticsAndHtmlTable(
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
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetU'});
    } catch (error) {
    }
    return this.commandLetUwithEntry(await question(OrchestratorPredict.questionForUtterance));
  }

  public commandLetUwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetUwithEntry'});
    } catch (error) {
    }
    this.currentUtterance = entry;
    return 0;
  }

  public commandLetCU(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetCU'});
    } catch (error) {
    }
    this.currentUtterance = '';
    return 0;
  }

  public async commandLetI(question: any): Promise<number> {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetI'});
    } catch (error) {
    }
    return this.commandLetIwithEntry(await question(OrchestratorPredict.questionForCurrentIntentLabel));
  }

  public commandLetIwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetIwithEntry'});
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
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetCI'});
    } catch (error) {
    }
    this.currentIntentLabels = [];
    return 0;
  }

  public async commandLetNI(question: any): Promise<number> {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetNI'});
    } catch (error) {
    }
    return this.commandLetNIwithEntry(await question(OrchestratorPredict.questionForNewIntentLabel));
  }

  public commandLetNIwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commacommandLetNIwithEntryndLetNI'});
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
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetCNI'});
    } catch (error) {
    }
    this.newIntentLabels = [];
    return 0;
  }

  public commandLetF(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetF'});
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
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetP'});
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
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetV'});
    } catch (error) {
    }
    // ---- NOTE ---- process the snapshot set.
    const labels: string[] = LabelResolver.getLabels(LabelType.Intent);
    const utteranceLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const examples: any = LabelResolver.getExamples();
    if (examples.length <= 0) {
      console.log('ERROR: There is no example in the snapshot set, please add some.');
      return -1;
    }
    Utility.examplesToUtteranceLabelMaps(
      examples,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap);
    // ---- NOTE ---- integrated step to produce analysis reports.
    Utility.toObfuscateLabelTextInReportUtility = this.obfuscateEvaluationReport;
    UtilityLabelResolver.toObfuscateLabelTextInReportUtilityLabelResolver = this.obfuscateEvaluationReport;
    Utility.debuggingLog('OrchestratorPredict.commandLetV(), ready to call UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample("true")');
    UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample(true);
    Utility.debuggingLog('OrchestratorPredict.commandLetV(), finished calling UtilityLabelResolver.resetLabelResolverSettingIgnoreSameExample()');
    Utility.debuggingLog('OrchestratorPredict.commandLetV(), ready to call UtilityLabelResolver.generateEvaluationReport()');
    this.currentEvaluationOutput = Utility.generateEvaluationReport(
      UtilityLabelResolver.score,
      labels,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      this.ambiguousClosenessThreshold,
      this.lowConfidenceScoreThreshold,
      this.multiLabelPredictionThreshold,
      this.unknownLabelPredictionThreshold);
    Utility.debuggingLog('OrchestratorPredict.commandLetV(), finished calling Utility.generateEvaluationReport()');
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce analysis report output files.
    Utility.debuggingLog('OrchestratorTest.runAsync(), ready to call Utility.generateEvaluationReportFiles()');
    let evaluationSummary: string =
      this.currentEvaluationOutput.evaluationReportAnalyses.evaluationSummary;
    evaluationSummary = evaluationSummary.replace(
      '{APP_NAME}',
      '');
    evaluationSummary = evaluationSummary.replace(
      '{MODEL_SPECIFICATION}',
      '');
    // -----------------------------------------------------------------------
    Utility.generateEvaluationReportFiles(
      this.currentEvaluationOutput.evaluationReportLabelUtteranceStatistics.labelArrayAndMap.stringArray,
      this.currentEvaluationOutput.scoreOutputLines,
      this.currentEvaluationOutput.groundTruthJsonContent,
      this.currentEvaluationOutput.predictionJsonContent,
      evaluationSummary,
      this.getPredictingLabelsOutputFilename(),
      this.getPredictingSetScoreOutputFilename(),
      this.getPredictingSetGroundTruthJsonContentOutputFilename(),
      this.getPredictingSetPredictionJsonContentOutputFilename(),
      this.getPredictingSetSummaryOutputFilename());
    Utility.debuggingLog('OrchestratorTest.runAsync(), finished calling Utility.generateEvaluationReportFiles()');
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`this.currentEvaluationOutput=${Utility.jsonStringify(this.currentEvaluationOutput)}`);
    }
    // -----------------------------------------------------------------------
    console.log(`> Leave-one-out cross validation is done and reports generated in '${this.predictingSetSummaryOutputFilename}'`);
    return 0;
  }

  public async commandLetVD(question: any): Promise<number> {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVD'});
    } catch (error) {
    }
    return this.commandLetVDwithEntry(await question(OrchestratorPredict.questionForUtteranceLabelsFromDuplicates));
  }

  public commandLetVDwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVDwithEntry'});
    } catch (error) {
    }
    if (!this.currentEvaluationOutput) {
      console.log('ERROR: There is no validation report, please use the "v" command to create one');
      return -1;
    }
    const labelUtterancesTotal: number =
    this.currentEvaluationOutput.evaluationReportLabelUtteranceStatistics.labelStatisticsAndHtmlTable.labelUtterancesTotal;
    if (labelUtterancesTotal <= 0) {
      console.log('ERROR: There is no examples or there is no validation report, please use the "v" command to create one');
      return -2;
    }
    const utterancesMultiLabelArrays: [string, string][] =
    this.currentEvaluationOutput.evaluationReportLabelUtteranceStatistics.utterancesMultiLabelArrays;
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
      this.currentUtterance = utterancesMultiLabelArrays[index][0];
      this.currentIntentLabels = utterancesMultiLabelArrays[index][1].split(',');
    } else {
      console.log('> Please enter an integer index to access the validation Duplicates entry');
      return -5;
    }
    return 0;
  }

  public async commandLetVA(question: any): Promise<number> {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVA'});
    } catch (error) {
    }
    return this.commandLetVAwithEntry(await question(OrchestratorPredict.questionForUtteranceLabelsFromAmbiguous));
  }

  public commandLetVAwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVAwithEntry'});
    } catch (error) {
    }
    if (!this.currentEvaluationOutput) {
      console.log('ERROR: There is no validation report, please use the "v" command to create one');
      return -1;
    }
    const labelUtterancesTotal: number =
    this.currentEvaluationOutput.evaluationReportLabelUtteranceStatistics.labelStatisticsAndHtmlTable.labelUtterancesTotal;
    if (labelUtterancesTotal <= 0) {
      console.log('ERROR: There is no examples or there is no validation report, please use the "v" command to create one');
      return -2;
    }
    const scoringAmbiguousUtterancesSimpleArrays: string[][] =
    this.currentEvaluationOutput.evaluationReportAnalyses.ambiguousAnalysis.scoringAmbiguousUtteranceSimpleArrays;
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
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVM'});
    } catch (error) {
    }
    return this.commandLetVMwithEntry(await question(OrchestratorPredict.questionForUtteranceLabelsFromMisclassified));
  }

  public commandLetVMwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVMwithEntry'});
    } catch (error) {
    }
    if (!this.currentEvaluationOutput) {
      console.log('ERROR: There is no validation report, please use the "v" command to create one');
      return -1;
    }
    const labelUtterancesTotal: number =
    this.currentEvaluationOutput.evaluationReportLabelUtteranceStatistics.labelStatisticsAndHtmlTable.labelUtterancesTotal;
    if (labelUtterancesTotal <= 0) {
      console.log('ERROR: There is no examples or there is no validation report, please use the "v" command to create one');
      return -2;
    }
    const scoringMisclassifiedUtterancesSimpleArrays: string[][] =
    this.currentEvaluationOutput.evaluationReportAnalyses.misclassifiedAnalysis.scoringMisclassifiedUtterancesSimpleArrays;
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
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVL'});
    } catch (error) {
    }
    return this.commandLetVLwithEntry(await question(OrchestratorPredict.questionForUtteranceLabelsFromLowConfidence));
  }

  public commandLetVLwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVLwithEntry'});
    } catch (error) {
    }
    if (!this.currentEvaluationOutput) {
      console.log('ERROR: There is no validation report, please use the "v" command to create one');
      return -1;
    }
    const labelUtterancesTotal: number =
    this.currentEvaluationOutput.evaluationReportLabelUtteranceStatistics.labelStatisticsAndHtmlTable.labelUtterancesTotal;
    if (labelUtterancesTotal <= 0) {
      console.log('ERROR: There is no examples or there is no validation report, please use the "v" command to create one');
      return -2;
    }
    const scoringLowConfidenceUtterancesSimpleArrays: string[][] =
    this.currentEvaluationOutput.evaluationReportAnalyses.lowConfidenceAnalysis.scoringLowConfidenceUtterancesSimpleArrays;
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
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVAT'});
    } catch (error) {
    }
    return this.commandLetVATwithEntry(await question(OrchestratorPredict.questionForAmbiguousThreshold));
  }

  public commandLetVATwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVATwithEntry'});
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
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVLT'});
    } catch (error) {
    }
    return this.commandLetVLTwithEntry(await question(OrchestratorPredict.questionForLowConfidenceThreshold));
  }

  public commandLetVLTwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVLTwithEntry'});
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
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVMT'});
    } catch (error) {
    }
    return this.commandLetVMTwithEntry(await question(OrchestratorPredict.questionForMultiLabelPredictionThreshold));
  }

  public commandLetVMTwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVMTwithEntry'});
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
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVUT'});
    } catch (error) {
    }
    return this.commandLetVUTwithEntry(await question(OrchestratorPredict.questionForUnknownLabelPredictionThreshold));
  }

  public commandLetVUTwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVUTwithEntry'});
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
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVO'});
    } catch (error) {
    }
    return this.commandLetVOwithEntry(await question(OrchestratorPredict.questionForObfuscateEvaluationReport));
  }

  public commandLetVOwithEntry(entry: string): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetVOwithEntry'});
    } catch (error) {
    }
    const obfuscateEvaluationReportParameter: string = entry;
    const obfuscateEvaluationReport: boolean = UtilityDispatcher.toBoolean(obfuscateEvaluationReportParameter);
    this.obfuscateEvaluationReport = obfuscateEvaluationReport;
    return 0;
  }

  public commandLetA(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetA'});
    } catch (error) {
    }
    const example: Example = Example.newIntentExample(
      this.currentUtterance,
      this.currentIntentLabels);
    const exampleObejct: any = example.toObject();
    Utility.debuggingLog(`exampleObejct=${Utility.jsonStringify(exampleObejct)}`);
    const rvAddExample: any = LabelResolver.addExample(exampleObejct);
    Utility.debuggingLog(`rv=${rvAddExample}`);
    if (!rvAddExample) {
      console.log(`ERROR: There is an error, the example was not added, example: ${Utility.jsonStringify(exampleObejct)}`);
      return -1;
    }
    console.log(`> Utterance '${this.currentUtterance}' has been added to '${Utility.jsonStringify(this.currentIntentLabels)}'`);
    return 0;
  }

  public commandLetR(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetR'});
    } catch (error) {
    }
    const example: Example = Example.newIntentExample(
      this.currentUtterance,
      this.currentIntentLabels);
    const exampleObejct: any = example.toObject();
    Utility.debuggingLog(`exampleObejct=${Utility.jsonStringify(exampleObejct)}`);
    const rvRemoveExample: any = LabelResolver.removeExample(exampleObejct);
    Utility.debuggingLog(`rv=${rvRemoveExample}`);
    if (!rvRemoveExample) {
      console.log(`ERROR: There is an error, the example was not removed, example: ${Utility.jsonStringify(exampleObejct)}`);
      return -1;
    }
    console.log(`> Utterance '${this.currentUtterance}' has been removed from '${Utility.jsonStringify(this.currentIntentLabels)}'`);
    return 0;
  }

  public commandLetC(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetC'});
    } catch (error) {
    }
    const exampleToRemove: Example = Example.newIntentExample(
      this.currentUtterance,
      this.currentIntentLabels);
    const exampleObejctToRemove: any = exampleToRemove.toObject();
    Utility.debuggingLog(`exampleObejctToRemove=${Utility.jsonStringify(exampleObejctToRemove)}`);
    const rvRemoveExample: any = LabelResolver.removeExample(exampleObejctToRemove);
    Utility.debuggingLog(`rvRemoveExample=${rvRemoveExample}`);
    if (!rvRemoveExample) {
      console.log(`ERROR: There is an error, the example was not removed, example: ${Utility.jsonStringify(exampleObejctToRemove)}`);
      return -1;
    }
    const exampleToAdd: Example = Example.newIntentExample(
      this.currentUtterance,
      this.newIntentLabels);
    const exampleObejctToAdd: any = exampleToAdd.toObject();
    Utility.debuggingLog(`exampleObejctToAdd=${Utility.jsonStringify(exampleObejctToAdd)}`);
    const rvAddExample: any = LabelResolver.addExample(exampleObejctToAdd);
    Utility.debuggingLog(`rvAddExample=${rvAddExample}`);
    if (!rvAddExample) {
      console.log(`ERROR: There is an error, the example was not added, example: ${Utility.jsonStringify(exampleObejctToAdd)}`);
      return -2;
    }
    console.log(`> Utterance '${this.currentUtterance}' has been moved from '${Utility.jsonStringify(this.currentIntentLabels)}' to '${Utility.jsonStringify(this.newIntentLabels)}'`);
    return 0;
  }

  public commandLetRL(): number {
    try {
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetRL'});
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
      this.trackEventFunction(`${this.cliCmmandId}`, {commandLet: 'commandLetN'});
    } catch (error) {
    }
    const snapshot: any = LabelResolver.createSnapshot();
    Utility.dumpFile(this.getPredictingSetSnapshotFilename(), snapshot);
    Utility.debuggingLog(`Snapshot written to ${this.getPredictingSetSnapshotFilename()}`);
    console.log(`> A new snapshot has been saved to '${this.getPredictingSetSnapshotFilename()}'`);
    return 0;
  }
}
