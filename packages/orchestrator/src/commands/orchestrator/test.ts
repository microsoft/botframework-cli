/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {Orchestrator, Utility} from '@microsoft/bf-orchestrator';
import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';

export default class OrchestratorTest extends Command {
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
    multiLabelPredictionThreshold: flags.string({char: 'p', description: `Plural/multi-label prediction threshold, default to ${Utility.DefaultMultiLabelPredictionThresholdParameter}`}),
    unknownLabelPredictionThreshold: flags.string({char: 'u', description: `Unknow label threshold, default to ${Utility.DefaultUnknownLabelPredictionThresholdParameter}`}),
    fullEmbeddings: flags.boolean({description: 'Use full embeddings.'}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h'}),
  }

  async run(): Promise<number> {
    const {flags}: flags.Output = this.parse(OrchestratorTest);

    const inputPath: string = flags.in;
    const testPath: string = flags.test;
    const outputPath: string = flags.out;
    let nlrPath: string = flags.model;
    if (nlrPath) {
      nlrPath = path.resolve(nlrPath);
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

    Utility.debuggingLog(`OrchestratorTest.run(): inputPath=${inputPath}`);
    Utility.debuggingLog(`OrchestratorTest.run(): testPath=${testPath}`);
    Utility.debuggingLog(`OrchestratorTest.run(): outputPath=${outputPath}`);
    Utility.debuggingLog(`OrchestratorTest.run(): nlrPath=${nlrPath}`);
    Utility.debuggingLog(`OrchestratorTest.run(): ambiguousClosenessThresholdParameter=${ambiguousClosenessThresholdParameter}`);
    Utility.debuggingLog(`OrchestratorTest.run(): lowConfidenceScoreThresholdParameter=${lowConfidenceScoreThresholdParameter}`);
    Utility.debuggingLog(`OrchestratorTest.run(): multiLabelPredictionThresholdParameter=${multiLabelPredictionThresholdParameter}`);
    Utility.debuggingLog(`OrchestratorTest.run(): unknownLabelPredictionThresholdParameter=${unknownLabelPredictionThresholdParameter}`);

    try {
      await Orchestrator.testAsync(
        nlrPath, inputPath, testPath, outputPath,
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
