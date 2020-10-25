/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {Orchestrator, Utility} from '@microsoft/bf-orchestrator';
import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';

export default class OrchestratorTestCommand extends Command {
  static description: string = 'Test utterance/label samples from an input file and create an evaluation report';

  static examples: Array<string> = [`
    $ bf orchestrator:test --in=./path/to/snapshot/file --test=./path/to/test/file/ --out=./path/to/output/ --model=./path/to/model/directory`]

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Path to a previously created Orchestrator .blu file.'}),
    test: flags.string({char: 't', description: 'Path to a test file.'}),
    out: flags.string({char: 'o', description: 'Directory where analysis and output files will be placed.'}),
    model: flags.string({char: 'm', description: 'Directory or hosting Orchestrator config and base model files.'}),
    ambiguousClosenessThreshold: flags.string({char: 'a', description: `Ambiguous threshold, default to ${Utility.DefaultAmbiguousClosenessThresholdParameter}`}),
    lowConfidenceScoreThreshold: flags.string({char: 'l', description: `Low confidence threshold, default to ${Utility.DefaultLowConfidenceScoreThresholdParameter}`}),
    multiLabelPredictionThreshold: flags.string({char: 'n', description: `Numeral/plural/multi-label prediction threshold, default to ${Utility.DefaultMultiLabelPredictionThresholdParameter}`}),
    unknownLabelPredictionThreshold: flags.string({char: 'u', description: `Unknow label threshold, default to ${Utility.DefaultUnknownLabelPredictionThresholdParameter}`}),
    fullEmbeddings: flags.boolean({description: 'Optional flag to test on full embeddings instead of compact embeddings.'}),
    obfuscate: flags.boolean({description: 'Obfuscate labels and utterances in evaluation reports or not.'}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h'}),
  }

  async run(): Promise<number> {
    const {flags}: flags.Output = this.parse(OrchestratorTestCommand);

    const inputPath: string = flags.in;
    const testPath: string = flags.test;
    const outputPath: string = flags.out;
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

    Utility.debuggingLog(`OrchestratorTestCommand.run(): inputPath=${inputPath}`);
    Utility.debuggingLog(`OrchestratorTestCommand.run(): testPath=${testPath}`);
    Utility.debuggingLog(`OrchestratorTestCommand.run(): outputPath=${outputPath}`);
    Utility.debuggingLog(`OrchestratorTestCommand.run(): baseModelPath=${baseModelPath}`);
    Utility.debuggingLog(`OrchestratorTestCommand.run(): ambiguousClosenessThresholdParameter=${ambiguousClosenessThresholdParameter}`);
    Utility.debuggingLog(`OrchestratorTestCommand.run(): lowConfidenceScoreThresholdParameter=${lowConfidenceScoreThresholdParameter}`);
    Utility.debuggingLog(`OrchestratorTestCommand.run(): multiLabelPredictionThresholdParameter=${multiLabelPredictionThresholdParameter}`);
    Utility.debuggingLog(`OrchestratorTestCommand.run(): unknownLabelPredictionThresholdParameter=${unknownLabelPredictionThresholdParameter}`);

    try {
      await Orchestrator.testAsync(
        baseModelPath, inputPath, testPath, outputPath,
        ambiguousClosenessThresholdParameter,
        lowConfidenceScoreThresholdParameter,
        multiLabelPredictionThresholdParameter,
        unknownLabelPredictionThresholdParameter,
        flags.fullEmbeddings,
        flags.obfuscate);
    } catch (error) {
      throw (new CLIError(error));
    }
    return 0;
  }
}
