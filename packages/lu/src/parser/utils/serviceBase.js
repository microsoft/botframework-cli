/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
const os = require('os')
const packageJSON = require('./../../../package')

const fetch = require('node-fetch')

global.fetch = function (...args) {
  // No Proxy
  if (!process.env.HTTPS_PROXY) {
    return fetch(...args)
  }
  const [urlOrRequest, requestInit = {}, ...rest] = args
  // URL is first param attach the proxy
  // to the RequestInit
  const HttpsProxyAgent = require('https-proxy-agent')
  const agent = new HttpsProxyAgent(process.env.HTTPS_PROXY)
  if (typeof urlOrRequest === 'string') {
    requestInit.agent = agent
  } else {
    urlOrRequest.agent = agent
  }
  return fetch(urlOrRequest, requestInit, ...rest)
}

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
  createRequest(relativeEndpoint, method, data) {
    const URL = this.rootEndpoint + relativeEndpoint
    const body = data ? JSON.stringify(data) : undefined

    return fetch(URL, {headers: this.headers, method, body})
  }

  commonHeaders(subscriptionKey) {
    return {
      'Content-Type': 'application/json',
      'User-Agent': this.getUserAgent(),
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
