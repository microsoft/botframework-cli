/**
 * @module @microsoft/bf-cli-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags, CLIError} from '@microsoft/bf-cli-command'
import {Helper, ErrorType} from '../../utils'
import {MSLGTool} from 'botbuilder-lg'
import * as txtfile from 'read-text-file'
import * as path from 'path'
import * as fs from 'fs-extra'
import * as readlineSync from 'readline-sync'

export default class ExpandCommand extends Command {
  static description = 'Expand one or all templates in a .lg file or an inline expression.'

  private lgTool = new MSLGTool()

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: '.lg file', required: true}),
    recurse: flags.string({char: 'r', description: 'Indicates if sub-folders need to be considered to file .lg file(s)'}),
    out: flags.string({char: 'o', description: 'Output file or folder name. If not specified stdout will be used as output'}),
    force: flags.string({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file'}),
    collate: flags.string({char: 'c', description: 'If not set, same template name across multiple .lg files will throw exceptions.'}),
    template: flags.string({description: 'Name of the template to expand. Template names with spaces must be enclosed in quotes.'}),
    expression: flags.string({description: ' Inline expression provided as a string to evaluate.'}),
    all: flags.string({description: 'Flag option to request that all templates in the .lg file be expanded.'}),
    interactive: flags.string({description: 'Flag option to request that all missing entity value references be obtained through interactive prompts.'}),
    testInput: flags.string({description: 'full or relative path to a JSON file containing test input for all variable references.'}),
    help: flags.help({char: 'h', description: 'mslg:expand helper'}),
  }

  // schedule
  // in √
  // recurse ×
  // out ×
  // force ×
  // collate ×
  // template √
  // expression √
  // all √
  // interactive √
  // testInput √

  async run() {
    const {flags} = this.parse(ExpandCommand)
    if (!flags.in) {
      throw new CLIError('No input. Please set file path with --in')
    }

    this.expand(flags)

    if (flags.collate) {
      Helper.handlerCollect()
    }
  }

  private expand(flags: any) {
    let fileToExpand: any
    if (flags.in) {
      fileToExpand = this.getFilePath(flags.in)
    }

    let errors: string[] = []
    errors = this.parseFile(fileToExpand, flags.expression)

    if (errors.filter(error => error.startsWith(ErrorType.Error)).length > 0) {
      throw new CLIError('parsing lg file or inline expression failed.')
    }

    // construct template name list
    let templateNameList: string[] = []
    if (flags.templateName) {
      templateNameList.push(flags.template)
    }

    if (flags.all) {
      templateNameList = [...new Set(templateNameList.concat(this.getTemplatesName(this.lgTool.collatedTemplates)))]
    }

    if (flags.expression) {
      templateNameList.push('__temp__')
    }

    const expandedTemplates = this.expandTemplates(flags, templateNameList)

    if (expandedTemplates === undefined || expandedTemplates.size === 0) {
      throw new CLIError('expanding templates or inline expression failed')
    }

    let expandedTemplatesFile: string = this.generateExpandedTemplatesFile(expandedTemplates)

    // ?
    const fileName: string = flags.in
    if (fileName === undefined) {
      expandedTemplatesFile = expandedTemplatesFile.replace('# __temp__\n- ', '')
    }

    this.log(expandedTemplatesFile + '\n')
  }

  private expandTemplates(flags: any, templateNameList: string[]) {
    const expandedTemplates: Map<string, string[]> = new Map<string, string[]>()
    let variablesValue: Map<string, any>
    const userInputValues: Map<string, any> = new Map<string, any>()
    for (const templateName of templateNameList) {
      const expectedVariables = this.lgTool.getTemplateVariables(templateName)
      variablesValue = this.getVariableValues(flags.testInput, expectedVariables, userInputValues)
      for (const variableValue of variablesValue) {
        if (variableValue[1] === undefined) {
          if (flags.interactive) {
            const value = readlineSync.question(`Please enter variable value of ${variableValue[0]} in template ${templateName}: `)
            let valueObj: any
            // eslint-disable-next-line max-depth
            try {
              valueObj = JSON.parse(value)
            } catch {
              valueObj = value
            }

            variablesValue.set(variableValue[0], valueObj)
            userInputValues.set(variableValue[0], valueObj)
          }
        }
      }

      const variableObj: any = this.generateVariableObj(variablesValue)
      const expandedTemplate: string[] = this.lgTool.expandTemplate(templateName, variableObj)
      expandedTemplates.set(templateName, expandedTemplate)
    }

    return expandedTemplates
  }

  private getFilePath(input: string): string {
    const fileToExpand = Helper.normalizePath(input)
    if (!fs.existsSync(fileToExpand) || !fs.statSync(fileToExpand).isFile() || !fileToExpand.endsWith('.lg')) {
      throw new CLIError('please input the valid file path.')
    }

    return input
  }

  private parseFile(filePath: string, inlineExpression: any = undefined): string[] {
    let fileContent = txtfile.readSync(filePath)
    if (!fileContent) {
      throw new CLIError('unable to read file: ' + filePath)
    }

    if (inlineExpression !== undefined) {
      const fakeTemplateId = '__temp__'
      const inlineStr = !inlineExpression.trim().startsWith('```') && inlineExpression.indexOf('\n') >= 0 ?
        '```'.concat(inlineExpression).concat('```') : inlineExpression
      fileContent += `\n# ${fakeTemplateId} \r\n - ${inlineStr}`
    }

    const errors: string[] = this.lgTool.validateFile(fileContent, 'inline content')
    if (errors.length > 0) {
      errors.forEach(error => {
        if (error.startsWith(ErrorType.Error)) {
          this.error(error + '\n')
        } else {
          this.warn(error + '\n')
        }
      })
    }

    return errors
  }

  private generateExpandedTemplatesFile(expandedTemplates: Map<string, string[]>): string {
    let result = ''
    for (const template of expandedTemplates) {
      result += '# ' + template[0] + '\n'
      if (Array.isArray(template[1])) {
        for (const templateStr of template[1]) {
          if (templateStr.trim().startsWith('[') && templateStr.trim().endsWith(']')) {
            result += templateStr + '\n'
            break
          } else {
            result += '- ' + templateStr + '\n'
          }
        }
      } else {
        throw new TypeError('generating expanded lg file failed')
      }

      result += '\n'
    }

    return result
  }

  private getTemplatesName(collatedTemplates: Map<string, any>): string[] {
    const result: string[] = []
    for (const template of collatedTemplates) {
      result.push(template[0])
    }

    return result
  }

  private getVariableValues(testFileName: string, expectedVariables: string[], userInputValues: Map<string, any>): Map<string, any> {
    const result: Map<string, any> = new Map<string, any>()
    let variablesObj: any
    if (testFileName !== undefined) {
      const filePath: string = path.resolve(testFileName)
      if (!fs.existsSync(filePath)) {
        throw new CLIError('unable to open file: ' + filePath)
      }

      const fileContent = txtfile.readSync(filePath)
      if (!fileContent) {
        throw new CLIError('unable to read file: ' + filePath)
      }

      variablesObj = JSON.parse(fileContent)
    }

    if (expectedVariables !== undefined) {
      for (const variable of expectedVariables) {
        if (variablesObj !== undefined && variablesObj[variable] !== undefined) {
          result.set(variable, variablesObj[variable])
        } else if (userInputValues !== undefined && userInputValues.has(variable)) {
          result.set(variable, userInputValues.get(variable))
        } else {
          result.set(variable, undefined)
        }
      }
    }

    return result
  }

  private generateVariableObj(variablesValue: Map<string, any>): any {
    const result: any = {}
    if (variablesValue !== undefined) {
      for (const variable of variablesValue) {
        result[variable[0]] =  variable[1]
      }
    }

    return result
  }
}
