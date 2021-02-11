/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {LabelResolver} from './labelresolver';
import {OrchestratorHelper} from './orchestratorhelper';
import {Utility} from './utility';
import { stringify } from 'querystring';
import {Label, Span} from '@microsoft/bf-dispatcher';
import {LabelType} from '@microsoft/bf-dispatcher';
import {Example} from '@microsoft/bf-dispatcher';

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
          throw new Error('Please provide lu input');
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
          modelFolder: baseModelPath,
          snapshots: new Map<string, string>(),
        },
      };
      return {outputs: buildOutputs, settings: settings};
    } catch (error) {
      throw new Error(error);
    }
  }

  // Convert intent label name to full Label
  private static async convertToIntentLabel(
    labelName: string) : Promise<Label> {
    return new Label(LabelType.Intent, labelName, new Span(0, 0));
  }

  // Convert intent set of label names to full Label
  private static async convertToIntentLabels(
    labelNames: Set<string>) : Promise<Label[]> {
    let result : Array<Label> = new Array<Label>();

    labelNames.forEach(async labelName=>{
        let newLabel = await OrchestratorBuild.convertToIntentLabel(labelName);
        result.push(newLabel);
        });

    return result;
  }

  // Get sorted examples from Label Resolver.
  static async getExamplesLR(
    labelResolver: LabelResolver): Promise<Example[]> {   
    let result: Example[] = LabelResolver.getExamples(labelResolver);
    result.sort(Example.sort_fn);
    return result;
  }

  // Get sorted examples from LU file
  static async getExamplesLU(
    luContent: string): Promise<Example[]> {
    const luFile: {
      'utteranceLabelsMap': Map<string, Set<string>>;
      'utteranceLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceEntityLabelsMap': Map<string, Label[]>;
      'utteranceEntityLabelDuplicateMap': Map<string, Label[]>; } = {
      utteranceLabelsMap: new Map<string, Set<string>>(),
      utteranceLabelDuplicateMap: new Map<string, Set<string>>(),
      utteranceEntityLabelsMap: new Map<string, Label[]>(),
      utteranceEntityLabelDuplicateMap: new Map<string, Label[]>()};

    await OrchestratorHelper.parseLuContent(
      '',
      luContent,
      '',
      luFile.utteranceLabelsMap,
      luFile.utteranceLabelDuplicateMap,
      luFile.utteranceEntityLabelsMap,
      luFile.utteranceEntityLabelDuplicateMap);

    let result : Example[] = new Array<Example>();
    luFile.utteranceEntityLabelsMap.forEach((labels: Label[], text: string) => {
        result.push(new Example(text, labels))
    });

    luFile.utteranceLabelsMap.forEach(async (labelNames: Set<string>, text: string) => {
        result.push(new Example(text, await OrchestratorBuild.convertToIntentLabels(labelNames)))
    });

    result.sort(Example.sort_fn);
    return result;
  }

  // Synchronize an active LabelResolver instance with with an LU file.
  static async syncLabelResolver(labelResolver: LabelResolver, luContent: string ) {
    let subject : Example[] = await OrchestratorBuild.getExamplesLR(labelResolver);
    let target : Example[] = await OrchestratorBuild.getExamplesLU(luContent);
    // console.log(`subject (labelResolver) (length=${subject.length})`)
    // subject.forEach(element => {
    //     console.log(`  ${element.text} (labels length=${element.labels.length})`)
    //     element.labels.forEach(l => {
    //         console.log(`     name: ${l.name}`);
    //         console.log(`     type: ${l.labeltype}`);
    //         console.log(`     span.length: ${l.span.length}`);
    //         console.log(`     span.offset: ${l.span.offset}`);
    //     });

    // });
    // console.log(`target (LU file) (length=${target.length})`);
    // target.forEach(element => {
    //     console.log(`  ${element.text} (labels length=${element.labels.length})`)
    //     element.labels.forEach(l => {
    //         console.log(`     name: ${l.name}`);
    //         console.log(`     type: ${l.labeltype}`);
    //         console.log(`     span.length: ${l.span.length}`);
    //         console.log(`     span.offset: ${l.span.offset}`);
    //     });

    // });
    // http://www.mlsite.net/blog/?p=2250
    let x:number=0, y:number =0;
    let inserts:{[k: string]: any}[]=new Array<{[k: string]: any}>(), deletes:number[]=new Array<number>();

    while ((x < subject.length) || (y < target.length)) {
        if (y >= target.length) {
            deletes.push(x);
            x += 1;
        }
        else if (x >= subject.length) {
            inserts.push({index:y, value:target[y]});
            y += 1;
        }
        else if (Example.sort_fn(subject[x], target[y]) < 0) {
            deletes.push(x);
            x += 1;
        }
        else if (Example.sort_fn(subject[x], target[y]) > 0) {
            inserts.push({index:y, value:target[y]});
            y += 1;
        }
        else {
            x += 1;
            y += 1;
        }
    }
    // console.log(`size of deletes: ${deletes.length}`)
    // deletes.forEach(element => {
    //     console.log(`  index=${element} (${subject[element].text})`)
    // });
    // console.log(`size of inserts: ${inserts.length}`)
    // inserts.forEach(element => {
    //     console.log(`  index=${element.index}, value=${element.value} (${target[element.index].text})`)
    // });

    //  Process deletes
    deletes.forEach(element => {
        LabelResolver.removeExample(subject[element], labelResolver);
    });
    //  Process inserts
    inserts.forEach(element => {
        LabelResolver.addExample(target[element.index], labelResolver);
    });
  }

  private static async processLuConfig(luConfig: any, labelResolvers: Map<string, LabelResolver>, fullEmbeddings: boolean = false): Promise<any[]> {
    const luObjects: any[] = [];
    for (const file of (luConfig.models || [])) {
      const luObject: any = {
        content: OrchestratorHelper.readFile(file),
        id: path.basename(file, '.lu'),
      };
      luObjects.push(luObject);
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
