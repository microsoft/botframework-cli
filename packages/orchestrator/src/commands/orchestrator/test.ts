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
    const {flags}: flags.Output = this.parse(OrchestratorTest);

    const inputPath: string = flags.in;
    const testPath: string = flags.test;
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

    Utility.debuggingLog(`OrchestratorTest.run(): inputPath=${inputPath}`);
    Utility.debuggingLog(`OrchestratorTest.run(): testPath=${testPath}`);
    Utility.debuggingLog(`OrchestratorTest.run(): outputPath=${outputPath}`);
    Utility.debuggingLog(`OrchestratorTest.run(): nlrPath=${nlrPath}`);
    Utility.debuggingLog(`OrchestratorTest.run(): ambiguousClosenessParameter=${ambiguousClosenessParameter}`);
    Utility.debuggingLog(`OrchestratorTest.run(): lowConfidenceScoreThresholdParameter=${lowConfidenceScoreThresholdParameter}`);
    Utility.debuggingLog(`OrchestratorTest.run(): multiLabelPredictionThresholdParameter=${multiLabelPredictionThresholdParameter}`);
    Utility.debuggingLog(`OrchestratorTest.run(): unknownLabelPredictionThresholdParameter=${unknownLabelPredictionThresholdParameter}`);

    try {
      await Orchestrator.testAsync(
        nlrPath, inputPath, testPath, outputPath,
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
