/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */

const axios = require('axios')
const url = require('url')
const httpsProxyAgent = require('https-proxy-agent')
const os = require('os')
const packageJSON = require('./../../../package')

function httpsProxy (config) {
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

axios.interceptors.request.use(httpsProxy)


/**
 * Base class for all services
 */
class ServiceBase {
  /**
   *
   * @param {string} rootEndpoint The root endpoint for this service
   * @param {string} subscriptionkey The subscription key for this service
   */
  constructor(rootEndpoint, subscriptionkey) {
    this.rootEndpoint = rootEndpoint
    this.headers = this.commonHeaders(subscriptionkey)
  }

  /**
   * Creates a request to the specified endpoint and returns
   * a promise.
   *
   * @param {string} relativeEndpoint The relative endpoint for the request
   * @param {'get'|'post'|'put'|'PATCH'|'delete'} method The method for the request
   * @param {any} data The request data
   * @returns {Promise<Response>} The promise representing the request
   */
  async httpRequest(relativeEndpoint, method, data) {
    let URL = this.rootEndpoint + relativeEndpoint
    let body
    if (typeof data === 'string') {
      URL += URL.includes('?') ? '&qnaformat=true' : '?qnaformat=true'
      this.headers['Content-Type'] = 'application/text'
      body = data
    } else if (typeof data === 'object') {
      this.headers['Content-Type'] = 'application/json'
      body = JSON.stringify(data)
    }
    
    let res
    try {
      let response = await axios({method, url: URL, headers: this.headers, data: body})
      res = response.data
    } catch (error) {
      if (error.response) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          res = error.response.data
        } else {
          // Something happened in setting up the request that triggered an Error
          return Error(error.message)
        }
      }
    }

    return res
  }

  commonHeaders(subscriptionKey) {
    return {
      'Content-Type': 'application/json',
      'User-Agent': process.env['QNA_USER_AGENT'] || this.getUserAgent(),
      'Ocp-Apim-Subscription-Key': subscriptionKey
    }
  }

  getUserAgent() {
    const packageUserAgent = `${packageJSON.name}/${packageJSON.version}`
    const platformUserAgent = `(${os.arch()}-${os.type()}-${os.release()}; Node.js,Version=${process.version})`
    const userAgent = `${packageUserAgent} ${platformUserAgent}`

    return userAgent
  }
}

module.exports = {ServiceBase}
