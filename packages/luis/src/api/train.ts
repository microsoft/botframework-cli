import http from './http-request'
import EndpointParameters from './parameters'

const urlPath = '/luis/authoring/v3.0-preview/apps'

export default {
  async train(
    param: EndpointParameters,
    versionId: string) {
    let url = buildUrl(param.endpoint) + `/${param.appId}/versions/${versionId}/train`

    return http.post(url, param.subscriptionKey, {})
  },

  async getStatus(
    param: EndpointParameters,
    versionId: string) {
    let url = buildUrl(param.endpoint) + `/${param.appId}/versions/${versionId}/train`

    return http.get(url, param.subscriptionKey)
  }
}

const buildUrl = function (url: string) {
  return url + urlPath
}
