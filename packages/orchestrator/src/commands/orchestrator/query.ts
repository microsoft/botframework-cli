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
    in: flags.string({char: 'i', description: 'Path to a previously created Orchestrator snapshot (.blu file).'}),
    query: flags.string({char: 'q', description: 'Query string to predict.'}),
    // out: flags.string({char: 'o', description: 'Directory where analysis and output files will be placed.'}),
    model: flags.string({char: 'm', description: 'Path to Orchestrator base model directory.'}),
    ambiguousClosenessThreshold: flags.string({char: 'a', description: `Optional. Ambiguous threshold, default to ${Utility.DefaultAmbiguousClosenessThresholdParameter}`}),
    lowConfidenceScoreThreshold: flags.string({char: 'l', description: `Optional. Low confidence threshold, default to ${Utility.DefaultLowConfidenceScoreThresholdParameter}`}),
    multiLabelPredictionThreshold: flags.string({char: 'n', description: `Optional. Plural/multi-label prediction threshold, default to ${Utility.DefaultMultiLabelPredictionThresholdParameter}`}),
    unknownLabelPredictionThreshold: flags.string({char: 'u', description: `Optional. Unknown label threshold, default to ${Utility.DefaultUnknownLabelPredictionThresholdParameter}`}),
    fullEmbeddings: flags.boolean({description: 'Use full embeddings.'}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h'}),
  }

  async run(): Promise<number> {
    const {flags}: flags.Output = this.parse(OrchestratorQuery);

    const inputPath: string = flags.in;
    const query: string = flags.query;
    // const outputPath: string = flags.out;
    let baseModelPath: string = flags.model;
    if (baseModelPath) {
      baseModelPath = path.resolve(baseModelPath);
    }

    let ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter;
    let lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter;
    let multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter;
    let unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter;
    if (flags.ambiguousClosenessThreshold) {
      ambiguousClosenessThresholdParameter = Number(flags.ambiguousClosenessThreshold);
      if (Number.isNaN(ambiguousClosenessThresholdParameter)) {
        Utility.writeLineToConsole(`ambiguous parameter "${flags.ambiguousClosenessThreshold}" is not a number`);
        return -1;
      }
    }
    if (flags.lowConfidenceScoreThreshold) {
      lowConfidenceScoreThresholdParameter = Number(flags.lowConfidenceScoreThreshold);
      if (Number.isNaN(lowConfidenceScoreThresholdParameter)) {
        Utility.writeLineToConsole(`low-confidence parameter "${flags.ambiguousClosenessThreshold}" is not a number`);
        return -1;
      }
    }
    if (flags.multiLabelPredictionThreshold) {
      multiLabelPredictionThresholdParameter = Number(flags.multiLabelPredictionThreshold);
      if (Number.isNaN(multiLabelPredictionThresholdParameter)) {
        Utility.writeLineToConsole(`multi-label threshold parameter "${flags.multiLabelPredictionThreshold}" is not a number`);
        return -1;
      }
    }
    if (flags.unknownLabelPredictionThreshold) {
      unknownLabelPredictionThresholdParameter = Number(flags.unknownLabelPredictionThreshold);
      if (Number.isNaN(unknownLabelPredictionThresholdParameter)) {
        Utility.writeLineToConsole(`unknown threshold parameter "${flags.unknownLabelPredictionThreshold}" is not a number`);
        return -1;
      }
    }

    Utility.toPrintDebuggingLogToConsole = flags.debug;
    UtilityDispatcher.toPrintDebuggingLogToConsole = flags.debug;

    Utility.debuggingLog(`OrchestratorQuery.run(): inputPath=${inputPath}`);
    Utility.debuggingLog(`OrchestratorQuery.run(): query=${query}`);
    // Utility.debuggingLog(`OrchestratorQuery.run(): outputPath=${outputPath}`);
    Utility.debuggingLog(`OrchestratorQuery.run(): baseModelPath=${baseModelPath}`);
    Utility.debuggingLog(`OrchestratorQuery.run(): ambiguousClosenessThresholdParameter=${ambiguousClosenessThresholdParameter}`);
    Utility.debuggingLog(`OrchestratorQuery.run(): lowConfidenceScoreThresholdParameter=${lowConfidenceScoreThresholdParameter}`);
    Utility.debuggingLog(`OrchestratorQuery.run(): multiLabelPredictionThresholdParameter=${multiLabelPredictionThresholdParameter}`);
    Utility.debuggingLog(`OrchestratorQuery.run(): unknownLabelPredictionThresholdParameter=${unknownLabelPredictionThresholdParameter}`);

    try {
      await Orchestrator.queryAsync(
        baseModelPath, inputPath, query, // outputPath,
        ambiguousClosenessThresholdParameter,
        lowConfidenceScoreThresholdParameter,
        multiLabelPredictionThresholdParameter,
        unknownLabelPredictionThresholdParameter,
        flags.fullEmbeddings);
    } catch (error) {
      throw (new CLIError(error));
    }
    return 0;
  }
}
