import http from './http-request'
import EndpointParameters from './parameters'

const urlPath = '/luis/authoring/v3.0-preview/apps'

export default {
  async assignAzureAccount(
    param: EndpointParameters,
    armToken: string,
    azureSubscriptionId: string,
    resourceGroup: string,
    accountName: string) {
    let url = buildUrl(param.endpoint) + `/${param.appId}/azureaccounts`

    const appJSON = {
      azureSubscriptionId,
      resourceGroup,
      accountName,
    }

    return http.post(url, param.subscriptionKey, appJSON, {Authorization: 'Bearer ' + armToken})
  },

  async create(
    param: EndpointParameters,
    applicationCreateObject: any) {
    let url = buildUrl(param.endpoint)

    return http.post(url, param.subscriptionKey, applicationCreateObject)
  },

  async delete(
    param: EndpointParameters) {
    let url = buildUrl(param.endpoint) + `/${param.appId}`

    return http.delete(url, param.subscriptionKey)
  },

  async getEndpoints(
    param: EndpointParameters) {
    let url = buildUrl(param.endpoint) + `/${param.appId}/endpoints`
    return http.get(url, param.subscriptionKey)
  },

  async import(
    param: EndpointParameters, 
    appJSON: any, 
    name = '') {
    name = name ? `?appName=${name}` : ''
    let url = buildUrl(param.endpoint) + `/import${name}`
    return http.post(url, param.subscriptionKey, appJSON)
  },

  async list(
    param: EndpointParameters,
    skip = '0',
    take = '100') {
    let url = buildUrl(param.endpoint) + `/?skip=${skip}&take=${take}`

    return http.get(url, param.subscriptionKey)
  },

  async publish(
    param: EndpointParameters,
    applicationPublishObject: any) {
    let url = buildUrl(param.endpoint) + `/${ param.appId}/publish`

    return http.post(url, param.subscriptionKey, applicationPublishObject)
  },

  async query(
    param: EndpointParameters,
    slotName = 'production',
    query: string,
    log: true,
    show_all = false,
    timezone = '') {
    let url = param.endpoint +
    `/luis/prediction/v3.0/apps/${param.appId}/slots/${slotName}/predict?verbose=false&log=${log}&show-all-intents=${show_all}`

    let body: any = {query}

    if (timezone) {
      body.options = {
        datetimeReference: timezone,
      }
    }

    return http.post(url, param.subscriptionKey, body)
  },

  async rename(
    param: EndpointParameters,
    name: string,
    description: string) {
    let url = buildUrl(param.endpoint) + `/${param.appId}`

    const body = {
      name,
      description
    }

    return http.put(url, param.subscriptionKey, body)
  },

  async show(
    param: EndpointParameters) {
    let url = buildUrl(param.endpoint) + `/${param.appId}`
    return http.get(url, param.subscriptionKey)
  }
}

const buildUrl = function (url: string) {
  return url + urlPath
}
