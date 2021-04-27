/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {ITextUtteranceLabelMapDataStructure} from '@microsoft/bf-dispatcher';
import {Example} from '@microsoft/bf-dispatcher';
import {Label} from '@microsoft/bf-dispatcher';
import {Span} from '@microsoft/bf-dispatcher';

import {Orchestrator} from '../src/orchestrator';
import {OrchestratorHelper} from '../src/orchestratorhelper';
import {OrchestratorBuild} from '../src/build';
import {OrchestratorBaseModel} from '../src/basemodel';
import {LabelResolver} from '../src/labelresolver';
import {Utility} from '../src/utility';
import {UnitTestHelper} from './utility.test';

import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';

import assert = require('assert');
import * as path from 'path';
const baseModelPath: string = path.resolve('./resources/model/model_dte_bert_3l');

describe('OrchestratorBuildTests', function () {
  beforeEach(async () => {
    Utility.debuggingLog('Downloading a base neural network language model for unit test');
    await UnitTestHelper.downloadModelFileForTest(
      baseModelPath,
      OrchestratorBaseModel.defaultHandler,
      OrchestratorBaseModel.defaultHandler);
  });

  it('Test.0000 - getExamplesLR should pull examples from labelResolver', async () => {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
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

    const examples: ITextUtteranceLabelMapDataStructure =
      OrchestratorBuild.getExamplesLR(labelResolver);
    assert.ok(examples !== null);
    assert.ok(examples.utteranceLabelsMap.size === 3);
  });

  it('Test.0001 - getExamplesLU should parse lu content into Examples', async () => {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
    const filename: string =
      'resources/data/LU/syncLabelResolver/same_as_code.lu';
    const fileContents: string = OrchestratorHelper.readFile(filename);
    const examples: ITextUtteranceLabelMapDataStructure =
      await OrchestratorBuild.getExamplesLU(fileContents);
    assert.ok(examples !== null);
    assert.ok(examples.utteranceLabelsMap.size === 3);
  });

  it('Test.0002 - syncLabelResolver-no differences LabelResolver/LU', async () => {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
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
    const examples_after_sync: ITextUtteranceLabelMapDataStructure =
      OrchestratorBuild.getExamplesLR(labelResolver);
    assert.ok(examples_after_sync !== null);
    assert.ok(examples_after_sync.utteranceLabelsMap.size === 3);
    assert.ok(examples_after_sync.utteranceLabelsMap.has('book a flight to miami.'));
    assert.ok(examples_after_sync.utteranceLabelsMap.has('play some mozart and metallica.'));
  });

  it('Test.0003 - syncLabelResolver-LU adds new travel intent', async () => {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
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
    const examples_before_sync: ITextUtteranceLabelMapDataStructure =
      OrchestratorBuild.getExamplesLR(labelResolver);
    Utility.debuggingLog('OrchestratorBuildTests Test.0003, checkpoint-A');
    assert.ok(examples_before_sync !== null);
    assert.ok(examples_before_sync.utteranceLabelsMap.size === 3);
    Utility.debuggingLog('OrchestratorBuildTests Test.0003, checkpoint-B');

    // Load up LU
    const filename: string =
      'resources/data/LU/syncLabelResolver/additional_travel.lu';
    const luContents: string = OrchestratorHelper.readFile(filename);

    // Action
    await OrchestratorBuild.syncLabelResolver(labelResolver, luContents);

    // Assert
    const examples_after_sync: ITextUtteranceLabelMapDataStructure =
      OrchestratorBuild.getExamplesLR(labelResolver);
    Utility.debuggingLog('OrchestratorBuildTests Test.0003, checkpoint-C');
    assert.ok(examples_after_sync !== null);
    Utility.debuggingLog(`OrchestratorBuildTests Test.0003, checkpoint-D: examples_after_sync.utteranceLabelsMap.size=${examples_after_sync.utteranceLabelsMap.size}`);
    assert.ok(examples_after_sync.utteranceLabelsMap.size === 4);
    Utility.debuggingLog('OrchestratorBuildTests Test.0003, checkpoint-E');
    assert.ok(examples_after_sync.utteranceLabelsMap.has('book a flight to miami.'));
    Utility.debuggingLog('OrchestratorBuildTests Test.0003, checkpoint-F');
  });

  it('Test.0004 - syncLabelResolver-LU removes travel intent', async () => {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
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
    const examples_before_sync: ITextUtteranceLabelMapDataStructure =
      OrchestratorBuild.getExamplesLR(labelResolver);
    assert.ok(examples_before_sync !== null);
    assert.ok(examples_before_sync.utteranceLabelsMap.size === 3);

    // Load up LU
    const filename: string =
      'resources/data/LU/syncLabelResolver/remove_travel.lu';
    const luContents: string = OrchestratorHelper.readFile(filename);

    // Action
    await OrchestratorBuild.syncLabelResolver(labelResolver, luContents);
    Utility.debuggingLog('OrchestratorBuildTests Test.0004, after calling OrchestratorBuild.syncLabelResolver()');

    // Assert
    const examples_after_sync: ITextUtteranceLabelMapDataStructure =
      OrchestratorBuild.getExamplesLR(labelResolver);
    assert.ok(examples_after_sync !== null);
    // eslint-disable-next-line no-console
    console.log(`>>>>>>>examples after sync: ${examples_after_sync.utteranceLabelsMap.size} (expected:2)`);
    assert.ok(examples_after_sync.utteranceLabelsMap.size === 2);
    assert.ok(examples_after_sync.utteranceLabelsMap.has('book meeting with architect for Monday.'));
  });

  it('Test.0005 - syncLabelResolver-detect multi-intent music label', async () => {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
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
          length: 0,
          offset: 0,
        },
        label_type: 1,
      },
      {
        name: 'city',
        span: {
          length: 0,
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
    Utility.debuggingLog('OrchestratorBuildTests Test.0005, after calling OrchestratorBuild.syncLabelResolver()');

    const examples_after_sync: Example[] = LabelResolver.getExamples(labelResolver).map(
      (x: any) => new Example(
        x.text,
        x.labels.map((y: any) => new Label(
          y.label_type,
          y.name,
          new Span(
            y.span.offset,
            y.span.length)))));

    assert.ok(examples_after_sync !== null);
    // eslint-disable-next-line no-console
    console.log(`>>>>>>>examples after sync: ${examples_after_sync.length} (expected3)`);
    assert.ok(examples_after_sync.length === 3);
    examples_after_sync.sort(Example.sortFunction);
    UtilityDispatcher.debuggingNamedLog1('OrchestratorBuildTests Test.0005', examples_after_sync, 'examples_after_sync');
    assert.ok(examples_after_sync[2].labels.length === 1); // LU file has precedence over Label Resolver

    // examples_after_sync.forEach(element => {
    //   console.log(`  Intent ${element.text}`);
    //   console.log(`  #Labels: ${element.labels.length}`);
    // });
  });

  it('Test.0006 - runAsync should work', async function () {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
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
    assert.ok(retPayload.settings.orchestrator.modelFolder === baseModelPath.replace(/\\/g, '/'));

    const payLoadOutputs: any[] = retPayload.outputs;
    const snapshots: Map<string, Uint8Array> = new Map<string, Uint8Array>();
    // eslint-disable-next-line guard-for-in
    for (const output of payLoadOutputs) {
      snapshots.set(output.id, output.snapshot);
    }

    assert.ok(snapshots.size === 5);
    const resolvers: Map<string, LabelResolver> = await Orchestrator.getLabelResolversAsync(baseModelPath, '', snapshots);
    assert.ok(resolvers.size === 5);
  });

  it('Test.0007 - runAsync with luConfig json', async () => {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
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

    const snapshotSettings: any = retPayload.settings.orchestrator.snapshots;
    assert.ok(snapshotSettings.RootDialog === 'test/fixtures/output/RootDialog.blu');
  });

  it('Test.0008 - runAsync changing files', async function () {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
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

  it('Test.0100 - intent-only snapshot should not contain entity labels after calling syncLabelResolver()', async () => {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultFunctionalTestTimeout());
    await LabelResolver.createAsync(baseModelPath, '');
    const example1: any = {
      labels: [{
        name: 'travel',
        span: {
          length: 0,
          offset: 0},
        label_type: 1}, {
        name: 'city',
        span: {
          length: 5,
          offset: 17},
        label_type: 2}],
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
    LabelResolver.addExample(example1);
    LabelResolver.addExample(example2);
    LabelResolver.addExample(example3);
    const snapshot: any = LabelResolver.createSnapshot();
    Utility.debuggingLog('OrchestratorBuildTests Test.0100, after calling LabelResolver.createSnapshot() - A');
    // ---- NOTE-FOR-DEBUGGING ---- Utility.debuggingLog(`OrchestratorBuildTests Test.0100, snapshot=${snapshot}`);
    const snapshotInString: string = (new TextDecoder()).decode(snapshot);
    Utility.debuggingLog(`OrchestratorBuildTests Test.0100, snapshotInString=${snapshotInString}`);
    const luContent: string = `
> LUIS application information
> !# @app.versionId = 0.1
> !# @app.culture = en-us
> !# @app.luis_schema_version = 3.2.0

> # Intent definitions

## travel
- book a flight to {@city=miami}.

## schedule
- book meeting with architect for Monday.

## music
- play some mozart and metallica.
`;
    await OrchestratorBuild.syncLabelResolver(LabelResolver.LabelResolver, luContent);
    const snapshotAfterSync: any = LabelResolver.createSnapshot();
    Utility.debuggingLog('OrchestratorBuildTests Test.0100, after calling LabelResolver.createSnapshot() - B');
    // ---- NOTE-FOR-DEBUGGING ---- Utility.debuggingLog(`OrchestratorBuildTests Test.0100, snapshotAfterSync=${snapshotAfterSync}`);
    const snapshotAfterSyncInString: string = (new TextDecoder()).decode(snapshotAfterSync);
    Utility.debuggingLog(`OrchestratorBuildTests Test.0100, snapshotAfterSyncInString=${snapshotAfterSyncInString}`);
    assert.ok(snapshot.length === snapshotAfterSync.length);
    for (let i: number = 0; i < snapshot.length; i++) {
      assert.ok(snapshot[i] === snapshotAfterSync[i]);
    }
  });
});
