/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as fs from 'fs-extra'
const axios = require('axios')
const axiosHttpsProxy = require('axios-https-proxy')
axios.interceptors.request.use(axiosHttpsProxy)

const filePrefix = 'file:///'

// Get JSON from a URL.
export default async function getJSON(url: string): Promise<any> {
  if (url.startsWith(filePrefix)) {
    return fs.readJSON(url.substring(filePrefix.length))
  }

  const resp = await axios.get(url);
  return resp.data
}
