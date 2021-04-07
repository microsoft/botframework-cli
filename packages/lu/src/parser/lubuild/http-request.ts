/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import axios from 'axios'

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
