/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const url = require('url')
const httpsProxyAgent = require('https-proxy-agent')

const httpsProxy = function(config) {
  /* istanbul ignore if */
  if (config.socketPath != null) return config

  let parsed = url.parse(config.url)
  const protocol = parsed.protocol
  /* istanbul ignore if */
  if (protocol !== 'https:') return config

  const proxyUrl = process.env['HTTPS_PROXY'] || process.env['https_proxy']
  /* istanbul ignore if */
  if (!proxyUrl) return config

  parsed = url.parse(proxyUrl)
  const proxyOptions = {
  hostname: parsed.hostname,
  port: parsed.port
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

module.exports = httpsProxy;