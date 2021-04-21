/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import httpsProxyAgent from 'https-proxy-agent'
import {AxiosRequestConfig} from 'axios'
import {Url, parse} from 'url'

export function httpsProxy(config: AxiosRequestConfig) {
  const parsed: Url = parse(config.url || '')
  const protocol = parsed.protocol
  if (protocol !== 'https:') {
    return config
  }

  const envProxy = process.env.HTTPS_PROXY || process.env.https_proxy
  if (envProxy) {
    const parsed: Url = parse(envProxy)
    const proxyOpt: Record<string, string | undefined> =
    {
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
