/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {Orchestrator, Utility} from '@microsoft/bf-orchestrator';
import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';

export default class OrchestratorPredict extends Command {
  static description: string = 'Real-time interaction with Orchestrator model and analysis. Can return score of given utterance using previously created orchestrator examples';

  static examples: Array<string> = [`
    $ bf orchestrator:predict --in=./path/to/snapshot/file --out=./path/to/output/folder/ --model=./path/to/model/directory`]

  static flags: flags.Input<any> = {
    in: flags.string({char: 'l', description: 'Optional path to a previously created Orchestrator .blu file.'}),
    out: flags.string({char: 'o', description: 'Directory where analysis and output files will be placed.'}),
    model: flags.string({char: 'm', description: 'Directory or hosting Orchestrator config and model files.'}),
    ambiguous: flags.string({char: 'a', description: `Ambiguous threshold, default to ${Utility.DefaultAmbiguousClosenessParameter}`}),
    low_confidence: flags.string({char: 'l', description: `Low confidence threshold, default to ${Utility.DefaultLowConfidenceScoreThresholdParameter}`}),
    multi_label: flags.string({char: 'p', description: `Plural/multi-label prediction threshold, default to ${Utility.DefaultMultiLabelPredictionThresholdParameter}`}),
    unknown: flags.string({char: 'u', description: `Unknow label threshold, default to ${Utility.DefaultUnknownLabelPredictionThresholdParameter}`}),
    fullEmbeddings: flags.boolean({description: 'Use full embeddings.'}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h'}),
  }

  async run(): Promise<number> {
    const {flags}: flags.Output = this.parse(OrchestratorPredict);

    const inputPath: string = flags.in;
    const outputPath: string = flags.out;
    let nlrPath: string = flags.model;
    if (nlrPath) {
      nlrPath = path.resolve(nlrPath);
    }

    let ambiguousClosenessParameter: number = Utility.DefaultAmbiguousClosenessParameter;
    let lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter;
    let multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter;
    let unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter;
    if (flags.ambiguous) {
      ambiguousClosenessParameter = Number(flags.ambiguous);
      if (Number.isNaN(ambiguousClosenessParameter)) {
        Utility.writeLineToConsole(`ambiguous parameter "${flags.ambiguous}" is not a number`);
        return -1;
      }
    }
    if (flags.low_confidence) {
      lowConfidenceScoreThresholdParameter = Number(flags.low_confidence);
      if (Number.isNaN(lowConfidenceScoreThresholdParameter)) {
        Utility.writeLineToConsole(`low-confidence parameter "${flags.ambiguous}" is not a number`);
        return -1;
      }
    }
    if (flags.multi_label) {
      multiLabelPredictionThresholdParameter = Number(flags.multi_label);
      if (Number.isNaN(multiLabelPredictionThresholdParameter)) {
        Utility.writeLineToConsole(`multi-label threshold parameter "${flags.multi_label}" is not a number`);
        return -1;
      }
    }
    if (flags.unknown) {
      unknownLabelPredictionThresholdParameter = Number(flags.unknown);
      if (Number.isNaN(unknownLabelPredictionThresholdParameter)) {
        Utility.writeLineToConsole(`unknown threshold parameter "${flags.unknown}" is not a number`);
        return -1;
      }
    }

    Utility.toPrintDebuggingLogToConsole = flags.debug;
    UtilityDispatcher.toPrintDebuggingLogToConsole = flags.debug;

    Utility.debuggingLog(`OrchestratorPredict.run(): inputPath=${inputPath}`);
    Utility.debuggingLog(`OrchestratorPredict.run(): outputPath=${outputPath}`);
    Utility.debuggingLog(`OrchestratorPredict.run(): nlrPath=${nlrPath}`);
    Utility.debuggingLog(`OrchestratorPredict.run(): ambiguousClosenessParameter=${ambiguousClosenessParameter}`);
    Utility.debuggingLog(`OrchestratorPredict.run(): lowConfidenceScoreThresholdParameter=${lowConfidenceScoreThresholdParameter}`);
    Utility.debuggingLog(`OrchestratorPredict.run(): multiLabelPredictionThresholdParameter=${multiLabelPredictionThresholdParameter}`);
    Utility.debuggingLog(`OrchestratorPredict.run(): unknownLabelPredictionThresholdParameter=${unknownLabelPredictionThresholdParameter}`);

    try {
      await Orchestrator.predictAsync(
        nlrPath, inputPath, outputPath,
        ambiguousClosenessParameter,
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
