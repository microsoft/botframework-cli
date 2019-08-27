/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
const os = require('os');
const { insertParametersFromObject } = require('../insertParametersFromObject');
const deriveParamsFromPath = require('../deriveParamsFromPath');
const packageJSON = require('./../../package');

const fetch = require('node-fetch');

global.fetch = function (...args) {
    // No Proxy
    if (!process.env.HTTPS_PROXY) {
        return fetch(...args);
    }
    const [urlOrRequest, requestInit = {}, ...rest] = args;
    // URL is first param attach the proxy
    // to the RequestInit
    const HttpsProxyAgent = require('https-proxy-agent');
    const agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
    if (typeof urlOrRequest === 'string') {
        requestInit.agent = agent;
    } else {
        urlOrRequest.agent = agent;
    }
    return fetch(urlOrRequest, requestInit, ...rest);
};

/**
 * Base class for all services
 */
class ServiceBase {

    /**
     * @property {string} relativeEndpoint The endpoint for this service
     */

    /**
     *
     * @param {String} relativeEndpoint the endpoint for this service
     * @param {bool} useEndpoint (default is false) if true, use the endpoint service url, not the admin service url 
     */
    constructor(relativeEndpoint, useEndpoint) {
        this.relativeEndpoint = relativeEndpoint;
        this.useEndpoint = (useEndpoint === true);
    }

    /**
     * Creates a request to the specified endpoint and returns
     * a promise.
     *
     * @param {string} pathFragment An additional fragment to append to the endpoint
     * @param {*} params An object containing the named params to be used to hydrate the tokenized url
     * @param {'get'|'post'|'put'|'PATCH'|'delete'} method The method for the request
     * @param {*} dataModel The data model to pass in as the request body
     * @returns {Promise<Response>} The promise representing the request
     */
    createRequest(pathFragment, params, method, dataModel = null) {
        const { commonHeaders: headers, relativeEndpoint } = this;
        const { kbId } = ServiceBase.config;

        if (this.useEndpoint)
            headers.Authorization = "EndpointKey " + ServiceBase.config.endpointKey || params.endpointKey;
        else
            headers['Ocp-Apim-Subscription-Key'] = ServiceBase.config.subscriptionKey || params.subscriptionKey;

        let requestEndpoint;
        if (this.useEndpoint)
            requestEndpoint = params.hostname;
        else
            requestEndpoint = params.legacy ? "https://westus.api.cognitive.microsoft.com/qnamaker/v3.0" : "https://westus.api.cognitive.microsoft.com/qnamaker/v4.0";

        const tokenizedUrl = requestEndpoint + relativeEndpoint + pathFragment;
        // Order is important since we want to allow the user to
        // override their config with the data in the params object.
        params = Object.assign({}, (dataModel || {}), { kbId }, params);
        ServiceBase.validateParams(tokenizedUrl, params);

        let URL = insertParametersFromObject(tokenizedUrl, params);
        if (method === 'get' && ('skip' in params || 'take' in params)) {
            const { skip, take } = params;
            URL += '?';
            if (!isNaN(+skip)) {
                URL += `skip=${~~skip}`;
            }
            if (!isNaN(+take)) {
                URL += !isNaN(+skip) ? `&take=${~~take}` : `take=${~~take}`;
            }
        }
        const body = dataModel ? JSON.stringify(dataModel) : undefined;
        if (params.debug) {
            console.log(`${method.toUpperCase()} ${URL}`);
            if (headers)
                console.log(`HEADERS:${JSON.stringify(headers)}`);
            if (body)
                console.log(body);
        }
        return fetch(URL, { headers, method, body });
    }

    /**
     * Headers that are common to all requests
     *
     * @returns {{'Content-Type': string, 'Ocp-Apim-Subscription-Key': string, 'Authorization':string }}
     */
    get commonHeaders() {
        return {
            'Content-Type': 'application/json',
            'User-Agent': this.getUserAgent()
        };
    }

    getUserAgent() {
        const packageUserAgent = `${packageJSON.name}/${packageJSON.version}`;
        const platformUserAgent = `(${os.arch()}-${os.type()}-${os.release()}; Node.js,Version=${process.version})`;
        const userAgent = `${packageUserAgent} ${platformUserAgent}`;
        
        return userAgent;
    }    
}

/**
 * Validates the params object and will throw if
 * a required param is missing.
 *
 * @param tokenizedUrl
 * @param params
 */
ServiceBase.validateParams = function (tokenizedUrl, params) {
    const paramsFromPath = deriveParamsFromPath(tokenizedUrl);

    paramsFromPath.forEach(param => {
        if (!(param in params)) {
            const error = new Error(`The required param "${param}" is missing.`);
            error.name = 'ArgumentError';
            throw error;
        }
    });
};
/**
 * @type {*} The configuration object containing
 * the endpoint, appId, versionId and authoringKey properties.
 */
ServiceBase.config = { hostname: '', kbId: '', endpointKey: '', subscriptionKey: '' };

module.exports = { ServiceBase };
