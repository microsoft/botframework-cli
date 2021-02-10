import axios from 'axios'

let headers = {
  'Content-Type': 'application/json',
  'Ocp-Apim-Subscription-Key': ''
}

export default {
  async get(
    url: string,
    subscriptionKey: string) {
    const resp = await httpRequest(
      subscriptionKey,
      {
        method: 'GET',
        url,
        headers
      })

    return resp.data

  },

  async post(
    url: string,
    subscriptionKey: string,
    body: any,
    extraHeaders = {}) {
    headers = {...headers, ...extraHeaders}

    const resp = await httpRequest(
      subscriptionKey,
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
    subscriptionKey: string,
    body: any) {
    const resp = await httpRequest(
      subscriptionKey,
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
    subscriptionKey: string) {
    const resp = await httpRequest(
      subscriptionKey,
      {
        method: 'DELETE',
        url,
        headers
      })
    return isJSON(resp.data) ? resp.data : {code: 'Success'}
  }
}

const httpRequest = async function (subscriptionKey: string, config: any) {
  setSubscriptionKey(subscriptionKey)
  try {
    return await axios(config)
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw Error(`Code: ${error.response.statusText} Message: ${error.response.data.error.message}`)
    } else {
      // Something happened in setting up the request that triggered an Error
      throw Error(error.message)
    }
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
