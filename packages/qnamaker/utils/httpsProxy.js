/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

 const url = require('url')
 const httpsProxyAgent = require('https-proxy-agent')
 
 const httpsProxy = function(config) {
   const parsed = url.parse(config.url)
   const protocol = parsed.protocol
   if (protocol !== 'https:') {
       return config
   }
 
   const envProxy = process.env['HTTPS_PROXY'] || process.env['https_proxy']
   if (envProxy) {
     const parsed = url.parse(envProxy)
     const proxyOpt = 
     {
       hostname: parsed.hostname,
       port: parsed.port
     }
 
     if (parsed.auth) {
     proxyOpt.auth = parsed.auth
     }
     
     config.httpsAgent = httpsProxyAgent(proxyOpt)
     //Disable direct proxy
     config.proxy = false
   }
 
   return config
 }
 
 module.exports = httpsProxy