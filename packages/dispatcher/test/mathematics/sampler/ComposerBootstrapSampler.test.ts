// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/*
import { ComposerBootstrapSampler } from '../../../src/mathematics/sampler/ComposerBootstrapSampler';
const assert: any = require("assert");

describe('ComposerBootstrapSampler', () => {
  it('balence the utterances ratio in intents after bootstrap sampling', async () => {
    const utterances = [
      { intent: '0', text: '1', entities: [] },
      { intent: '0', text: '2', entities: [] },
      { intent: '1', text: '3', entities: [] },
      { intent: '1', text: '4', entities: [] },
      { intent: '1', text: '5', entities: [] },
      { intent: '1', text: '6', entities: [] },
      { intent: '1', text: '7', entities: [] },
    ];
    const sampler = new ComposerBootstrapSampler(utterances, 2, 2);
    const result = sampler.getSampledUtterances();
    const intent1 = result.filter((e) => e.intent === '1').length;
    assert(2 / intent1 === 0.5);
    const sampler1 = new ComposerBootstrapSampler(utterances, 5, 2);
    const result1 = sampler1.getSampledUtterances();
    const intent11 = result1.filter((e) => e.intent === '1').length;
    assert(intent11 === 5);
  });
});
*/