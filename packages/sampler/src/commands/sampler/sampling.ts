/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {ComposerBootstrapSampler, ComposerReservoirSampler} from '@microsoft/bf-dispatcher';
import {Helper} from '../../utils/helper';
const LuisBuilder = require('@microsoft/bf-lu/lib/parser/luis/luisBuilder');
const LuConverter = require('@microsoft/bf-lu/lib/parser/luis/luConverter');

export default class SamplerSampling extends Command {
  static description: string = 'Do sampling to utterances in lu files';

  static examples: Array<string> = [
    `$ bf sampler:sampling --in ./path/to/file/`,
    `$ bf sampler:sampling --in ./path/to/file/ --out ./path/to/folder/`,
    `$ bf sampler:sampling --in ./path/to/file/ --out ./path/to/folder/ --maxImbalanceRatio 0.1`,
    `$ bf sampler:sampling --in ./path/to/file/ --out ./path/to/folder/ --maxImbalanceRatio 0.1 --maxUtteranceAllowed 15000`,
    `$ bf sampler:sampling --in ./path/to/file/ --out ./path/to/folder/ --maxImbalanceRatio 0.1 --maxUtteranceAllowed 15000 --sampleSize 2`
  ]

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Path to lu file or folder that contains lu files.'}),
    out: flags.string({char: 'o', description: 'Path where sampled lu files will be placed. Default to current working directory.'}),
    maxImbalanceRatio: flags.string({description: 'Max imbalance ratio for sampling.', default: '0.1'}),
    maxUtteranceAllowed: flags.integer({description: 'Max utterances allowed after samping.', default: 15000}),
    sampleSize: flags.integer({description: 'sample size.', default: 2}),
    help: flags.help({char: 'h', description: 'Sampler sampling command help'}),
  }

  async run() {
    const {flags}: flags.Output = this.parse(SamplerSampling);

    const input: string = path.resolve(flags.in || __dirname);
    const output: string = path.resolve(flags.out || __dirname);
    const maxImbalanceRatio = Number(flags.maxImbalanceRatio);
    const maxUtteranceAllowed = flags.maxUtteranceAllowed;
    const sampleSize = flags.sampleSize;

    try {
      let luContents = await Helper.readLuContents(input);
      const sampledLuContents = await Promise.all(
        luContents.map(async (luContent) => {
          const result = await LuisBuilder.fromLUAsync(luContent.content);
          const sampledResult = this.doDownSampling(result, {
            maxImbalanceRatio,
            maxUtteranceAllowed,
            sampleSizeConfiguration: sampleSize
          });

          const content = LuConverter(sampledResult);
          return { ...luContent, content };
        })
      );

      await Helper.writeLuContents(sampledLuContents, output);
    } catch (error) {
      throw (new CLIError(error));
    }
    return 0;
  }

  doDownSampling(luObject: any, samplingConfig: any) {
    //do bootstramp sampling to make the utterances' number ratio to 1:10
    const bootstrapSampler = new ComposerBootstrapSampler(
      luObject.utterances,
      samplingConfig.maxImbalanceRatio,
      samplingConfig.sampleSizeConfiguration
    );
    luObject.utterances = bootstrapSampler.getSampledUtterances();
    //if detect the utterances>15000, use reservoir sampling to down size
    const reservoirSampler = new ComposerReservoirSampler(
      luObject.utterances,
      samplingConfig.maxUtteranceAllowed
    );
    luObject.utterances = reservoirSampler.getSampledUtterances();
    return luObject;
  }
}
