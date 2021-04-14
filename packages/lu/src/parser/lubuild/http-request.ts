/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const axios = require('axios')
const url = require('url')
const httpsProxyAgent = require('https-proxy-agent')

function httpsProxy(config: any) {
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

export default {
  async get(
    url: string,
    headers: any) {
    const resp = await httpRequest(
      {
        method: 'GET',
        url,
        headers
      })

    return resp.data
  },

  async post(
    url: string,
    body: any,
    headers: any) {
    const resp = await httpRequest(
      {
        method: 'POST',
        url,
        data: body,
        headers
      })

    return resp.data
  },

  async put(
    url: string,
    body: any,
    headers: any) {
    const resp = await httpRequest(
      {
        method: 'PUT',
        url,
        data: body,
        headers
      })

    return isJSON(resp.data) ? resp.data : {code: 'Success'}
  },

  async delete(
    url: string,
    headers: any) {
    const resp = await httpRequest(
      {
        method: 'DELETE',
        url,
        headers
      })
    return isJSON(resp.data) ? resp.data : {code: 'Success'}
  }
}

const httpRequest = async function (config: any) {
  try {
    return await axios(config)
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return error.response
    } else {
      // Something happened in setting up the request that triggered an Error
      return Error(error.message)
    }
  }
}

/* tslint:disable:no-unused */
const isJSON = function (jsonObject: any) {
  try {
    JSON.parse(jsonObject + '')
  } catch (error) {
    return false
  }
  return true
}
