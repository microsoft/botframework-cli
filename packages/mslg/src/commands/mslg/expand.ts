import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
import {MSLGTool} from 'botbuilder-lg'
import * as chalk from 'chalk'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as txtfile from 'read-text-file'

import {ErrorType} from '../../utils/helpers'

const readlineSync = require('readline-sync')

export default class MslgExpand extends Command {
  static description =
    'Expand one or all templates in a .lg file or an inline expression.'

  static examples = [
    `
  $ bf mslg expand --in examples/validExamples/simple.lg -t FinalGreeting`
  ]

  static flags = {
    in: flags.string({required: true, description: 'The .lg file to expand'}),
    template: flags.string({description: 'Name of the template to expand. Template names with spaces must be enclosed in quotes.'}),
    inline: flags.string({description: 'Inline expression provided as a string to evaluate.'}),
    all: flags.boolean({description: 'Flag option to request that all templates in the .lg file be expanded.'}),
    interactive: flags.boolean({description: 'Flag option to request that all missing entity value references be obtained through interactive prompts.'}),
    testInput: flags.string({description: 'Full or relative path to a JSON file containing test input for all variable references.'}),
    help: flags.help({description: 'Output usage information.'})
  }

  private readonly tool: MSLGTool = new MSLGTool()

  async run() {
    try {
      const {flags} = this.parse(MslgExpand)

      let fileToExpand: any
      if (flags.in) {
        fileToExpand = flags.in
      }

      let errors: string[] = []
      errors = this.parseFile(fileToExpand, flags.inline)

      if (
        errors.filter(error => error.startsWith(ErrorType.Error)).length > 0
      ) {
        throw new Error('parsing lg file or inline expression failed.')
      }

      let templatesName: string[] = []
      if (flags.template) {
        templatesName.push(flags.template)
      }

      if (flags.all) {
        templatesName = Array.from(
          new Set(
            templatesName.concat(
              this.getTemplatesName(this.tool.CollatedTemplates)
            )
          )
        )
      }

      if (flags.inline) {
        templatesName.push('__temp__')
      }

      let expandedTemplates: Map<string, string[]> = new Map<string, string[]>()
      let variablesValue: Map<string, any>
      let userInputValues: Map<string, any> = new Map<string, any>()
      for (const templateName of templatesName) {
        const expectedVariables = this.tool.GetTemplateVariables(templateName)
        variablesValue = this.getVariableValues(
          flags.testInput,
          expectedVariables,
          userInputValues
        )
        for (const variableValue of variablesValue) {
          if (variableValue[1] === undefined) {
            if (flags.interactive) {
              let value = readlineSync.question(
                `Please enter variable value of ${variableValue[0]} in template ${templateName}: `
              )
              let valueObj: any
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
        const expandedTemplate: string[] = this.tool.ExpandTemplate(
          templateName,
          variableObj
        )
        expandedTemplates.set(templateName, expandedTemplate)
      }

      if (!expandedTemplates || expandedTemplates.size === 0) {
        throw new Error('expanding templates or inline expression failed')
      }

      let expandedTemplatesFile: string = this.generateExpandedTemplatesFile(
        expandedTemplates
      )

      let fileName: string = flags.in
      if (!fileName) {
        expandedTemplatesFile = expandedTemplatesFile.replace(
          '# __temp__\n- ',
          ''
        )
      }

      process.stdout.write(expandedTemplatesFile + '\n')
    } catch (error) {
      throw new CLIError(error.message)
    }
  }

  private parseFile(fileName: string, inlineExpression?: any): string[] {
    let fileContent = ''
    let filePath = ''
    if (fileName) {
      if (!fs.existsSync(path.resolve(fileName))) {
        throw new Error('unable to open file: ' + fileName)
      }

      fileContent = txtfile.readSync(fileName)
      if (!fileContent) {
        throw new Error('unable to read file: ' + fileName)
      }

      filePath = path.resolve(fileName)
    }

    if (inlineExpression) {
      const fakeTemplateId = '__temp__'
      const wrappedStr = `\n# ${fakeTemplateId} \r\n - ${inlineExpression}`
      fileContent += wrappedStr
      filePath = path.resolve('./')
    }

    const errors: string[] = this.tool.ValidateFile(fileContent, filePath)
    if (errors.length > 0) {
      errors.forEach(error => {
        if (error.startsWith(ErrorType.Error)) {
          process.stderr.write(chalk.default.redBright(error + '\n'))
        } else {
          process.stdout.write(chalk.default.yellowBright(error + '\n'))
        }
      })
    }

    return errors
  }

  private generateExpandedTemplatesFile(
    expandedTemplates: Map<string, string[]>
  ): string {
    let result = ''
    for (const template of expandedTemplates) {
      result += '# ' + template[0] + '\n'
      if (template[1] instanceof Array) {
        template[1].forEach(templateStr => {
          result += '- ' + templateStr + '\n'
        })
      } else {
        throw new Error('generating expanded lg file failed')
      }

      result += '\n'
    }

    return result
  }

  private getTemplatesName(collatedTemplates: Map<string, any>): string[] {
    let result: string[] = []
    for (const template of collatedTemplates) {
      result.push(template[0])
    }

    return result
  }

  private getVariableValues(
    testFileName: string | undefined,
    expectedVariables: string[],
    userInputValues: Map<string, any>
  ): Map<string, any> {
    let result: Map<string, any> = new Map<string, any>()
    let variablesObj: any
    if (testFileName) {
      const filePath: string = path.resolve(testFileName)
      if (!fs.existsSync(filePath)) {
        throw new Error('unable to open file: ' + filePath)
      }

      let fileContent = txtfile.readSync(filePath)
      if (!fileContent) {
        throw new Error('unable to read file: ' + filePath)
      }

      variablesObj = JSON.parse(fileContent)
    }

    if (expectedVariables) {
      for (const variable of expectedVariables) {
        if (
          variablesObj &&
          variablesObj[variable]
        ) {
          result.set(variable, variablesObj[variable])
        } else if (
          userInputValues &&
          userInputValues.has(variable)
        ) {
          result.set(variable, userInputValues.get(variable))
        } else {
          result.set(variable, undefined)
        }
      }
    }

    return result
  }

  private generateVariableObj(variablesValue: Map<string, any>): any {
    let result: any = {}
    if (variablesValue) {
      for (const variable of variablesValue) {
        result[variable[0]] = variable[1]
      }
    }

    return result
  }
}
