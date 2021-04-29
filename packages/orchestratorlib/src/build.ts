/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';

import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';
import {Utility} from './utility';

import {ITextUtteranceLabelMapDataStructure} from '@microsoft/bf-dispatcher';
import {Label} from '@microsoft/bf-dispatcher';
import {LabelType} from '@microsoft/bf-dispatcher';
import {Span} from '@microsoft/bf-dispatcher';

import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';

export class OrchestratorBuild {
  public static Orchestrator: any;

  public static IsDialog: boolean;

  public static LuContents: any[];

  // eslint-disable-next-line max-params
  public static async runAsync(
    baseModelPath: string,
    entityBaseModelPath: string,
    inputs: any[],
    labelResolvers: Map<string, LabelResolver>,
    isDialog: boolean = false,
    luConfig: any = null,
    fullEmbeddings: boolean = false): Promise<any> {
    Utility.debuggingLog(`baseModelPath=${baseModelPath}`);
    Utility.debuggingLog(`entityBaseModelPath=${entityBaseModelPath}`);
    Utility.debuggingLog(`inputPath=${Utility.jsonStringify(inputs, null, 2)}`);
    Utility.debuggingLog(`isDialog=${isDialog}`);
    Utility.debuggingLog(`luConfigFile=${Utility.jsonStringify(luConfig, null, 2)}`);
    Utility.debuggingLog(`fullEmbeddings=${fullEmbeddings}`);
    try {
      if (!baseModelPath || baseModelPath.length === 0) {
        throw new Error('Please provide path to Orchestrator model');
      }

      let hasLuConfig: boolean = false;
      if (!inputs || inputs.length === 0) {
        if (!luConfig || !luConfig.models || luConfig.models.length === 0) {
          throw new Error('Please provide valid lu input(s)');
        } else {
          hasLuConfig = true;
        }
      }

      baseModelPath = path.resolve(baseModelPath);

      const orchestrator: any = await LabelResolver.loadNlrAsync(baseModelPath);
      Utility.debuggingLog('Loaded nlr');

      OrchestratorBuild.Orchestrator = orchestrator;
      OrchestratorBuild.LuContents = inputs;
      OrchestratorBuild.IsDialog = isDialog;
      let buildOutputs: any[];
      if (hasLuConfig) {
        buildOutputs = await OrchestratorBuild.processLuConfig(luConfig, labelResolvers, fullEmbeddings);
      } else {
        buildOutputs = await OrchestratorBuild.processInput(inputs, labelResolvers, fullEmbeddings);
      }

      const settings: {
        'orchestrator': {
          'modelFolder': string;
          'snapshots': Map<string, string>;
        };
      } = {
        orchestrator: {
          modelFolder: baseModelPath.replace(/\\/g, '/'),
          snapshots: new Map<string, string>(),
        },
      };
      return {outputs: buildOutputs, settings: settings};
    } catch (error) {
      UtilityDispatcher.debuggingThrowWithCause(
        `FAILED to get model ${baseModelPath}, baseModelPath=${baseModelPath}, entityBaseModelPath=${entityBaseModelPath}`,
        error);
    }
  }

  // Convert intent label name to full Label
  private static async convertToIntentLabel(
    labelName: string): Promise<Label> {
    return new Label(LabelType.Intent, labelName, new Span(0, 0));
  }

  // Convert intent set of label names to full Label
  private static async convertToIntentLabels(
    labelNames: Set<string>): Promise<Label[]> {
    const result: Array<Label> = new Array<Label>();

    labelNames.forEach(async (labelName: string) => {
      const newLabel: Label = await OrchestratorBuild.convertToIntentLabel(labelName);
      result.push(newLabel);
    });

    return result;
  }

  // Get sorted examples from Label Resolver.
  static getExamplesLR(
    labelResolver: LabelResolver): ITextUtteranceLabelMapDataStructure {
    const labelResolverExamples: any = LabelResolver.getExamples(labelResolver);
    /** ---- NOTE-FOR-REFERENCE ----
     *  const labelResolverExamples: Example[] = LabelResolver.getExamples(labelResolver).map(
     *    (x: any) => new Example(
     *      x.text,
     *      x.labels.map((y: any) => new Label(
     *        y.label_type,
     *        y.name,
     *        new Span(
     *          y.span.offset,
     *          y.span.length)))));
     *  labelResolverExamples.sort(Example.sortFunction);
     *  return labelResolverExamples;
     */
    const exampleIntentsEntitiesUtterances: ITextUtteranceLabelMapDataStructure = {
      utteranceLabelsMap: new Map<string, Set<string>>(),
      utteranceLabelDuplicateMap: new Map<string, Set<string>>(),
      utteranceEntityLabelsMap: new Map<string, Label[]>(),
      utteranceEntityLabelDuplicateMap: new Map<string, Label[]>()};
    OrchestratorHelper.getExampleArrayIntentsEntitiesUtterances(
      labelResolverExamples,
      '',
      exampleIntentsEntitiesUtterances.utteranceLabelsMap,
      exampleIntentsEntitiesUtterances.utteranceLabelDuplicateMap,
      exampleIntentsEntitiesUtterances.utteranceEntityLabelsMap,
      exampleIntentsEntitiesUtterances.utteranceEntityLabelDuplicateMap);
    return exampleIntentsEntitiesUtterances;
  }

  // Get sorted examples from LU file
  static async getExamplesLU(
    luContent: string): Promise<ITextUtteranceLabelMapDataStructure> {
    const luIntentsEntitiesUtterances: ITextUtteranceLabelMapDataStructure = {
      utteranceLabelsMap: new Map<string, Set<string>>(),
      utteranceLabelDuplicateMap: new Map<string, Set<string>>(),
      utteranceEntityLabelsMap: new Map<string, Label[]>(),
      utteranceEntityLabelDuplicateMap: new Map<string, Label[]>()};
    await OrchestratorHelper.parseLuContent(
      '',
      luContent,
      '',
      luIntentsEntitiesUtterances.utteranceLabelsMap,
      luIntentsEntitiesUtterances.utteranceLabelDuplicateMap,
      luIntentsEntitiesUtterances.utteranceEntityLabelsMap,
      luIntentsEntitiesUtterances.utteranceEntityLabelDuplicateMap);
    Utility.debuggingLog(`OrchestratorBuild.getExamplesLU(), luIntentsEntitiesUtterances.utteranceLabelsMap.size=${luIntentsEntitiesUtterances.utteranceLabelsMap.size}`);
    Utility.debuggingLog(`OrchestratorBuild.getExamplesLU(), luIntentsEntitiesUtterances.utteranceEntityLabelsMap.size=${luIntentsEntitiesUtterances.utteranceEntityLabelsMap.size}`);
    return luIntentsEntitiesUtterances;
  }

  // Synchronize an active LabelResolver instance with with an LU file.
  static async syncLabelResolver(labelResolver: LabelResolver, luContent: string) {
    const subject: ITextUtteranceLabelMapDataStructure = OrchestratorBuild.getExamplesLR(labelResolver);
    Utility.debuggingLog(`OrchestratorBuild.syncLabelResolver(), subject.utteranceLabelsMap.size=${subject.utteranceLabelsMap.size}`);
    Utility.debuggingLog(`OrchestratorBuild.syncLabelResolver(), subject.utteranceEntityLabelsMap.size=${subject.utteranceEntityLabelsMap.size}`);
    const target: ITextUtteranceLabelMapDataStructure = await OrchestratorBuild.getExamplesLU(luContent);
    Utility.debuggingLog(`OrchestratorBuild.syncLabelResolver(), target.utteranceLabelsMap.size=${target.utteranceLabelsMap.size}`);
    Utility.debuggingLog(`OrchestratorBuild.syncLabelResolver(), target.utteranceEntityLabelsMap.size=${target.utteranceEntityLabelsMap.size}`);
    // ---- NOTE ---- delete example intent label if it is not in target.
    subject.utteranceLabelsMap.forEach((labels: Set<string>, utterance: string) => {
      if (target.utteranceLabelsMap.has(utterance)) {
        const targetUtteranceLabels: Set<string> = target.utteranceLabelsMap.get(utterance) as Set<string>;
        for (const label of labels) {
          if (!targetUtteranceLabels.has(label)) {
            LabelResolver.removeExample({
              text: utterance,
              label: label,
            },
            labelResolver);
          }
        }
      } else {
        LabelResolver.removeExample({
          text: utterance,
          labels: [...labels.keys()].map((label: string) => {
            return {
              name: label,
            };
          }),
        },
        labelResolver);
      }
    });
    // ---- NOTE ---- insert example intent label if it is not in subject.
    target.utteranceLabelsMap.forEach((labels: Set<string>, utterance: string) => {
      if (subject.utteranceLabelsMap.has(utterance)) {
        const subjectUtteranceLabels: Set<string> = subject.utteranceLabelsMap.get(utterance) as Set<string>;
        for (const label of labels) {
          if (!subjectUtteranceLabels.has(label)) {
            LabelResolver.addExample({
              text: utterance,
              label: label,
            },
            labelResolver);
          }
        }
      } else {
        Utility.debuggingLog(`OrchestratorBuild.syncLabelResolver(), LabelResolver.addExample(), utterance=${utterance}, labels=${[...labels.keys()]}`);
        LabelResolver.addExample({
          text: utterance,
          labels: [...labels.keys()].map((label: string) => {
            return {
              name: label,
            };
          }),
        },
        labelResolver);
      }
    });
    // ---- NOTE ---- delete example entity label if it is not in target.
    subject.utteranceEntityLabelsMap.forEach((labels: Label[], utterance: string) => {
      if (target.utteranceEntityLabelsMap.has(utterance)) {
        const targetUtteranceEntityLabels: Label[] = target.utteranceEntityLabelsMap.get(utterance) as Label[];
        const labelsToRemove: Label[] = [];
        for (const label of labels) {
          let labelIsInTarget: boolean = false;
          for (const targetUtteranceEntityLabel of targetUtteranceEntityLabels) {
            if (label.equals(targetUtteranceEntityLabel)) {
              labelIsInTarget = true;
              break;
            }
          }
          if (!labelIsInTarget) {
            labelsToRemove.push(label);
          }
        }
        if (!Utility.isEmptyGenericArray(labelsToRemove)) {
          LabelResolver.removeExample({
            text: utterance,
            labels: labelsToRemove.map((x: Label) => x.toAlternateObject()),
          },
          labelResolver);
        }
      } else {
        LabelResolver.removeExample({
          text: utterance,
          labels: labels.map((x: Label) => x.toAlternateObject()),
        },
        labelResolver);
      }
    });
    // ---- NOTE ---- insert example entity label if it is not in subject.
    target.utteranceEntityLabelsMap.forEach((labels: Label[], utterance: string) => {
      if (subject.utteranceEntityLabelsMap.has(utterance)) {
        const subjectUtteranceEntityLabels: Label[] = subject.utteranceEntityLabelsMap.get(utterance) as Label[];
        const labelsToInsert: Label[] = [];
        for (const label of labels) {
          let labelIsInSubject: boolean = false;
          for (const subjectUtteranceEntityLabel of subjectUtteranceEntityLabels) {
            if (label.equals(subjectUtteranceEntityLabel)) {
              labelIsInSubject = true;
              break;
            }
          }
          if (!labelIsInSubject) {
            labelsToInsert.push(label);
          }
        }
        if (!Utility.isEmptyGenericArray(labelsToInsert)) {
          LabelResolver.addExample({
            text: utterance,
            labels: labelsToInsert.map((x: Label) => x.toAlternateObject()),
          },
          labelResolver);
        }
      } else {
        LabelResolver.addExample({
          text: utterance,
          labels: labels.map((x: Label) => x.toAlternateObject()),
        },
        labelResolver);
      }
    });
  }

  private static async processLuConfig(luConfig: any, labelResolvers: Map<string, LabelResolver>, fullEmbeddings: boolean = false): Promise<any[]> {
    const luObjects: any[] = [];
    for (const file of (luConfig.models || [])) {
      const content: string = OrchestratorHelper.readFile(file);
      if (content) {
        const luObject: any = {
          content: content,
          id: path.basename(file, '.lu'),
        };
        luObjects.push(luObject);
      }
    }
    return OrchestratorBuild.processInput(luObjects, labelResolvers, fullEmbeddings);
  }

  private static async processInput(luObsjects: any[], labelResolvers: Map<string, LabelResolver>, fullEmbedding: boolean = false): Promise<any[]> {
    const retPayload: any[] = [];
    for (const luObject of (luObsjects || [])) {
      // eslint-disable-next-line no-await-in-loop
      const retVal: any = await OrchestratorHelper.processLuContent(luObject, labelResolvers, '', OrchestratorBuild.IsDialog, fullEmbedding);
      retPayload.push(retVal);
    }
    return retPayload;
  }
}
