/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as fs from 'fs-extra'
const axios = require('axios')
const url = require('url')
const httpsProxyAgent = require('https-proxy-agent')

function httpsProxy (config) {
  /* istanbul ignore if */
  if (config.socketPath != null) return config

  let parsed = url.parse(config.url)
  const protocol = parsed.protocol
  /* istanbul ignore if */
  if (protocol !== 'https:') return config

  var proxyUrl = process.env['HTTPS_PROXY'] || process.env['https_proxy']
  /* istanbul ignore if */
  if (!proxyUrl) return config

  parsed = url.parse(proxyUrl)
  const proxyOptions = {
  hostname: parsed.hostname,
  port: parsed.port,
  auth: undefined
  }

  if (parsed.auth) {
  proxyOptions.auth = parsed.auth
  }


  // HTTPS request must use tunnel proxy protocol
  config.httpsAgent = httpsProxyAgent(proxyOptions)

  // Disable direct proxy protocol in axios http adapter
  config.proxy = false

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
