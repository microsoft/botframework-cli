/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {} from 'mocha';
import {LuisQnaHelper} from '../src/luisqnahelper';
import assert = require('assert');

describe('LuisQnaHelperTests', () => {
  /*
  it('export LUIS app in lu format', async () => {
    const lu: string = await LuisQnaHelper.getLuFromLuisApp(
      'https://westus.api.cognitive.microsoft.com/',
      'cd913ff9-cce9-44ea-b473-246af725a448',
      '');
    assert.ok(lu.length > 0);
  });
  */
  it('export QnA kb', async () => {
    const qna: string = await LuisQnaHelper.getQnaFromKb(
      '213a48d3-855d-4083-af6d-339c03d497dd',
      '0c6d4b2072734dc194e8dba2793339d3');
    assert.ok(qna.length > 0);
  });
});
