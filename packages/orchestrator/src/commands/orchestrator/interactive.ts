/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {Orchestrator, Utility} from '@microsoft/bf-orchestrator';
import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';

export default class OrchestratorInteractive extends Command {
  static description: string = 'Real-time interaction with Orchestrator model and analysis. Can return score of given utterance using previously created orchestrator examples';

  static examples: Array<string> = [`
    $ bf orchestrator:interactive --in=./path/to/snapshot/file --out=./path/to/output/folder/ --model=./path/to/model/directory`]

  static flags: flags.Input<any> = {
    in: flags.string({char: 'l', description: 'Optional path to a previously created Orchestrator .blu file.'}),
    out: flags.string({char: 'o', description: 'Optional Directory where analysis and output files will be placed.'}),
    model: flags.string({char: 'm', description: '(required) Directory or hosting Orchestrator config and base model files.'}),
    // fullEmbeddings: flags.boolean({description: 'Optional flag to run on full embeddings instead of compact embeddings.'}),
    // obfuscate: flags.boolean({description: 'Obfuscate labels and utterances in evaluation reports or not.'}),
    // ambiguousClosenessThreshold: flags.string({char: 'a', description: `Ambiguous threshold, default to ${Utility.DefaultAmbiguousClosenessThresholdParameter}`}),
    // lowConfidenceScoreThreshold: flags.string({char: 'l', description: `Low confidence threshold, default to ${Utility.DefaultLowConfidenceScoreThresholdParameter}`}),
    // multiLabelPredictionThreshold: flags.string({char: 'n', description: `Plural/multi-label prediction threshold, default to ${Utility.DefaultMultiLabelPredictionThresholdParameter}`}),
    // unknownLabelPredictionThreshold: flags.string({char: 'u', description: `Unknow label threshold, default to ${Utility.DefaultUnknownLabelPredictionThresholdParameter}`}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h'}),
  }
  // --fullEmbeddings                                Optional flag to run on full embeddings instead
  //                                                 of compact embeddings.
  // --obfuscate                                     Optional flag to obfuscate labels and utterances
  //                                                 in evaluation reports or not.
  // -a, --ambiguousClosenessThreshold=threshold     Optional ambiguous analysis threshold. Default to 0.2.
  // -l, --lowConfidenceScoreThreshold=threshold     Optional low confidence analysis threshold. Default to 0.5.
  // -p, --multiLabelPredictionThreshold=threshold   Optional numeral/plural/multi-label prediction threshold,
  //     default to 1. For the default, only labels shared the same max scores are adopted as prediction. If
  //     the threshold is lower than 1, the any labels with a prediction score higher will be adoopted as prediction.
  // -u, --unknownLabelPredictionThreshold=threshold Optional unknown label threshold, default to 0.3.

  async run(): Promise<number> {
    const {flags}: flags.Output = this.parse(OrchestratorInteractive);
    const flagsKeys: string[] = Object.keys(flags);
    if (Utility.isEmptyStringArray(flagsKeys)) {
      this._help();
    }

    const inputPath: string = flags.in;
    const outputPath: string = flags.out;
    let baseModelPath: string = flags.model;
    if (baseModelPath) {
      baseModelPath = path.resolve(baseModelPath);
    }

    try {
      let fullEmbeddings: boolean = false;
      if (process.env.fullEmbeddings) {
        fullEmbeddings = true;
      }
      let obfuscate: boolean = false;
      if (process.env.obfuscate) {
        obfuscate = true;
      }
      let ambiguousClosenessThresholdParameter: number = Utility.DefaultAmbiguousClosenessThresholdParameter;
      let lowConfidenceScoreThresholdParameter: number = Utility.DefaultLowConfidenceScoreThresholdParameter;
      let multiLabelPredictionThresholdParameter: number = Utility.DefaultMultiLabelPredictionThresholdParameter;
      let unknownLabelPredictionThresholdParameter: number = Utility.DefaultUnknownLabelPredictionThresholdParameter;
      if (process.env.ambiguousClosenessThreshold) {
        ambiguousClosenessThresholdParameter = Number(process.env.ambiguousClosenessThreshold);
        if (Number.isNaN(ambiguousClosenessThresholdParameter)) {
          Utility.writeLineToConsole(`ambiguous parameter "${process.env.ambiguousClosenessThreshold}" is not a number`);
          Utility.debuggingThrow(`ambiguous parameter "${process.env.ambiguousClosenessThreshold}" is not a number`);
        }
      }
      if (process.env.lowConfidenceScoreThreshold) {
        lowConfidenceScoreThresholdParameter = Number(process.env.lowConfidenceScoreThreshold);
        if (Number.isNaN(lowConfidenceScoreThresholdParameter)) {
          Utility.writeLineToConsole(`low-confidence parameter "${process.env.ambiguousClosenessThreshold}" is not a number`);
          Utility.debuggingThrow(`low-confidence parameter "${process.env.ambiguousClosenessThreshold}" is not a number`);
        }
      }
      if (process.env.multiLabelPredictionThreshold) {
        multiLabelPredictionThresholdParameter = Number(process.env.multiLabelPredictionThreshold);
        if (Number.isNaN(multiLabelPredictionThresholdParameter)) {
          Utility.writeLineToConsole(`multi-label threshold parameter "${process.env.multiLabelPredictionThreshold}" is not a number`);
          Utility.debuggingThrow(`multi-label threshold parameter "${process.env.multiLabelPredictionThreshold}" is not a number`);
        }
      }
      if (process.env.unknownLabelPredictionThreshold) {
        unknownLabelPredictionThresholdParameter = Number(process.env.unknownLabelPredictionThreshold);
        if (Number.isNaN(unknownLabelPredictionThresholdParameter)) {
          Utility.writeLineToConsole(`unknown threshold parameter "${process.env.unknownLabelPredictionThreshold}" is not a number`);
          Utility.debuggingThrow(`unknown threshold parameter "${process.env.unknownLabelPredictionThreshold}" is not a number`);
        }
      }
      Utility.toPrintDebuggingLogToConsole = flags.debug;
      UtilityDispatcher.toPrintDebuggingLogToConsole = flags.debug;
      Utility.debuggingLog(`OrchestratorInteractive.run(): this.id=${this.id}`);
      Utility.debuggingLog(`OrchestratorInteractive.run(): inputPath=${inputPath}`);
      Utility.debuggingLog(`OrchestratorInteractive.run(): outputPath=${outputPath}`);
      Utility.debuggingLog(`OrchestratorInteractive.run(): baseModelPath=${baseModelPath}`);
      Utility.debuggingLog(`OrchestratorInteractive.run(): ambiguousClosenessThresholdParameter=${ambiguousClosenessThresholdParameter}`);
      Utility.debuggingLog(`OrchestratorInteractive.run(): lowConfidenceScoreThresholdParameter=${lowConfidenceScoreThresholdParameter}`);
      Utility.debuggingLog(`OrchestratorInteractive.run(): multiLabelPredictionThresholdParameter=${multiLabelPredictionThresholdParameter}`);
      Utility.debuggingLog(`OrchestratorInteractive.run(): unknownLabelPredictionThresholdParameter=${unknownLabelPredictionThresholdParameter}`);
      Utility.debuggingLog(`OrchestratorTest.run(): fullEmbeddings=${fullEmbeddings}`);
      Utility.debuggingLog(`OrchestratorTest.run(): obfuscate=${obfuscate}`);
      await Orchestrator.predictAsync(
        baseModelPath, inputPath, outputPath,
        this.id as string,
        this.trackEvent,
        ambiguousClosenessThresholdParameter,
        lowConfidenceScoreThresholdParameter,
        multiLabelPredictionThresholdParameter,
        unknownLabelPredictionThresholdParameter,
        fullEmbeddings,
        obfuscate);
    } catch (error) {
      throw (new CLIError(error));
    }
    return 0;
  }
}
