import fetch from 'node-fetch'

let headers = {
  'Content-Type': 'application/json',
  'Ocp-Apim-Subscription-Key': ''
}

export default {
  async get(
    url: string,
    subscriptionKey: string) {
    setSubscriptionKey(subscriptionKey)
    const response = await fetch(url, {method: 'GET', headers})
    return response.json()
  },

  async post(
    url: string,
    subscriptionKey: string,
    body: any,
    extraHeaders = {}) {
    setSubscriptionKey(subscriptionKey)
    headers = {...headers, ...extraHeaders}
    const response = await fetch(url, {method: 'POST', headers, body: JSON.stringify(body)})
    return response.json()
  },

  async put(
    url: string,
    subscriptionKey: string,
    body: any) {
    setSubscriptionKey(subscriptionKey)
    const response = await fetch(url, {method: 'PUT', headers, body: JSON.stringify(body)})

    return isJSON(response) ? response.json() : {code: 'Success'}
  },

  async delete(
    url: string,
    subscriptionKey: string) {
    setSubscriptionKey(subscriptionKey)
    const response = await fetch(url, {method: 'DELETE', headers})
    
    return isJSON(response) ? response.json() : {code: 'Success'}
  }
}

const setSubscriptionKey = function (subscriptionKey: string) {
  headers['Ocp-Apim-Subscription-Key'] = subscriptionKey
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
