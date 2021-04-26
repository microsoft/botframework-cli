/**
 * @module @microsoft/bf-lg-cli
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {Command, flags} from '@microsoft/bf-cli-command'
import {Helper} from '../../utils'
import {Templates, DiagnosticSeverity, Diagnostic} from 'botbuilder-lg'
import * as path from 'path'
import * as fs from 'fs-extra'

export default class VerifyCommand extends Command {
  static description = 'Verify .lg file(s) and collate them into a single file.'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Folder that contains .lg file.', required: true}),
    recurse: flags.boolean({char: 'r', description: 'Considers sub-folders to find .lg file(s)'}),
    out: flags.string({char: 'o', description: 'Output file or folder name. If not specified stdout will be used as output'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file'}),
    help: flags.help({char: 'h', description: 'lg:verify help'}),
  }

  async run() {
    const {flags} = this.parse(VerifyCommand)

    const lgFilePaths = Helper.findLGFiles(flags.in, flags.recurse)
    Helper.checkInputAndOutput(lgFilePaths, flags.out)
    for (const filePath of lgFilePaths) {
      const diagnostics = Templates.parseFile(filePath).allDiagnostics
      if (diagnostics.length > 0) {
        const outputFilePath = this.getOutputFile(filePath, flags.out)
        if (!outputFilePath) {
          this.terminalDiagnostics(diagnostics, filePath)
        } else {
          this.fileDiagnostics(diagnostics, filePath, outputFilePath, flags.force)
        }
      } else {
        this.log(`- ${filePath} √`)
      }
    }
  }

  private fileDiagnostics(diagnostics: Diagnostic[], filePath: string, outputPath: string, force: boolean|boolean) {
    const outputContent = diagnostics.map(u => u.source + ':' + u.toString()).join('\n')
    Helper.writeContentIntoFile(outputPath, outputContent, force)
    this.log(`Diagnostic messages of ${filePath} have been written into file ${outputPath}`)
  }

  private terminalDiagnostics(diagnostics: Diagnostic[], filePath: string) {
    this.log(`- ${filePath}`)
    for (const diagnostic of diagnostics) {
      const message = diagnostic.source + ':' + diagnostic.toString()
      if (diagnostic.severity === DiagnosticSeverity.Error) {
        this.error(message)
      } else if (diagnostic.severity === DiagnosticSeverity.Warning) {
        this.warn(message)
      } else {
        this.log(message)
      }
    }
  }

  private getOutputFile(filePath: string, out: string|undefined): string | undefined {
    if (filePath === undefined || filePath === '' || out === undefined) {
      return undefined
    }

    const base = Helper.normalizePath(path.resolve(out))
    const root = path.dirname(base)
    if (!fs.existsSync(root)) {
      throw new Error(`folder ${root} not exist`)
    }

    const extension = path.extname(base)
    if (extension) {
      // file
      return base
    }

    // folder
    // a.lg -> a.diagnostic.txt
    const diagnosticName = path.basename(filePath).replace('.lg', '') + '.diagnostic.txt'
    return path.join(base, diagnosticName)
  }
}
