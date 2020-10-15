import http from './http-request'
import EndpointParameters from './parameters'

const urlPath = '/luis/authoring/v3.0-preview/apps'

export default {
  async clone(
    param: EndpointParameters,
    oldVersionId: string,
    version: string) {
    let url = buildUrl(param.endpoint) + `/${param.appId}/versions/${oldVersionId}/clone`

    return http.post(url, param.subscriptionKey, {version})
  },

  async delete(
    param: EndpointParameters,
    versionId: string) {
    let url = buildUrl(param.endpoint) + `/${param.appId}/versions/${versionId}/`

    return http.delete(url, param.subscriptionKey)
  },

  async export(
    param: EndpointParameters,
    versionId: string) {
    let url = buildUrl(param.endpoint) + `/${param.appId}/versions/${versionId}/export?format=json"`
    return http.get(url, param.subscriptionKey)
  },

  async import(
    param: EndpointParameters,
    appJSON: any,
    versionId: string) {
    let url = buildUrl(param.endpoint) + `/${param.appId}/versions/import?versionId=${versionId}`

    return http.post(url, param.subscriptionKey, appJSON)
  },

  async list(
    param: EndpointParameters,
    skip = '0',
    take = '100') {
    let url = buildUrl(param.endpoint) + `/${param.appId}/versions/?skip=${skip}&take=${take}]`

    return http.get(url, param.subscriptionKey)
  },

  async rename(
    param: EndpointParameters,
    versionId: string,
    newVersion: string) {
    let url = buildUrl(param.endpoint) + `/${param.appId}/versions/${versionId}/`

    return http.put(url, param.subscriptionKey, {version: newVersion})
  }
}

const buildUrl = function (url: string) {
  return url + urlPath
}
