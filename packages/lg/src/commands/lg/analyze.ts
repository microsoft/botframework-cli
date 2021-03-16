/**
 * @module @microsoft/bf-lg-cli
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags, CLIError} from '@microsoft/bf-cli-command'
import {Helper} from '../../utils'
import {Templates, DiagnosticSeverity, Diagnostic} from 'botbuilder-lg'
import * as path from 'path'
import * as fs from 'fs-extra'

const NEWLINE = require('os').EOL

type FullTemplateName = string
type TemplateName = string
type Source = string
type SourceToReferences = Map<Source, TemplateName[]>
type TemplateToReferences = Map<FullTemplateName, SourceToReferences>
const SourceToReferences = <{ new(): SourceToReferences }>Map
const TemplateToReferences = <{ new(): TemplateToReferences }>Map

export default class AnalyzeCommand extends Command {
  static description = 'Analyze templates in .lg files to show all the places where a template is used'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'LG File or folder that contains .lg file(s)', required: true}),
    recurse: flags.boolean({char: 'r', description: 'Consider sub-folders to find .lg file(s)'}),
    out: flags.string({char: 'o', description: 'Output file or folder name. If not specified stdout will be used as output'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file'}),
    help: flags.help({char: 'h', description: 'lg:analyze help'}),
  }

  async run() {
    const {flags} = this.parse(AnalyzeCommand)

    const lgFilePaths = Helper.findLGFiles(flags.in, flags.recurse)

    Helper.checkInputAndOutput(lgFilePaths)

    const allTemplates = []
    for (const filePath of lgFilePaths) {
      const templates = Templates.parseFile(filePath)
      this.checkDiagnostics(templates.allDiagnostics)
      allTemplates.push(templates)
    }

    const templateToReferences = this.templateUsage(allTemplates)
    await this.writeTemplateReferences(templateToReferences, flags.out, flags.force)
  }

  private templateUsage(templates: Templates[]): TemplateToReferences {
    const usage = new TemplateToReferences()
    const analyzed = new Set<Source>()
    for (const source of templates) {
      // Map from simple to full name and initialize template usage
      const nameToFullname = new Map<string, string>()
      for (const template of source.allTemplates) {
        const fullName = `${template.sourceRange.source}:${template.name}`
        nameToFullname.set(template.name, fullName)
        if (!usage.get(fullName)) {
          usage.set(fullName, new SourceToReferences())
        }
      }

      // Add references from each template that is in an unanalyzed source file
      for (const template of source.allTemplates) {
        // Analyze each original source template only once
        if (!analyzed.has(template.sourceRange.source)) {
          const info = source.analyzeTemplate(template.name)
          for (const reference of info.TemplateReferences) {
            const source = template.sourceRange.source as string
            const referenceSources = usage.get(nameToFullname.get(reference) as string) as Map<string, string[]>
            let referenceSource = referenceSources.get(source)
            if (!referenceSource) {
              referenceSource = []
              referenceSources.set(source, referenceSource)
            }
            referenceSource.push(template.name)
          }
        }
      }

      // Add in the newly analyzed sources
      for (const imported of source.imports) {
        analyzed.add(path.resolve(path.dirname(source.source), imported.id))
      }
      analyzed.add(source.source)
    }
    return usage
  }

  private async writeTemplateReferences(templateToReferences: TemplateToReferences, out: string, force: boolean) {
    if (templateToReferences !== undefined && templateToReferences.size >= 0) {
      const analysisContent = this.generateAnalysisResult(templateToReferences)
      if (out) {
        // write to file
        const outputFilePath = this.getOutputFile(out)
        Helper.writeContentIntoFile(outputFilePath, analysisContent, force)
        this.log(`Analysis result have been written into file ${outputFilePath}`)
      } else {
        // write to console
        this.log(analysisContent)
      }
    } else {
      this.log('No analysis result')
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

  private getOutputFile(out: string): string {
    const base = Helper.normalizePath(path.resolve(out))
    const root = path.dirname(base)
    if (!fs.existsSync(root)) {
      throw new Error(`Folder ${root} not exist`)
    }

    const extension = path.extname(base)
    if (extension) {
      // file
      return base
    }

    // folder
    // default to analysisResult.txt
    return path.join(base, 'analysisResult.txt')
  }

  private templateName(fullname: string): string {
    const colon = fullname.lastIndexOf(':')
    return fullname.substring(colon + 1)
  }

  private shortTemplateName(fullname: string): string {
    const colon = fullname.lastIndexOf(':')
    return path.basename(fullname.substring(0, colon)) + fullname.substring(colon)
  }

  private generateAnalysisResult(templateToReferences: TemplateToReferences): string {
    let result = ''
    for (const templateToReference of templateToReferences) {
      const shortTemplateName = this.shortTemplateName(templateToReference[0])
      result += `${shortTemplateName} references:${NEWLINE}`
      const references = templateToReference[1]
      for (const reference of references) {
        result += `    ${path.basename(reference[0])}: ${reference[1].map(r => this.templateName(r)).join(', ')}${NEWLINE}`
      }
    }

    return result
  }
}
