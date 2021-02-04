/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {Orchestrator, Utility} from '@microsoft/bf-orchestrator';
import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';

export default class OrchestratorQuery extends Command {
  static description: string = 'Query Orchestrator base model and a snapshot/train file';

  static examples: Array<string> = [`
    $ bf orchestrator:query --in=./path/to/snapshot/file --query=hi --model=./path/to/base/model/directory`]

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: '(required) Path to a previously created Orchestrator snapshot (.blu file).'}),
    query: flags.string({char: 'q', description: '(required) Query string to predict.'}),
    // out: flags.string({char: 'o', description: 'Directory where analysis and output files will be placed.'}),
    model: flags.string({char: 'm', description: '(required) Path to Orchestrator base model directory.'}),
    entityModel: flags.string({char: 'e', description: 'Path to Orchestrator entity base model directory.'}),
    limit: flags.string({char: 'l', description: '(optional) Limit of number of predictions.'}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h'}),
  }
  // ---- NOTE ---- advanced parameters removed from command line, but still can be set through environment variables.
  //
  // --fullEmbeddings                                Optional flag to run on full embeddings instead
  //                                                 of compact embeddings.
  // -a, --ambiguousClosenessThreshold=threshold     Optional ambiguous analysis threshold. Default to 0.2.
  // -l, --lowConfidenceScoreThreshold=threshold     Optional low confidence analysis threshold. Default to 0.5.
  // -p, --multiLabelPredictionThreshold=threshold   Optional numeral/plural/multi-label prediction threshold,
  //     default to 1. For the default, only labels shared the same max scores are adopted as prediction. If
  //     the threshold is lower than 1, the any labels with a prediction score higher will be adoopted as prediction.
  // -u, --unknownLabelPredictionThreshold=threshold Optional unknown label threshold, default to 0.3.

  async run(): Promise<number> {
    const {flags}: flags.Output = this.parse(OrchestratorQuery);
    const flagsKeys: string[] = Object.keys(flags);
    if (Utility.isEmptyStringArray(flagsKeys)) {
      this._help();
    }

    const inputPath: string = flags.in;
    const query: string = flags.query;
    // const outputPath: string = flags.out;
    let baseModelPath: string = flags.model;
    if (baseModelPath) {
      baseModelPath = path.resolve(baseModelPath);
    }
    let entityBaseModelPath: string = flags.entityModel;
    if (entityBaseModelPath) {
      entityBaseModelPath = path.resolve(entityBaseModelPath);
    }

    try {
      let fullEmbeddings: boolean = false;
      if (process.env.fullEmbeddings) {
        fullEmbeddings = true;
      }
      let limit: number = 3;
      const limitInString: string = flags.limit;
      if (limitInString) {
        limit = Number(limitInString);
        if (Number.isNaN(limit)) {
          Utility.writeStringLineToConsoleStderr(`limit parameter "${limitInString}" is not a number`);
          Utility.debuggingThrow(`limit parameter "${limitInString}" is not a number`);
        }
      }
      let ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter;
      let lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter;
      let multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter;
      let unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter;
      if (process.env.ambiguousClosenessThreshold) {
        ambiguousClosenessThresholdParameter = Number(process.env.ambiguousClosenessThreshold);
        if (Number.isNaN(ambiguousClosenessThresholdParameter)) {
          Utility.writeStringLineToConsoleStderr(`ambiguous parameter "${process.env.ambiguousClosenessThreshold}" is not a number`);
          Utility.debuggingThrow(`ambiguous parameter "${process.env.ambiguousClosenessThreshold}" is not a number`);
        }
      }
      if (process.env.lowConfidenceScoreThreshold) {
        lowConfidenceScoreThresholdParameter = Number(process.env.lowConfidenceScoreThreshold);
        if (Number.isNaN(lowConfidenceScoreThresholdParameter)) {
          Utility.writeStringLineToConsoleStderr(`low-confidence parameter "${process.env.lowConfidenceScoreThreshold}" is not a number`);
          Utility.debuggingThrow(`low-confidence parameter "${process.env.lowConfidenceScoreThreshold}" is not a number`);
        }
      }
      if (process.env.multiLabelPredictionThreshold) {
        multiLabelPredictionThresholdParameter = Number(process.env.multiLabelPredictionThreshold);
        if (Number.isNaN(multiLabelPredictionThresholdParameter)) {
          Utility.writeStringLineToConsoleStderr(`multi-label threshold parameter "${process.env.multiLabelPredictionThreshold}" is not a number`);
          Utility.debuggingThrow(`multi-label threshold parameter "${process.env.multiLabelPredictionThreshold}" is not a number`);
        }
      }
      if (process.env.unknownLabelPredictionThreshold) {
        unknownLabelPredictionThresholdParameter = Number(process.env.unknownLabelPredictionThreshold);
        if (Number.isNaN(unknownLabelPredictionThresholdParameter)) {
          Utility.writeStringLineToConsoleStderr(`unknown threshold parameter "${process.env.unknownLabelPredictionThreshold}" is not a number`);
          Utility.debuggingThrow(`unknown threshold parameter "${process.env.unknownLabelPredictionThreshold}" is not a number`);
        }
      }
      Utility.toPrintDebuggingLogToConsole = flags.debug;
      UtilityDispatcher.toPrintDebuggingLogToConsole = flags.debug;
      Utility.debuggingLog(`OrchestratorInteractive.run(): this.id=${this.id}`);
      Utility.debuggingLog(`OrchestratorQuery.run(): inputPath=${inputPath}`);
      Utility.debuggingLog(`OrchestratorQuery.run(): query=${query}`);
      // Utility.debuggingLog(`OrchestratorQuery.run(): outputPath=${outputPath}`);
      Utility.debuggingLog(`OrchestratorQuery.run(): baseModelPath=${baseModelPath}`);
      Utility.debuggingLog(`OrchestratorQuery.run(): entityBaseModelPath=${entityBaseModelPath}`);
      Utility.debuggingLog(`OrchestratorQuery.run(): ambiguousClosenessThresholdParameter=${ambiguousClosenessThresholdParameter}`);
      Utility.debuggingLog(`OrchestratorQuery.run(): lowConfidenceScoreThresholdParameter=${lowConfidenceScoreThresholdParameter}`);
      Utility.debuggingLog(`OrchestratorQuery.run(): multiLabelPredictionThresholdParameter=${multiLabelPredictionThresholdParameter}`);
      Utility.debuggingLog(`OrchestratorQuery.run(): unknownLabelPredictionThresholdParameter=${unknownLabelPredictionThresholdParameter}`);
      Utility.debuggingLog(`OrchestratorQuery.run(): fullEmbeddings=${fullEmbeddings}`);
      Utility.debuggingLog(`OrchestratorQuery.run(): limit=${limit}`);
      await Orchestrator.queryAsync(
        baseModelPath,
        inputPath,
        query,
        // outputPath,
        entityBaseModelPath,
        ambiguousClosenessThresholdParameter,
        lowConfidenceScoreThresholdParameter,
        multiLabelPredictionThresholdParameter,
        unknownLabelPredictionThresholdParameter,
        fullEmbeddings,
        limit);
    } catch (error) {
      Utility.debuggingLog(`OrchestratorQuery.run(): error=${error}`);
      // eslint-disable-next-line no-console
      console.log(`OrchestratorQuery.run(): error=${error}`);
      throw (new CLIError(error));
    }
    return 0;
  }
}
