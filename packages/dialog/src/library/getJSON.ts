/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as fs from 'fs-extra'
const axios = require('axios')
const url = require('url')
const httpsProxyAgent = require('https-proxy-agent')

const httpsProxy = function (config) {
  const parsed = url.parse(config.url)
  const protocol = parsed.protocol
  if (protocol !== 'https:') {
      return config
  }

  /* tslint:disable:no-string-literal */
  const envProxy = process.env['HTTPS_PROXY'] || process.env['https_proxy']
  /* tslint:enable:no-string-literal */
  if (envProxy) {
    const parsed = url.parse(envProxy)
    const proxyOpt = {
    hostname: parsed.hostname,
    port: parsed.port
    }

    if (parsed.auth) {
    (proxyOpt as any).auth = parsed.auth
    }
    
    config.httpsAgent = httpsProxyAgent(proxyOpt)
    //Disable direct proxy
    config.proxy = false
  }

  return config
}
axios.interceptors.request.use(httpsProxy)

const filePrefix = 'file:///'

// Get JSON from a URL.
export default async function getJSON(url: string): Promise<any> {
  if (url.startsWith(filePrefix)) {
    return fs.readJSON(url.substring(filePrefix.length))
  }

  const resp = await axios.get(url);
  return resp.data
}
