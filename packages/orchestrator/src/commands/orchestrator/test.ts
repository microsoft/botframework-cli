/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {Orchestrator, Utility} from '@microsoft/bf-orchestrator';
import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';

export default class OrchestratorTest extends Command {
  static description: string = `The "test" command can operate in three modes: test, evaluation, assessment.
  If given a "--test" argument, then this command runs on the "test" mode.
  If not, but given a "--prediction" argument, then this command runs on the "assessment" mode.
  Otherwise, this command runs the "evaluation" mode.
  1) Test mode: test a collection of utterance/label samples loaded from an input file against
          a previously generated .blu snapshot/train file, and create a detailed train/test evaluation report.
  2) Evaluation mode: create an Orchestrator leave-one-out cross validation (LOOCV) evaluation report
          on a previously generated .blu snapshot file.
  3) Assessment mode: assess a collection of utterance/label predictions against their ground-truth and create an evaluation report,
          there is no need for a base model.`;

  static examples: Array<string> = [`
    $ bf orchestrator:test --in=./path/to/snapshot/file --test=./path/to/test/file/ --out=./path/to/output/ --model=./path/to/model/directory
    $ bf orchestrator:test --in=./path/to/ground-truth/file --prediction=./path/to/prediction/file --out=./path/to/output/folder/
    $ bf orchestrator:test --in=./path/to/snapshot/file --out=./path/to/output/folder/ [--model=./path/to/model/directory]`]

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Path to a previously created Orchestrator .blu file.'}),
    out: flags.string({char: 'o', description: 'Directory where analysis and output files will be placed.'}),
    model: flags.string({char: 'm', description: 'Optional directory for hosting Orchestrator config and base model files, not needed for the "assessment" mode.'}),
    test: flags.string({char: 't', description: 'Optional path to a test file. This option enable the "test" mode.'}),
    prediction: flags.string({char: 'p', description: 'Optional path to a prediction label file, or comma-separated paths to a collection of (e.g., crosss-valiaton) files.'}),
    ambiguousClosenessThreshold: flags.string({char: 'a', description: `Ambiguous threshold, default to ${Utility.DefaultAmbiguousClosenessThresholdParameter}`}),
    lowConfidenceScoreThreshold: flags.string({char: 'l', description: `Low confidence threshold, default to ${Utility.DefaultLowConfidenceScoreThresholdParameter}`}),
    multiLabelPredictionThreshold: flags.string({char: 'n', description: `Numeral/plural/multi-label prediction threshold, default to ${Utility.DefaultMultiLabelPredictionThresholdParameter}`}),
    unknownLabelPredictionThreshold: flags.string({char: 'u', description: `Unknow label threshold, default to ${Utility.DefaultUnknownLabelPredictionThresholdParameter}`}),
    fullEmbeddings: flags.boolean({description: 'Use full embeddings.'}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h'}),
  }

  async run(): Promise<number> {
    const {flags}: flags.Output = this.parse(OrchestratorTest);

    const inputPathConfiguration: string = flags.in;
    const outputPathConfiguration: string = flags.out;
    let baseModelPath: string = flags.model;
    if (baseModelPath) {
      baseModelPath = path.resolve(baseModelPath);
    }
    let testPath: string = flags.test;
    if (testPath) {
      testPath = path.resolve(testPath);
    }
    let predictionPathConfiguration: string = flags.prediction;
    if (predictionPathConfiguration) {
      predictionPathConfiguration = path.resolve(predictionPathConfiguration);
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

    Utility.debuggingLog(`OrchestratorTest.run(): inputPathConfiguration=${inputPathConfiguration}`);
    Utility.debuggingLog(`OrchestratorTest.run(): outputPathConfiguration=${outputPathConfiguration}`);
    Utility.debuggingLog(`OrchestratorTest.run(): baseModelPath=${baseModelPath}`);
    Utility.debuggingLog(`OrchestratorTest.run(): testPath=${testPath}`);
    Utility.debuggingLog(`OrchestratorTest.run(): predictionPathConfiguration=${predictionPathConfiguration}`);
    Utility.debuggingLog(`OrchestratorTest.run(): ambiguousClosenessThresholdParameter=${ambiguousClosenessThresholdParameter}`);
    Utility.debuggingLog(`OrchestratorTest.run(): lowConfidenceScoreThresholdParameter=${lowConfidenceScoreThresholdParameter}`);
    Utility.debuggingLog(`OrchestratorTest.run(): multiLabelPredictionThresholdParameter=${multiLabelPredictionThresholdParameter}`);
    Utility.debuggingLog(`OrchestratorTest.run(): unknownLabelPredictionThresholdParameter=${unknownLabelPredictionThresholdParameter}`);
    Utility.debuggingLog(`OrchestratorTest.run(): fullEmbeddings=${flags.fullEmbeddings}`);

    try {
      if (testPath) {
        await Orchestrator.testAsync(
          baseModelPath, inputPathConfiguration, testPath, outputPathConfiguration,
          ambiguousClosenessThresholdParameter,
          lowConfidenceScoreThresholdParameter,
          multiLabelPredictionThresholdParameter,
          unknownLabelPredictionThresholdParameter,
          flags.fullEmbeddings);
      } else if (predictionPathConfiguration) {
        await Orchestrator.assessAsync(
          inputPathConfiguration, predictionPathConfiguration, outputPathConfiguration);
      } else {
        await Orchestrator.evaluateAsync(
          inputPathConfiguration, outputPathConfiguration, baseModelPath,
          ambiguousClosenessThresholdParameter,
          lowConfidenceScoreThresholdParameter,
          multiLabelPredictionThresholdParameter,
          unknownLabelPredictionThresholdParameter,
          flags.fullEmbeddings);
      }
    } catch (error) {
      throw (new CLIError(error));
    }
    return 0;
  }
}
