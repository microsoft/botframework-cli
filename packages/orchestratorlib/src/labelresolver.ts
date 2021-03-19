/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';

import {Label} from '@microsoft/bf-dispatcher';
import {LabelType} from '@microsoft/bf-dispatcher';
import {LabelStructureUtility} from '@microsoft/bf-dispatcher';

import {OrchestratorHelper} from './orchestratorhelper';

import {Utility} from './utility';
import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';

const oc: any = require('orchestrator-core');

export class LabelResolver {
  public static Orchestrator: any;

  public static LabelResolver: any;

  public static async loadNlrAsync(baseModelPath: string, entityBaseModelPath: string = '') {
    Utility.debuggingLog('LabelResolver.loadNlrAsync(): creating Orchestrator.');
    Utility.debuggingLog(`LabelResolver.loadNlrAsync(): baseModelPath=${baseModelPath}`);
    Utility.debuggingLog(`LabelResolver.loadNlrAsync(): entityBaseModelPath=${entityBaseModelPath}`);
    if (baseModelPath) {
      baseModelPath = path.resolve(baseModelPath);
    }
    if (entityBaseModelPath) {
      entityBaseModelPath = path.resolve(entityBaseModelPath);
    }
    Utility.debuggingLog(`LabelResolver.loadNlrAsync(): baseModelPath-resolved=${baseModelPath}`);
    Utility.debuggingLog(`LabelResolver.loadNlrAsync(): entityBaseModelPath-resolved=${entityBaseModelPath}`);
    const hasBaseModel: boolean = !Utility.isEmptyString(baseModelPath);
    const hasEntityBaseModel: boolean = !Utility.isEmptyString(entityBaseModelPath);
    LabelResolver.Orchestrator = new oc.Orchestrator();
    if (hasBaseModel) {
      if (hasEntityBaseModel) {
        Utility.debuggingLog('LabelResolver.loadNlrAsync(): loading intent and entity base model');
        if (await LabelResolver.Orchestrator.loadAsync(baseModelPath, entityBaseModelPath) === false) {
          throw new Error(`Failed calling LabelResolver.Orchestrator.loadAsync("${baseModelPath}, ${entityBaseModelPath}")!`);
        }
      } else {
        Utility.debuggingLog('LabelResolver.loadNlrAsync(): loading intent base model');
        if (await LabelResolver.Orchestrator.loadAsync(baseModelPath) === false) {
          throw new Error(`Failed calling LabelResolver.Orchestrator.loadAsync("${baseModelPath}")!`);
        }
      }
    } else if (LabelResolver.Orchestrator.load() === false) {
      Utility.debuggingLog('LabelResolver.loadNlrAsync(): no intent or entity base model');
      throw new Error('Failed calling LabelResolver.Orchestrator.load()!');
    }
    Utility.debuggingLog('LabelResolver.loadNlrAsync(): leaving.');
    return LabelResolver.Orchestrator;
  }

  public static createLabelResolver() {
    return LabelResolver.Orchestrator.createLabelResolver();
  }

  public static async createAsync(baseModelPath: string, entityBaseModelPath: string = '') {
    Utility.debuggingLog(`LabelResolver.createAsync(): baseModelPath=${baseModelPath}, entityBaseModelPath=${entityBaseModelPath}`);
    const hasEntityBaseModel: boolean = !Utility.isEmptyString(entityBaseModelPath);
    if (hasEntityBaseModel) {
      await LabelResolver.loadNlrAsync(baseModelPath, entityBaseModelPath);
    } else {
      await LabelResolver.loadNlrAsync(baseModelPath);
    }
    Utility.debuggingLog('LabelResolver.createAsync(): Creating label resolver.');
    LabelResolver.LabelResolver = LabelResolver.Orchestrator.createLabelResolver();
    Utility.debuggingLog('LabelResolver.createAsync(): Finished creating label resolver.');
    return LabelResolver.LabelResolver;
  }

  public static async createWithSnapshotFileAsync(baseModelPath: string, snapshotPath: string, entityBaseModelPath: string = '') {
    Utility.debuggingLog('LabelResolver.createWithSnapshotAsync(): loading a snapshot.');
    const snapshot: Uint8Array = OrchestratorHelper.getSnapshotFromFile(snapshotPath);
    return LabelResolver.createWithSnapshotAsync(baseModelPath, snapshot, entityBaseModelPath);
  }

  public static async createWithSnapshotAsync(baseModelPath: string, snapshot: Uint8Array, entityBaseModelPath: string = '') {
    Utility.debuggingLog(`LabelResolver.createWithSnapshotAsync(): baseModelPath=${baseModelPath}, entityBaseModelPath=${entityBaseModelPath}`);
    await LabelResolver.loadNlrAsync(baseModelPath, entityBaseModelPath);
    Utility.debuggingLog(`LabelResolver.createWithSnapshotAsync(): typeof(snapshot)=${typeof snapshot}`);
    Utility.debuggingLog(`LabelResolver.createWithSnapshotAsync(): snapshot.byteLength=${snapshot.byteLength}`);
    Utility.debuggingLog('LabelResolver.createWithSnapshotAsync(): creating label resolver.');
    LabelResolver.LabelResolver = await LabelResolver.Orchestrator.createLabelResolver(snapshot);
    if (!LabelResolver.LabelResolver) {
      throw new Error('FAILED to create a LabelResolver object');
    }
    Utility.debuggingLog('LabelResolver.createWithSnapshotAsync(): finished creating label resolver.');
    return LabelResolver.LabelResolver;
  }

  public static createSnapshot(labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.createSnapshot();
  }

  public static addSnapshot(snapshot: any, prefix: string = '', labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.addSnapshot(snapshot, prefix);
  }

  public static addExample(example: any, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.addExample(example);
  }

  public static removeExample(example: any, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.removeExample(example);
  }

  public static removeLabel(label: string, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.removeLabel(label);
  }

  public static getExamples(labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.getExamples();
  }

  public static getExamplesWithLabelName(labelName: string, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.getExamples(labelName);
  }

  public static getExamplesWithLabelType(labelType: LabelType, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    const labelTypeInNumber: number = LabelStructureUtility.labelTypeToNumber(labelType);
    Utility.debuggingLog(`LabelResolver.getExamplesWithLabelType(), labelTypeInNumber=${labelTypeInNumber}`);
    return labelResolver.getExamples(labelTypeInNumber);
  }

  public static getLabels(labelType: LabelType, labelResolver: any = null) {
    Utility.debuggingLog('CALLING LabelResolver.getLabels()');
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    Utility.debuggingLog('LabelResolver.getLabels(), after calling LabelResolver.ensureLabelResolver()');
    Utility.debuggingLog(`LabelResolver.getLabels(), labelResolver=${labelResolver}`);
    const labels: any = labelResolver.getLabels(labelType);
    Utility.debuggingLog(`LabelResolver.getLabels(), labels=${labels}`);
    Utility.debuggingLog('LEAVING LabelResolver.getLabels()');
    return labels;
  }

  public static score(utterance: string, labelType: LabelType, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.score(utterance, labelType);
  }

  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ---- public static scoreBatch(utterances: string[], labelType: LabelType, labelResolver: any = null) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   return labelResolver.scoreBatch(utterances, labelType);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ---- }

  public static getConfigJson(labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.getConfigJson();
  }

  public static setRuntimeParams(config: string, resetAll: boolean, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.setRuntimeParams(config, resetAll);
  }

  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ---- // eslint-disable-next-line complexity
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ---- public static addBatch(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   utteranceIntentEntityLabels: {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     utteranceLabelsMap: Map<string, Set<string>>;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     utteranceLabelDuplicateMap: Map<string, Set<string>>;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     utteranceEntityLabelsMap: Map<string, Label[]>;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     utteranceEntityLabelDuplicateMap: Map<string, Label[]>; },
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   labelResolver: any = null,
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   addBatchOption: number = 2): any {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   Utility.debuggingLog('CALLING LabelResolver.addBatch()');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   if (labelResolver === null) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     labelResolver = LabelResolver.LabelResolver;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   Utility.debuggingLog(`LabelResolver.addBatch(): utteranceIntentEntityLabels.utteranceLabelsMap.size=${utteranceIntentEntityLabels.utteranceLabelsMap.size}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   Utility.debuggingLog(`LabelResolver.addBatch(): utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   Utility.debuggingLog(`LabelResolver.addBatch(): utteranceIntentEntityLabels.utteranceEntityLabelsMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelsMap.size}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   Utility.debuggingLog(`LabelResolver.addBatch(): utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // -----------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   UtilityDispatcher.debuggingLog('LabelResolver.addBatch(): ready to call LabelResolver.utteranceLabelsToJsonString()');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   const batchJsonified: string = LabelResolver.utteranceLabelsToJsonString(
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     utteranceIntentEntityLabels);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   UtilityDispatcher.debuggingLog('LabelResolver.addBatch(): finished calling LabelResolver.utteranceLabelsToJsonString()');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   if (UtilityDispatcher.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingNamedLog1('LabelResolver.addBatch(): batchJsonified', batchJsonified, 'batchJsonified');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // -----------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   UtilityDispatcher.debuggingNamedLog1('LabelResolver.addBatch(): ready to call TextEncoder().encode()', batchJsonified.length, 'batchJsonified.length');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   const batchUint8Array: Uint8Array =
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.stringToUtf8EncodedUint8Array(batchJsonified);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   UtilityDispatcher.debuggingNamedLog1('LabelResolver.addBatch(): finished calling TextEncoder().encode()', batchJsonified.length, 'batchJsonified.length');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   if (UtilityDispatcher.toPrintDetailedDebuggingLogToConsole) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingLog(`LabelResolver.addBatch(): batchUint8Array=${batchUint8Array}`);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // -----------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   let batchResults: any;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   try {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingNamedLog1('LabelResolver.addBatch(): ready to call labelResolver.addBatch()', addBatchOption, 'addBatchOption');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     batchResults = labelResolver.addBatch(batchUint8Array, '', addBatchOption);
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingNamedLog1('LabelResolver.addBatch(): finished calling labelResolver.addBatch()', batchResults, 'batchResults');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   } catch (error) {
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----     UtilityDispatcher.debuggingNamedThrow1('LabelResolver.addBatch(): Failed adding error:', error, 'error');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   }
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   // -----------------------------------------------------------------------
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   Utility.debuggingLog('LEAVING LabelResolver.addBatch()');
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ----   return batchResults;
  // ==== NOTE-FOR-REFERENCE-ALTERNATIVE-FUTURE-LOGIC ---- }

  // eslint-disable-next-line complexity
  public static utteranceLabelsToJsonString(
    utteranceIntentEntityLabels: {
      utteranceLabelsMap: Map<string, Set<string>>;
      utteranceLabelDuplicateMap: Map<string, Set<string>>;
      utteranceEntityLabelsMap: Map<string, Label[]>;
      utteranceEntityLabelDuplicateMap: Map<string, Label[]>; }): string {
    Utility.debuggingLog('CALLING LabelResolver.utteranceLabelsToJsonString()');
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToJsonString(): utteranceIntentEntityLabels.utteranceLabelsMap.size=${utteranceIntentEntityLabels.utteranceLabelsMap.size}`);
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToJsonString(): utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size}`);
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToJsonString(): utteranceIntentEntityLabels.utteranceEntityLabelsMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelsMap.size}`);
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToJsonString(): utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size}`);
    // -----------------------------------------------------------------------
    const utteranceLabelsMap: Map<string, Set<string>> = utteranceIntentEntityLabels.utteranceLabelsMap;
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToJsonString(): utteranceIntentEntityLabels.utteranceLabelsMap.size=${utteranceIntentEntityLabels.utteranceLabelsMap.size}`);
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToJsonString(): utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size}`);
    let numberUtterancesProcessedUtteranceLabelsMap: number = 0;
    // -----------------------------------------------------------------------
    const utteranceEntityLabelsMap: Map<string, Label[]> = utteranceIntentEntityLabels.utteranceEntityLabelsMap;
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToJsonString(): utteranceIntentEntityLabels.utteranceEntityLabelsMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelsMap.size}`);
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToJsonString(): utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size}`);
    let numberUtterancesProcessedUtteranceEntityLabelsMap: number = 0;
    // -----------------------------------------------------------------------
    // ---- Utility.toPrintDetailedDebuggingLogToConsole = true; // ---- NOTE ---- disable after detailed tracing is done.
    const batchJsonifiedStringArray: string[] = [];
    batchJsonifiedStringArray.push('{"examples": [');
    let isFirstUtterance: boolean = true;
    for (const utterance of utteranceLabelsMap.keys()) {
      if (isFirstUtterance) {
        isFirstUtterance = false;
      } else {
        batchJsonifiedStringArray.push(',');
      }
      batchJsonifiedStringArray.push(`{"text": ${JSON.stringify(utterance)},`);
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`LabelResolver.utteranceLabelsToJsonString(): processing utterance='${utterance}'`);
      }
      batchJsonifiedStringArray.push('"intents": [');
      {
        const labels: Set<string> = utteranceLabelsMap.get(utterance) as Set<string>;
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`LabelResolver.utteranceLabelsToJsonString()-Intent: Adding { labels.size: ${labels.size}, text: ${utterance} }`);
        }
        if (labels && (labels.size > 0)) {
          let isFirst: boolean = true;
          for (const label of labels) {
            if (isFirst) {
              isFirst = false;
            } else {
              batchJsonifiedStringArray.push(',');
            }
            batchJsonifiedStringArray.push(`{"name": ${JSON.stringify(label)}, "offset": 0, "length": 0}`);
          }
        }
        numberUtterancesProcessedUtteranceLabelsMap++;
        if ((numberUtterancesProcessedUtteranceLabelsMap % Utility.NumberOfInstancesPerProgressDisplayBatchForIntent) === 0) {
          Utility.debuggingLog(`LabelResolver.utteranceLabelsToJsonString(): Added numberUtterancesProcessedUtteranceLabelsMap=${numberUtterancesProcessedUtteranceLabelsMap}`);
        }
      }
      batchJsonifiedStringArray.push('],'); // ---- "intents"
      batchJsonifiedStringArray.push('"entities": [');
      // eslint-disable-next-line no-lone-blocks
      {
        if (utteranceEntityLabelsMap.has(utterance)) {
          const labelsEntities: Label[] = utteranceEntityLabelsMap.get(utterance) as Label[];
          if (Utility.toPrintDetailedDebuggingLogToConsole) {
            Utility.debuggingLog(`LabelResolver.utteranceLabelsToJsonString()-Entity: Adding { labelsEntities.length: ${labelsEntities.length}, text: ${utterance} }`);
          }
          if (labelsEntities && (labelsEntities.length > 0)) {
            let isFirst: boolean = true;
            for (const labelEntity of labelsEntities) {
              // eslint-disable-next-line max-depth
              if (isFirst) {
                isFirst = false;
              } else {
                batchJsonifiedStringArray.push(',');
              }
              batchJsonifiedStringArray.push(`{"name": ${JSON.stringify(labelEntity.name)}, "offset": ${labelEntity.span.offset}, "length": ${labelEntity.span.length}}`);
            }
          }
          numberUtterancesProcessedUtteranceEntityLabelsMap++;
          if ((numberUtterancesProcessedUtteranceEntityLabelsMap % Utility.NumberOfInstancesPerProgressDisplayBatchForEntity) === 0) {
            Utility.debuggingLog(`LabelResolver.utteranceLabelsToJsonString(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=${numberUtterancesProcessedUtteranceEntityLabelsMap}`);
          }
        }
      }
      batchJsonifiedStringArray.push(']'); // ---- "entities"
      batchJsonifiedStringArray.push('}'); // ---- example / "text"
    }
    batchJsonifiedStringArray.push(']}'); // ---- "examples"
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToJsonString(): Added numberUtterancesProcessedUtteranceLabelsMap=${numberUtterancesProcessedUtteranceLabelsMap}`);
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToJsonString(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=${numberUtterancesProcessedUtteranceEntityLabelsMap}`);
    // -----------------------------------------------------------------------
    Utility.debuggingLog('LEAVING LabelResolver.utteranceLabelsToJsonString()');
    return batchJsonifiedStringArray.join(' ');
  }

  // eslint-disable-next-line complexity
  public static utteranceLabelsToObjectJsonString(
    utteranceIntentEntityLabels: {
      utteranceLabelsMap: Map<string, Set<string>>;
      utteranceLabelDuplicateMap: Map<string, Set<string>>;
      utteranceEntityLabelsMap: Map<string, Label[]>;
      utteranceEntityLabelDuplicateMap: Map<string, Label[]>; }): string {
    Utility.debuggingLog('CALLING LabelResolver.utteranceLabelsToObjectJsonString()');
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToObjectJsonString(): utteranceIntentEntityLabels.utteranceLabelsMap.size=${utteranceIntentEntityLabels.utteranceLabelsMap.size}`);
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToObjectJsonString(): utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size}`);
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToObjectJsonString(): utteranceIntentEntityLabels.utteranceEntityLabelsMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelsMap.size}`);
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToObjectJsonString(): utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size}`);
    // -----------------------------------------------------------------------
    const batch: {
      'examples': Array<{
        'text': string;
        'intents': Array<{
          'name': string;
          'offset': number;
          'length': number;
        }>;
        'entities': Array<{
          'name': string;
          'offset': number;
          'length': number;
        }>;
      }>;
    } = LabelResolver.utteranceLabelsToObject(utteranceIntentEntityLabels);
    // -----------------------------------------------------------------------
    UtilityDispatcher.debuggingLog('LabelResolver.utteranceLabelsToObjectJsonString(): ready to call JSON.stringify()');
    const batchJsonified: string = JSON.stringify(batch);
    UtilityDispatcher.debuggingLog('LabelResolver.utteranceLabelsToObjectJsonString(): finished calling JSON.stringify()');
    if (UtilityDispatcher.toPrintDetailedDebuggingLogToConsole) {
      UtilityDispatcher.debuggingNamedLog1('LabelResolver.utteranceLabelsToObjectJsonString(): batchJsonified', batchJsonified, 'batchJsonified');
    }
    // -----------------------------------------------------------------------
    Utility.debuggingLog('LEAVING LabelResolver.utteranceLabelsToObjectJsonString()');
    return batchJsonified;
  }

  // eslint-disable-next-line complexity
  public static utteranceLabelsToObject(
    utteranceIntentEntityLabels: {
      utteranceLabelsMap: Map<string, Set<string>>;
      utteranceLabelDuplicateMap: Map<string, Set<string>>;
      utteranceEntityLabelsMap: Map<string, Label[]>;
      utteranceEntityLabelDuplicateMap: Map<string, Label[]>; }): {
        'examples': Array<{
          'text': string;
          'intents': Array<{
            'name': string;
            'offset': number;
            'length': number;
          }>;
          'entities': Array<{
            'name': string;
            'offset': number;
            'length': number;
          }>;
        }>;
      } {
    Utility.debuggingLog('CALLING LabelResolver.utteranceLabelsToObject()');
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToObject(): utteranceIntentEntityLabels.utteranceLabelsMap.size=${utteranceIntentEntityLabels.utteranceLabelsMap.size}`);
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToObject(): utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size}`);
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToObject(): utteranceIntentEntityLabels.utteranceEntityLabelsMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelsMap.size}`);
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToObject(): utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size}`);
    // -----------------------------------------------------------------------
    const examples: Array<{
      'text': string;
      'intents': Array<{
        'name': string;
        'offset': number;
        'length': number;
      }>;
      'entities': Array<{
        'name': string;
        'offset': number;
        'length': number;
      }>;
    }> = new Array<{
      text: string;
      intents: Array<{
        name: string;
        offset: number;
        length: number;
      }>;
      entities: Array<{
        name: string;
        offset: number;
        length: number;
      }>;
    }>();
    const batch: {
      'examples': Array<{
        'text': string;
        'intents': Array<{
          'name': string;
          'offset': number;
          'length': number;
        }>;
        'entities': Array<{
          'name': string;
          'offset': number;
          'length': number;
        }>;
      }>;
    } = {
      examples,
    };
    // -----------------------------------------------------------------------
    UtilityDispatcher.debuggingNamedLog1('LabelResolver.utteranceLabelsToObject(), empty batch', batch, 'batch');
    // -----------------------------------------------------------------------
    const utteranceLabelsMap: Map<string, Set<string>> = utteranceIntentEntityLabels.utteranceLabelsMap;
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToObject(): utteranceIntentEntityLabels.utteranceLabelsMap.size=${utteranceIntentEntityLabels.utteranceLabelsMap.size}`);
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToObject(): utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size}`);
    let numberUtterancesProcessedUtteranceLabelsMap: number = 0;
    // -----------------------------------------------------------------------
    const utteranceEntityLabelsMap: Map<string, Label[]> = utteranceIntentEntityLabels.utteranceEntityLabelsMap;
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToObject(): utteranceIntentEntityLabels.utteranceEntityLabelsMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelsMap.size}`);
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToObject(): utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size}`);
    let numberUtterancesProcessedUtteranceEntityLabelsMap: number = 0;
    // -----------------------------------------------------------------------
    // ---- Utility.toPrintDetailedDebuggingLogToConsole = true; // ---- NOTE ---- disable after detailed tracing is done.
    for (const utterance of utteranceLabelsMap.keys()) {
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`LabelResolver.utteranceLabelsToObject(): processing utterance='${utterance}'`);
      }
      const intents: Array<{
        'name': string;
        'offset': number;
        'length': number;
      }> = [];
      {
        const labels: Set<string> = utteranceLabelsMap.get(utterance) as Set<string>;
        if (Utility.toPrintDetailedDebuggingLogToConsole) {
          Utility.debuggingLog(`LabelResolver.utteranceLabelsToObject()-Intent: Adding { labels.size: ${labels.size}, text: ${utterance} }`);
        }
        if (labels && (labels.size > 0)) {
          for (const label of labels) {
            intents.push({
              name: label,
              offset: 0,
              length: 0,
            });
          }
        }
        numberUtterancesProcessedUtteranceLabelsMap++;
        if ((numberUtterancesProcessedUtteranceLabelsMap % Utility.NumberOfInstancesPerProgressDisplayBatchForIntent) === 0) {
          Utility.debuggingLog(`LabelResolver.utteranceLabelsToObject(): Added numberUtterancesProcessedUtteranceLabelsMap=${numberUtterancesProcessedUtteranceLabelsMap}`);
        }
      }
      const entities: Array<{
        'name': string;
        'offset': number;
        'length': number;
      }> = [];
      // eslint-disable-next-line no-lone-blocks
      {
        if (utteranceEntityLabelsMap.has(utterance)) {
          const labelsEntities: Label[] = utteranceEntityLabelsMap.get(utterance) as Label[];
          if (Utility.toPrintDetailedDebuggingLogToConsole) {
            Utility.debuggingLog(`LabelResolver.utteranceLabelsToObject()-Entity: Adding { labelsEntities.length: ${labelsEntities.length}, text: ${utterance} }`);
          }
          if (labelsEntities && (labelsEntities.length > 0)) {
            for (const labelEntity of labelsEntities) {
              entities.push({
                name: labelEntity.name,
                offset: labelEntity.span.offset,
                length: labelEntity.span.length,
              });
            }
          }
          numberUtterancesProcessedUtteranceEntityLabelsMap++;
          if ((numberUtterancesProcessedUtteranceEntityLabelsMap % Utility.NumberOfInstancesPerProgressDisplayBatchForEntity) === 0) {
            Utility.debuggingLog(`LabelResolver.utteranceLabelsToObject(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=${numberUtterancesProcessedUtteranceEntityLabelsMap}`);
          }
        }
      }
      examples.push({
        text: utterance,
        intents: intents,
        entities: entities,
      });
    }
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToObject(): Added numberUtterancesProcessedUtteranceLabelsMap=${numberUtterancesProcessedUtteranceLabelsMap}`);
    Utility.debuggingLog(`LabelResolver.utteranceLabelsToObject(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=${numberUtterancesProcessedUtteranceEntityLabelsMap}`);
    // -----------------------------------------------------------------------
    Utility.debuggingLog('LEAVING LabelResolver.utteranceLabelsToObject()');
    return batch;
  }

  // eslint-disable-next-line complexity
  public static addExamples(
    utteranceIntentEntityLabels: {
      utteranceLabelsMap: Map<string, Set<string>>;
      utteranceLabelDuplicateMap: Map<string, Set<string>>;
      utteranceEntityLabelsMap: Map<string, Label[]>;
      utteranceEntityLabelDuplicateMap: Map<string, Label[]>; },
    labelResolver: any = null) {
    Utility.debuggingLog('CALLING LabelResolver.addExamples()');
    if (labelResolver === null) {
      labelResolver = LabelResolver.LabelResolver;
    }
    Utility.debuggingLog(`processed utteranceIntentEntityLabels.utteranceLabelsMap.size=${utteranceIntentEntityLabels.utteranceLabelsMap.size}`);
    Utility.debuggingLog(`processed utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size}`);
    Utility.debuggingLog(`processed utteranceIntentEntityLabels.utteranceEntityLabelsMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelsMap.size}`);
    Utility.debuggingLog(`processed utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size}`);
    // -----------------------------------------------------------------------
    const utteranceLabelsMap: Map<string, Set<string>> = utteranceIntentEntityLabels.utteranceLabelsMap;
    Utility.debuggingLog(`processed utteranceIntentEntityLabels.utteranceLabelsMap.size=${utteranceIntentEntityLabels.utteranceLabelsMap.size}`);
    Utility.debuggingLog(`processed utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size}`);
    let numberUtterancesProcessedUtteranceLabelsMap: number = 0;
    Utility.debuggingLog(`READY to call labelResolver.addExample() on utteranceLabelsMap utterances and labels, utteranceLabelsMap.size=${utteranceLabelsMap.size}`);
    // ---- Utility.toPrintDetailedDebuggingLogToConsole = true; // ---- NOTE ---- disable after detailed tracing is done.
    // eslint-disable-next-line guard-for-in
    for (const utterance of utteranceLabelsMap.keys()) {
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`processing utterance=${utterance}`);
      }
      const labels: Set<string> = utteranceLabelsMap.get(utterance) as Set<string>;
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`LabelResolver.addExample()-Intent: Adding { labels.size: ${labels.size}, text: ${utterance} }`);
      }
      if (labels && (labels.size > 0)) {
        for (const label of labels) {
          try {
            const success: any = labelResolver.addExample({label: label, text: utterance});
            // eslint-disable-next-line max-depth
            if (success) {
              // eslint-disable-next-line max-depth
              if (Utility.toPrintDetailedDebuggingLogToConsole) {
                Utility.debuggingLog(`LabelResolver.addExample()-Intent: Added { label: ${label}, text: ${utterance} }`);
              }
            } else {
              Utility.debuggingLog(`LabelResolver.addExample()-Intent: Failed adding { label: ${label}, text: ${utterance} }`);
            }
          } catch (error) {
            Utility.debuggingThrow(`LabelResolver.addExample()-Intent: Failed adding { label: ${label}, text: ${utterance} }\n${error}`);
          }
        }
      }
      numberUtterancesProcessedUtteranceLabelsMap++;
      if ((numberUtterancesProcessedUtteranceLabelsMap % Utility.NumberOfInstancesPerProgressDisplayBatchForIntent) === 0) {
        Utility.debuggingLog(`LabelResolver.addExamples(): Added numberUtterancesProcessedUtteranceLabelsMap=${numberUtterancesProcessedUtteranceLabelsMap}`);
      }
    }
    // -----------------------------------------------------------------------
    const utteranceEntityLabelsMap: Map<string, Label[]> = utteranceIntentEntityLabels.utteranceEntityLabelsMap;
    Utility.debuggingLog(`processed utteranceIntentEntityLabels.utteranceEntityLabelsMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelsMap.size}`);
    Utility.debuggingLog(`processed utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size}`);
    let numberUtterancesProcessedUtteranceEntityLabelsMap: number = 0;
    Utility.debuggingLog(`READY to call labelResolver.addExample() on utteranceEntityLabelsMap utterances and labels, utteranceEntityLabelsMap.size=${utteranceEntityLabelsMap.size}`);
    // eslint-disable-next-line guard-for-in
    for (const utterance of utteranceEntityLabelsMap.keys()) {
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`processing utterance=${utterance}`);
      }
      const labels: Label[] = utteranceEntityLabelsMap.get(utterance) as Label[];
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`LabelResolver.addExample()-Entity: Added { labels.length: ${labels.length}, text: ${utterance} }`);
      }
      if (labels && (labels.length > 0)) {
        for (const label of labels) {
          const entity: string = label.name;
          const spanOffset: number = label.span.offset;
          const spanLength: number = label.span.length;
          try {
            const success: any = labelResolver.addExample({
              text: utterance,
              labels: [{
                name: entity,
                label_type: 2,
                span: {
                  offset: spanOffset,
                  length: spanLength}}]});
            // eslint-disable-next-line max-depth
            if (success) {
              // eslint-disable-next-line max-depth
              if (Utility.toPrintDetailedDebuggingLogToConsole) {
                Utility.debuggingLog(`LabelResolver.addExample()-Entity: Added { label: ${label}, text: ${utterance}, offset: ${spanOffset}, length: ${spanLength} }`);
              }
            } else {
              Utility.debuggingLog(`LabelResolver.addExample()-Entity: Failed adding { label: ${label}, text: ${utterance}, offset: ${spanOffset}, length: ${spanLength} }`);
            }
          } catch (error) {
            Utility.debuggingThrow(`LabelResolver.addExample()-Entity: Failed adding { label: ${label}, text: ${utterance}, offset: ${spanOffset}, length: ${spanLength} }\n${error}`);
          }
        }
      }
      numberUtterancesProcessedUtteranceEntityLabelsMap++;
      if ((numberUtterancesProcessedUtteranceEntityLabelsMap % Utility.NumberOfInstancesPerProgressDisplayBatchForEntity) === 0) {
        Utility.debuggingLog(`LabelResolver.addExamples(): Added numberUtterancesProcessedUtteranceEntityLabelsMap=${numberUtterancesProcessedUtteranceEntityLabelsMap}`);
      }
    }
    // -----------------------------------------------------------------------
    Utility.debuggingLog('LEAVING LabelResolver.addExamples()');
  }

  private static ensureLabelResolver(labelResolver: any) {
    if (!labelResolver) {
      labelResolver = LabelResolver.LabelResolver;
    }
    if (!labelResolver) {
      throw new Error('LabelResolver was not initialized');
    }
    return labelResolver;
  }
}
