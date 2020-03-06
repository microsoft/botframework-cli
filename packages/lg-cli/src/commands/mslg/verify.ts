/* eslint-disable complexity */
/**
 * @module @microsoft/bf-cli-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {Command, flags, CLIError} from '@microsoft/bf-cli-command'
import {Helper} from '../../utils'
import {LGParser} from 'botbuilder-lg'
import * as path from 'path'
import * as fs from 'fs-extra'

export default class VerifyCommand extends Command {
  static description = 'Verify any provided .lg file and collate them into a single file.'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: '.lg file or folder that contains .lg file.', required: true}),
    recurse: flags.boolean({char: 'r', description: 'Indicates if sub-folders need to be considered to file .lg file(s)'}),
    out: flags.string({char: 'o', description: 'Output file or folder name. If not specified stdout will be used as output'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file'}),
    help: flags.help({char: 'h', description: 'mslg:parse helper'}),
  }

  // schedule
  // in √
  // recurse √
  // out √
  // force √

  async run() {
    const {flags} = this.parse(VerifyCommand)
    if (!flags.in) {
      throw new CLIError('No input. Please set file path with --in')
    }

    const lgFilePaths = Helper.findLGFiles(flags.in, flags.recurse)
    Helper.checkInputAndOutput(lgFilePaths, flags.out)
    for (const filePath of lgFilePaths) {
      const diagnostics = LGParser.parseFile(filePath).allDiagnostics
      if (diagnostics.length > 0) {
        const outputContent = diagnostics.map(u => u.toString()).join('\n')
        const outputFilePath = this.getOutputFile(filePath, flags.out)
        if (!outputFilePath) {
          this.log(outputContent)
        } else {
          Helper.writeContentIntoFile(outputFilePath, outputContent, flags.force)
        }
      }
    }
  }

  private getOutputFile(filePath: string, out: string): string | undefined {
    if (filePath === undefined || filePath === '') {
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
      const diagnosticName = inputFileName.replace('.lg', '') + '_diagnostic.txt'
      outputFilePath = path.join(outputFilePath, diagnosticName)
    }

    return outputFilePath
  }
}
