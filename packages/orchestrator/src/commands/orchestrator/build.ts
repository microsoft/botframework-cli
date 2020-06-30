/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {LabelResolverHelper} from '../../utils/labelresolver';
//import {Utility} from '@microsoft/bf-orchestrator';

//import {LabelResolverHelper} from '@microsoft/bf-orchestrator';

import {Utility} from '../../utils/utility';
import {OrchestratorHelper} from '../../utils';

const oc = require('bindings')('oc_node');
const util = require('util')

export default class OrchestratorBuild extends Command {
  static description = 'describe the command here'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}];

  async run() {
    const {args, flags} = this.parse(OrchestratorBuild)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from D:\\src\\botframework-cli\\packages\\orchestrator\\src\\commands\\build.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
    
    let nlrPath = flags.model;
    if (!nlrPath || nlrPath.length == 0) {
      nlrPath = 'D:\\src\\TScience\\Orchestrator\\oc\\dep\\model';
    }

    const labelResolver = await LabelResolverHelper.createAsync(nlrPath);
    const example = { 
        label: 'travel', 
        text: 'book a flight to miami.',
        };
    
    if (labelResolver.addExample(example) == true)
    {
      this.log('Added example!');
    }

    const example2 = { 
      label: 'schedule', 
      text: 'when is my next appointment?',
      };
    let val = labelResolver.addExample(example2);
    if (val == true)
    {
        this.log('Added example2!');
    }
    const example3 = { 
        label: 'greeting', 
        text: 'hello there!',
        };
    val = labelResolver.addExample(example3);
    if (val == true)
    {
      this.log('Added example3!');
    }


    var results = labelResolver.score("hey");
    this.log(util.inspect(results, true, null, true));
    var snapshot = labelResolver.createSnapshot();
    this.log('Created snapshot!');
    this.log('Going to create labeler #2');
    let labeler2 = LabelResolverHelper.createWithSnapshot(snapshot); 
    this.log('Created Labeler #2.');


    //
    // Get Examples
    //
    console.log('Getting examples')
    let examples = labeler2.getExamples();
    console.log(util.inspect(examples, true, null, true));
    // 
    // Remove Example
    //
    labeler2.removeExample(example3);
    examples = labeler2.getExamples();
    console.log(util.inspect(examples, true, null, true));

    //
    // Get Labels
    //
    var labels = labeler2.getLabels();
    console.log(util.inspect(labels, true, null, true));

  }
}
