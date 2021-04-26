/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const {ServiceBase} = require('./serviceBase')
const NEWLINE = require('os').EOL

const absoluteUrlPattern = /^https?:\/\//i

export class QnaBuildCore {
  private readonly service: any

  constructor(subscriptionkey: string, endpoint: string) {
    // check endpoint is absolute or not
    if (!absoluteUrlPattern.test(endpoint)) {
      throw new Error(`Only absolute URLs are supported. "${endpoint}" is not an absolute qnamaker endpoint URL.`)
    }

    this.service = new ServiceBase(endpoint, subscriptionkey)
  }

  public async getKBList() {
    const kbList = await this.service.httpRequest('/knowledgebases', 'GET')
    if (kbList?.error) {
      throw kbList.error
    }

    return kbList
  }

  public async getKB(kbId: string) {
    const kb = await this.service.httpRequest(`/knowledgebases/${kbId}`, 'GET')
    if (kb?.error) {
      throw kb.error
    }

    return kb
  }

  public async importKB(kbPayload: any) {
    const status = await this.service.httpRequest('/knowledgebases/createasync', 'POST', kbPayload)
    if (status?.error) {
      throw status.error
    }

    return status
  }

  public async getOperationStatus(operationId: string) {
    const status = await this.service.httpRequest(`/operations/${operationId}`, 'GET')
    if (status?.error) {
      throw status.error
    }

    return status
  }

  public async exportKB(kbId: string, environment: string) {
    const kb = await this.service.httpRequest(`/knowledgebases/${kbId}/${environment}/qna`, 'GET')
    if (kb?.error) {
      throw kb.error
    }

    return kb
  }

  public async updateKB(kbId: string, replaceKb: any) {
    const status = await this.service.httpRequest(`/knowledgebases/${kbId}`, 'PATCH', replaceKb)
    if (status?.error) {
      throw status.error
    }

    return status
  }

  public async replaceKB(kbId: string, replaceKb: any) {
    const text = await this.service.httpRequest(`/knowledgebases/${kbId}`, 'PUT', replaceKb)
    if (text?.error) {
      throw text.error
    }
  }

  public async publishKB(kbId: string) {
    const text = await this.service.httpRequest(`/knowledgebases/${kbId}`, 'POST')
    if (text?.error) {
      throw text.error
    }
  }

  public async replaceAlt(altJson: any) {
    const text = await this.service.httpRequest('/alterations', 'PUT', altJson)
    if (text?.error) {
      throw text.error
    }
  }

  public async getEndpointKeys() {
    const endpointKeys = await this.service.httpRequest('/endpointkeys', 'GET')
    if (endpointKeys?.error) {
      throw endpointKeys.error
    }

    return endpointKeys
  }

  public async deleteKB(kbId: string) {
    const text = await this.service.httpRequest(`/knowledgebases/${kbId}`, 'DELETE')
    if (text?.error) {
      throw text.error
    }
  }

  public isKBEqual(kbA: any, kbB: any): boolean {
    const qnaListA = kbA.qnaList
    const qnaListAToCompare = qnaListA.map((qna: any) => {
      return {
        id: qna.id,
        answer: qna.answer,
        source: qna.source,
        questions: qna.questions.slice(),
        metadata: qna.metadata.slice(),
        context: qna.context
      }
    })

    const qnaDocumentsB = kbB.qnaDocuments || []
    const qnaListBToCompare = qnaDocumentsB.map((qna: any) => {
      return {
        id: qna.id,
        answer: qna.answer,
        source: qna.source,
        questions: qna.questions,
        metadata: qna.metadata,
        context: qna.context
      }
    })

    const equal = this.isQnaListEqual(qnaListAToCompare, qnaListBToCompare)

    return equal
  }

  private isQnaListEqual(qnaListA: any, qnaListB: any) {
    let kbAQnA = this.parseToQnAContent(qnaListA).toLowerCase()
    let kbBQnA = this.parseToQnAContent(qnaListB).toLowerCase()

    return kbAQnA === kbBQnA
  }

  private parseToQnAContent(qnaList: any) {
    let fileContent = ''
    qnaList.forEach((qnaItem: any) => {
      fileContent += '<a id = "0"></a>' + NEWLINE + NEWLINE
      fileContent += '> !# @qna.pair.source = ' + qnaItem.source + NEWLINE + NEWLINE
      fileContent += '## ? ' + qnaItem.questions[0] + NEWLINE
      qnaItem.questions.splice(0, 1)
      qnaItem.questions.forEach((question: any) => {
        fileContent += '- ' + question + NEWLINE
      })
      fileContent += NEWLINE
      if (qnaItem.metadata && qnaItem.metadata.length > 0) {
        fileContent += '**Filters:**' + NEWLINE
        qnaItem.metadata.sort((a: any, b: any) => (a.name > b.name) ? 1 : -1).forEach((filter: any) => {
          fileContent += '- ' + filter.name + ' = ' + filter.value + NEWLINE
        })
        fileContent += NEWLINE
      }
      fileContent += '```markdown' + NEWLINE
      fileContent += qnaItem.answer + NEWLINE
      fileContent += '```' + NEWLINE
      if (qnaItem.context && qnaItem.context.prompts && qnaItem.context.prompts.length !== 0) {
        fileContent += NEWLINE + '**Prompts:**' + NEWLINE
        qnaItem.context.prompts.forEach((prompt: any) => {
          fileContent += `- [${prompt.displayText}]`
          // See if the linked prompt is context only and if so, add the decoration.
          let promptQnA = qnaList.find((item: any) => item.id === prompt.qnaId)
          if (promptQnA) {
            fileContent += promptQnA.context.isContextOnly === true ? ' \`context-only\`' : ''
          }
          fileContent += NEWLINE
        })
      }
      fileContent += NEWLINE
    })

    return fileContent
  }
}
