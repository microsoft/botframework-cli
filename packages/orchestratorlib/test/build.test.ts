/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {Orchestrator} from '../src/orchestrator';
import {OrchestratorHelper} from '../src/orchestratorhelper';
import {OrchestratorBuild} from '../src/build';
import {OrchestratorBaseModel} from '../src/basemodel';
import {LabelResolver} from '../src/labelresolver';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';
import {Example} from '@microsoft/bf-dispatcher';

import assert = require('assert');
import * as path from 'path';
const basemodelId: string = 'pretrained.20200924.microsoft.dte.00.03.en.onnx';
const baseModelPath: string = path.resolve('./resources/model/model_dte_bert_3l');

describe('OrchestratorBuildTests', function () {
  beforeEach(async () => {
    Utility.debuggingLog('Downloading a base neural network language model for unit test');
    await UnitTestHelper.downloadModelFileForTest(
      basemodelId,
      baseModelPath,
      OrchestratorBaseModel.defaultHandler,
      OrchestratorBaseModel.defaultHandler);
  });

  it('getExamplesLR should pull examples from labelResolver', async () => {
    // const orchestrator: any = await LabelResolver.loadNlrAsync(baseModelPath);
    const labelResolver: any = LabelResolver.createLabelResolver();
    const example1: any = {
      labels: [{name: 'travel',
        span: {
          length: 0,
          offset: 0},
        label_type: 1}],
      text: 'book a flight to miami.',
    };
    const example2: any = {
      labels: [{name: 'schedule',
        span: {
          length: 0,
          offset: 0},
        label_type: 1}],
      text: 'book meeting with architect for Monday.',
    };
    const example3: any = {
      labels: [{name: 'music',
        span: {
          length: 0,
          offset: 0},
        label_type: 1}],
      text: 'play some mozart and metallica.',
    };

    LabelResolver.addExample(example1, labelResolver);
    LabelResolver.addExample(example2, labelResolver);
    LabelResolver.addExample(example3, labelResolver);

    const examples: Example[] = await OrchestratorBuild.getExamplesLR(labelResolver);
    assert.ok(examples !== null);
    assert.ok(examples.length === 3);
  });

  it('getExamplesLU should parse lu content into Examples', async () => {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    const filename: string =
      'resources/data/LU/syncLabelResolver/same_as_code.lu';
    const fileContents: string = OrchestratorHelper.readFile(filename);
    const examples: Example[] = await OrchestratorBuild.getExamplesLU(fileContents);

    Utility.debuggingLog(`Examples[1]="${examples[0].text}"`);
    assert.ok(examples !== null);
    assert.ok(examples.length === 3);
  });

  it('syncLabelResolver-no differences LabelResolver/LU', async () => {
    // Arrange
    // Load up Label Resolver
    const labelResolver: any = LabelResolver.createLabelResolver();
    const example1: any = {
      labels: [{name: 'travel',
        span: {
          length: 0,
          offset: 0},
        label_type: 1}],
      text: 'book a flight to miami.',
    };
    const example2: any = {
      labels: [{name: 'schedule',
        span: {
          length: 0,
          offset: 0},
        label_type: 1}],
      text: 'book meeting with architect for Monday.',
    };
    const example3: any = {
      labels: [{name: 'music',
        span: {
          length: 0,
          offset: 0},
        label_type: 1}],
      text: 'play some mozart and metallica.',
    };

    LabelResolver.addExample(example1, labelResolver);
    LabelResolver.addExample(example2, labelResolver);
    LabelResolver.addExample(example3, labelResolver);
    // Load up LU
    const filename: string =
        'resources/data/LU/syncLabelResolver/same_as_code.lu';
    const luContents: string = OrchestratorHelper.readFile(filename);

    await OrchestratorBuild.syncLabelResolver(labelResolver, luContents);

    // Assert
    const examples_after_sync: Example[] = await OrchestratorBuild.getExamplesLR(labelResolver);
    assert.ok(examples_after_sync !== null);
    assert.ok(examples_after_sync.length === 3);
    examples_after_sync.sort(Example.sort_fn);
    assert.ok(examples_after_sync[0].text === 'book a flight to miami.');
    assert.ok(examples_after_sync[2].text === 'play some mozart and metallica.');
  });

  it('syncLabelResolver-LU adds new travel intent', async () => {
    // Arrange
    // Load up Label Resolver
    const labelResolver: any = LabelResolver.createLabelResolver();
    const example1: any = {
      labels: [{name: 'travel',
        span: {
          length: 0,
          offset: 0},
        label_type: 1}],
      text: 'book a flight to miami.',
    };
    const example2: any = {
      labels: [{name: 'schedule',
        span: {
          length: 0,
          offset: 0},
        label_type: 1}],
      text: 'book meeting with architect for Monday.',
    };
    const example3: any = {
      labels: [{name: 'music',
        span: {
          length: 0,
          offset: 0},
        label_type: 1}],
      text: 'play some mozart and metallica.',
    };

    LabelResolver.addExample(example1, labelResolver);
    LabelResolver.addExample(example2, labelResolver);
    LabelResolver.addExample(example3, labelResolver);

    // Check  examples before sync
    const examples_before_sync: Example[] = await OrchestratorBuild.getExamplesLR(labelResolver);
    assert.ok(examples_before_sync !== null);
    assert.ok(examples_before_sync.length === 3);

    // Load up LU
    const filename: string =
      'resources/data/LU/syncLabelResolver/additional_travel.lu';
    const luContents: string = OrchestratorHelper.readFile(filename);

    // Action
    await OrchestratorBuild.syncLabelResolver(labelResolver, luContents);

    // Assert
    const examples_after_sync: Example[] = await OrchestratorBuild.getExamplesLR(labelResolver);
    assert.ok(examples_after_sync !== null);
    assert.ok(examples_after_sync.length === 4);
    examples_after_sync.sort(Example.sort_fn);
    assert.ok(examples_after_sync[0].text === 'book a flight to miami.');
  });

  it('syncLabelResolver-LU removes travel intent', async () => {
    // Arrange
    // Load up Label Resolver
    const labelResolver: any = LabelResolver.createLabelResolver();
    const example1: any = {
      labels: [{name: 'travel',
        span: {
          length: 0,
          offset: 0},
        label_type: 1}],
      text: 'book a flight to miami.',
    };
    const example2: any = {
      labels: [{name: 'schedule',
        span: {
          length: 0,
          offset: 0},
        label_type: 1}],
      text: 'book meeting with architect for Monday.',
    };
    const example3: any = {
      labels: [{name: 'music',
        span: {
          length: 0,
          offset: 0},
        label_type: 1}],
      text: 'play some mozart and metallica.',
    };

    LabelResolver.addExample(example1, labelResolver);
    LabelResolver.addExample(example2, labelResolver);
    LabelResolver.addExample(example3, labelResolver);

    // Check  examples before sync
    const examples_before_sync: Example[] = await OrchestratorBuild.getExamplesLR(labelResolver);
    assert.ok(examples_before_sync !== null);
    assert.ok(examples_before_sync.length === 3);

    // Load up LU
    const filename: string =
      'resources/data/LU/syncLabelResolver/remove_travel.lu';
    const luContents: string = OrchestratorHelper.readFile(filename);

    // Action
    await OrchestratorBuild.syncLabelResolver(labelResolver, luContents);

    // Assert
    const examples_after_sync: Example[] = await OrchestratorBuild.getExamplesLR(labelResolver);
    assert.ok(examples_after_sync !== null);
    // eslint-disable-next-line no-console
    console.log(`>>>>>>>examples after sync: ${examples_after_sync.length} (expected:2)`);
    assert.ok(examples_after_sync.length === 2);
    examples_after_sync.sort(Example.sort_fn);
    assert.ok(examples_after_sync[0].text === 'book meeting with architect for Monday.');
  });

  it('syncLabelResolver-detect multi-intent music label', async () => {
    // Arrange
    // Load up Label Resolver.
    // Note: LU file should override example3 - Composer can't see this type of
    // multi-intent.
    // const orchestrator: any = await LabelResolver.loadNlrAsync(baseModelPath);
    const labelResolver: any = LabelResolver.createLabelResolver();
    const example1: any = {
      labels: [{name: 'travel',
        span: {
          length: 0,
          offset: 0},
        label_type: 1}],
      text: 'book a flight to miami.',
    };
    const example2: any = {
      labels: [{name: 'schedule',
        span: {
          length: 0,
          offset: 0},
        label_type: 1}],
      text: 'book meeting with architect for Monday.',
    };
    const example3: any = {
      labels: [{
        name: 'travel',
        span: {
          length: 6,
          offset: 9,
        },
        label_type: 1,
      },
      {
        name: 'city',
        span: {
          length: 7,
          offset: 0,
        },
        label_type: 1,
      }],
      text: 'play some mozart and metallica.',
      label_type: 1,
    };

    LabelResolver.addExample(example1, labelResolver);
    LabelResolver.addExample(example2, labelResolver);
    LabelResolver.addExample(example3, labelResolver);
    // Load up LU
    const filename: string =
        'resources/data/LU/syncLabelResolver/same_as_code.lu';
    const luContents: string = OrchestratorHelper.readFile(filename);

    await OrchestratorBuild.syncLabelResolver(labelResolver, luContents);

    const examples_after_sync: Example[] = LabelResolver.getExamples(labelResolver);

    assert.ok(examples_after_sync !== null);
    // eslint-disable-next-line no-console
    console.log(`>>>>>>>examples after sync: ${examples_after_sync.length} (expected3)`);
    assert.ok(examples_after_sync.length === 3);
    examples_after_sync.sort(Example.sort_fn);
    assert.ok(examples_after_sync[2].labels.length === 1); // LU file has precedence over Label Resolver

    // examples_after_sync.forEach(element => {
    //   console.log(`  Intent ${element.text}`);
    //   console.log(`  #Labels: ${element.labels.length}`);
    // });
  });

  it('runAsync should work', async function () {
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout() + 50000);
    const labelResolversById: Map<string, LabelResolver> = new Map<string, LabelResolver>();
    const retPayload: any = await OrchestratorBuild.runAsync(
      baseModelPath,
      '',
      OrchestratorHelper.getLuInputs('./test/fixtures/adaptive/'),
      labelResolversById,
      true,
      null);

    assert.ok(retPayload !== null);
    assert.ok(retPayload.outputs !== null);
    assert.ok(retPayload.outputs.length === 5);
    assert.ok(retPayload.settings.orchestrator.modelFolder === baseModelPath);

    const payLoadOutputs: any[] = retPayload.outputs;
    const snapshots: Uint8Array[] = [];
    let output: any;
    // eslint-disable-next-line guard-for-in
    for (output in payLoadOutputs) {
      snapshots.push(output.snapshot);
    }

    assert.ok(snapshots.length === 5);
    const resolvers: LabelResolver[] = await Orchestrator.getLabelResolversAsync(baseModelPath, snapshots);
    assert.ok(resolvers.length === 5);
  });

  it('runAsync with luConfig json', async () => {
    const labelResolversById: Map<string, LabelResolver> = new Map<string, LabelResolver>();
    const retPayload: any = await OrchestratorBuild.runAsync(
      baseModelPath,
      '',
      [],
      labelResolversById,
      true,
      JSON.parse(OrchestratorHelper.readFile('./test/fixtures/luconfig.json')));

    assert.ok(retPayload !== null);
    assert.ok(retPayload.outputs !== null);
    OrchestratorHelper.writeBuildOutputFiles('./test/fixtures/output', retPayload);
    assert.ok(Utility.exists('./test/fixtures/output/RootDialog.blu'));
    assert.ok(Utility.exists('./test/fixtures/output/RootDialog.en-us.lu.dialog'));
    assert.ok(Utility.exists('./test/fixtures/output/RootDialog.lu.dialog'));
  });

  it('runAsync changing files', async function () {
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout() + 50000);
    const labelResolversById: Map<string, LabelResolver> = new Map<string, LabelResolver>();
    const retPayload: any = await OrchestratorBuild.runAsync(
      baseModelPath,
      '',
      OrchestratorHelper.getLuInputs('./test/fixtures/adaptive/'),
      labelResolversById,
      true,
      JSON.parse(OrchestratorHelper.readFile('./test/fixtures/luconfig.json')));
    // labelResolversById.forEach((labelResolver: LabelResolver, labelId: string) => {
    //   console.log(`  id: ${labelId}`);
    //   let examples_after_sync: Example[] = LabelResolver.getExamples(labelResolver);
    //   console.log(`  count of examples: ${examples_after_sync.length}`);
    // });

    assert.ok(labelResolversById.size === 5);
    assert.ok(labelResolversById.has('AddToDoDialog'));
    assert.ok(labelResolversById.get('AddToDoDialog') !== null);
    assert.ok(LabelResolver.getExamples(labelResolversById.get('AddToDoDialog')).length === 108);
    assert.ok(labelResolversById.has('DeleteToDoDialog'));
    assert.ok(labelResolversById.get('DeleteToDoDialog') !== null);
    assert.ok(LabelResolver.getExamples(labelResolversById.get('DeleteToDoDialog')).length === 112);
    assert.ok(labelResolversById.has('GetUserProfileDialog'));
    assert.ok(labelResolversById.get('GetUserProfileDialog') !== null);
    assert.ok(LabelResolver.getExamples(labelResolversById.get('GetUserProfileDialog')).length === 121);
    assert.ok(labelResolversById.has('RootDialog'));
    assert.ok(labelResolversById.get('RootDialog') !== null);
    assert.ok(LabelResolver.getExamples(labelResolversById.get('RootDialog')).length === 123);
    assert.ok(labelResolversById.has('ViewToDoDialog'));
    assert.ok(labelResolversById.get('ViewToDoDialog') !== null);
    assert.ok(LabelResolver.getExamples(labelResolversById.get('ViewToDoDialog')).length === 90);
    assert.ok(retPayload !== null);
    assert.ok(retPayload.outputs !== null);

    const retPayload2: any = await OrchestratorBuild.runAsync(
      baseModelPath,
      '',
      OrchestratorHelper.getLuInputs('./test/fixtures/adaptive/'),
      labelResolversById,
      true,
      JSON.parse(OrchestratorHelper.readFile('./test/fixtures/luconfig.json')));

    // labelResolversById.forEach((labelResolver: LabelResolver, labelId: string) => {
    //   console.log(`  id: ${labelId}`);
    //   let examples_after_sync: Example[] = LabelResolver.getExamples(labelResolver);
    //   console.log(`  count of examples: ${examples_after_sync.length}`);
    // });

    assert.ok(labelResolversById.size === 5);
    assert.ok(labelResolversById.has('AddToDoDialog'));
    assert.ok(labelResolversById.get('AddToDoDialog') !== undefined);
    assert.ok(labelResolversById.get('AddToDoDialog') !== null);
    assert.ok(labelResolversById.has('DeleteToDoDialog'));
    assert.ok(labelResolversById.get('DeleteToDoDialog') !== null);
    assert.ok(LabelResolver.getExamples(labelResolversById.get('DeleteToDoDialog')).length === 112);
    assert.ok(labelResolversById.has('GetUserProfileDialog'));
    assert.ok(labelResolversById.get('GetUserProfileDialog') !== null);
    assert.ok(LabelResolver.getExamples(labelResolversById.get('GetUserProfileDialog')).length === 121);
    assert.ok(labelResolversById.has('RootDialog'));
    assert.ok(labelResolversById.get('RootDialog') !== null);
    assert.ok(LabelResolver.getExamples(labelResolversById.get('RootDialog')).length === 123);
    assert.ok(labelResolversById.has('ViewToDoDialog'));
    assert.ok(labelResolversById.get('ViewToDoDialog') !== null);
    assert.ok(LabelResolver.getExamples(labelResolversById.get('ViewToDoDialog')).length === 90);
    assert.ok(retPayload2 !== null);
    assert.ok(retPayload2.outputs !== null);
  });
});
