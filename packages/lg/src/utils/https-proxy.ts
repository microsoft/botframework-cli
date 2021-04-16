/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const url = require('url')
const httpsProxyAgent = require('https-proxy-agent')

export function httpsProxy(config: any) {
  const parsed: any = url.parse(config.url)
  const protocol: any = parsed.protocol
  if (protocol !== 'https:') {
    return config
  }

  /* tslint:disable:no-string-literal */
  // eslint-disable-next-line dot-notation
  const envProxy: any = process.env['HTTPS_PROXY'] || process.env.https_proxy
  /* tslint:enable:no-string-literal */
  if (envProxy) {
    const parsed: any = url.parse(envProxy)
    const proxyOpt: any = {
      hostname: parsed.hostname,
      port: parsed.port,
    }

    if (parsed.auth) {
      (proxyOpt as any).auth = parsed.auth
    }

    config.httpsAgent = httpsProxyAgent(proxyOpt)
    // Disable direct proxy
    config.proxy = false
  }

  return config
}
