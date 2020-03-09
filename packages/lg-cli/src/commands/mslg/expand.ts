/**
 * @module @microsoft/bf-cli-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags, CLIError} from '@microsoft/bf-cli-command'
import {Helper} from '../../utils'
import {LGParser, LGFile, DiagnosticSeverity, Diagnostic} from 'botbuilder-lg'
import * as txtfile from 'read-text-file'
import * as path from 'path'
import * as fs from 'fs-extra'
import * as readlineSync from 'readline-sync'

export default class ExpandCommand extends Command {
  static description = 'Expand one or all templates in a .lg file or an inline expression.'

  private readonly TempTemplateName = '__temp__'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: '.lg file or folder that contains .lg file.', required: true}),
    recurse: flags.boolean({char: 'r', description: 'Indicates if sub-folders need to be considered to file .lg file(s)'}),
    out: flags.string({char: 'o', description: 'Output file or folder name. If not specified stdout will be used as output'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file'}),
    template: flags.string({description: 'Name of the template to expand. Template names with spaces must be enclosed in quotes.'}),
    expression: flags.string({description: ' Inline expression provided as a string to evaluate.'}),
    all: flags.boolean({description: 'Flag option to request that all templates in the .lg file be expanded.'}),
    interactive: flags.boolean({description: 'Flag option to request that all missing entity value references be obtained through interactive prompts.'}),
    testInput: flags.string({description: 'full or relative path to a JSON file containing test input for all variable references.'}),
    help: flags.help({char: 'h', description: 'mslg:expand helper'}),
  }

  async run() {
    const {flags} = this.parse(ExpandCommand)

    const lgFilePaths = Helper.findLGFiles(flags.in, flags.recurse)

    Helper.checkInputAndOutput(lgFilePaths, flags.out)

    for (const filePath of lgFilePaths) {
      const lg = this.parseExpressionWithLgfile(flags.expression, LGParser.parseFile(filePath))
      this.checkDiagnostics(lg.allDiagnostics)

      const originalTemplateNames = lg.allTemplates.map(u => u.name)
      const templateNameList = this.buildTemplateNameList(originalTemplateNames, flags.all, flags.expression, flags.template)
      const expandedTemplates = this.expandTemplates(lg, templateNameList, flags.testInput, flags.interactive)

      this.handlerOutputContent(expandedTemplates, filePath, flags.out, flags.force)
    }
  }

  private checkDiagnostics(diagnostics: Diagnostic[]) {
    const errors = diagnostics.filter(u => u.severity === DiagnosticSeverity.Error)
    if (errors && errors.length > 0) {
      throw new CLIError(errors.map(u => u.toString()).join('\n'))
    } else {
      const warnings = diagnostics.filter(u => u.severity === DiagnosticSeverity.Warning)
      if (warnings && warnings.length > 0) {
        this.warn(warnings.map(u => u.toString()).join('\n'))
      }
    }
  }

  private handlerOutputContent(expandedTemplates: Map<string, string[]>, filePath: string, out: string|undefined, force: boolean|undefined) {
    if (expandedTemplates !== undefined && expandedTemplates.size >= 0) {
      const expandContent = this.generateExpandedTemplatesFile(expandedTemplates)

      const outputFilePath = this.getOutputFile(filePath, out)
      if (!outputFilePath) {
        this.log(`expand of file ${filePath}`)
        this.log(expandContent)
      } else {
        Helper.writeContentIntoFile(outputFilePath, expandContent, force)
        this.log(`expand result of ${filePath} have been written into file ${outputFilePath}`)
      }
    } else {
      this.log(`no expand result of ${filePath}`)
    }
  }

  private getOutputFile(filePath: string, out: string|undefined): string | undefined {
    if (filePath === undefined || filePath === '' || out === undefined) {
      return undefined
    }
    let outputFilePath = out
    if (!path.isAbsolute(out)) {
      outputFilePath = path.join(process.cwd(), out)
    }

    outputFilePath = Helper.normalizePath(outputFilePath)

    if (fs.statSync(outputFilePath).isDirectory()) {
      const inputFileName = filePath.split('\\').pop()
      if (!inputFileName) {
        return undefined
      }
      const diagnosticName = inputFileName.replace('.lg', '') + '.expand.lg'
      outputFilePath = path.join(outputFilePath, diagnosticName)
    }

    return outputFilePath
  }

  private buildTemplateNameList(origintemplateNames: string[], all: boolean|undefined, expression: string|undefined, template: string|undefined): string[] {
    let templateNameList: string[] = []
    if (!template && !all && !expression) {
      throw new CLIError('please use --template or --all or --expression to specific the template')
    }

    if (all) {
      if (expression) {
        templateNameList = templateNameList.concat(origintemplateNames)
      } else {
        // remove __temp__ template
        templateNameList = templateNameList.concat(origintemplateNames.filter(u => u !== this.TempTemplateName))
      }
    } else {
      if (template && origintemplateNames.includes(template)) {
        templateNameList.push(template)
      }

      if (expression) {
        templateNameList.push(this.TempTemplateName)
      }
    }

    return [...new Set(templateNameList)]
  }

  private expandTemplates(lg: LGFile, templateNameList: string[], testInput: string, interactive = false) {
    const expandedTemplates: Map<string, string[]> = new Map<string, string[]>()
    let variablesValue: Map<string, any>
    const userInputValues: Map<string, any> = new Map<string, any>()
    for (const templateName of templateNameList) {
      if (lg.allTemplates.find(u => u.name === templateName) === undefined) {
        this.log(`${templateName} does not exist in ${lg.id}, skip it.`)
        continue
      }

      const expectedVariables = lg.analyzeTemplate(templateName).Variables
      variablesValue = this.getVariableValues(testInput, expectedVariables, userInputValues)
      for (const variableValue of variablesValue) {
        if (variableValue[1] === undefined) {
          if (interactive) {
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
      const expandedTemplate: string[] =  lg.expandTemplate(templateName, variableObj)
      expandedTemplates.set(templateName, expandedTemplate)
    }

    return expandedTemplates
  }

  private parseExpressionWithLgfile(inlineStr: string|undefined, lgFile: LGFile): LGFile {
    if (inlineStr === undefined) {
      return lgFile
    }

    const multiLineMark = '```'

    inlineStr = !(inlineStr.trim().startsWith(multiLineMark) && inlineStr.includes('\n')) ?
      `${multiLineMark}${inlineStr}${multiLineMark}` : inlineStr

    const newContent = `#${this.TempTemplateName} \r\n - ${inlineStr}`

    return LGParser.parseTextWithRef(newContent, lgFile)
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

  private getVariableValues(testinput: string, expectedVariables: string[], userInputValues: Map<string, any>): Map<string, any> {
    const result: Map<string, any> = new Map<string, any>()
    let variablesObj: any
    if (testinput !== undefined) {
      let filePath: string = testinput
      if (!path.isAbsolute(testinput)) {
        filePath = path.join(process.cwd(), testinput)
      }

      filePath = Helper.normalizePath(filePath)

      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
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
        result[variable[0]] = variable[1]
      }
    }

    return result
  }
}
