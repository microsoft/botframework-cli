/* eslint-disable @typescript-eslint/typedef */
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Utility} from './utility';

const oc = require('oc_node_authoring/oc_node_authoring.node');

export class LabelResolverHelper {
  public static Orchestrator: any;

  public static testTest(testStr: string) {
    Utility.writeToConsole("TEST TEST " + testStr);
  }
/*
  public static async createAsync(nlrPath: string) {
    try {
      if (nlrPath) {
        nlrPath = path.resolve(nlrPath);
      }
      if (nlrPath.length === 0) {
        throw new Error('Please provide path to Orchestrator model');
      }

      Utility.writeToConsole('Creating Orchestrator..');
      LabelResolverHelper.Orchestrator = new oc.Orchestrator();

      Utility.writeToConsole('Loading NLR..');
      if (await LabelResolverHelper.Orchestrator.load(nlrPath) === false) {
        Utility.writeToConsole('Loading NLR failed!!');
      }

      Utility.writeToConsole('Creating labeler..');
      return LabelResolverHelper.Orchestrator.createLabelResolver();
    } catch (error) {
      throw new Error(error);
    }
  }

  public static createWithSnapshot(snapshot: any) {
    return LabelResolverHelper.Orchestrator.createLabelResolver(snapshot);
  }*/
}
