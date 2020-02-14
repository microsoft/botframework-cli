/**
 * @module @microsoft/bf-cli-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/* eslint-disable complexity */
import * as fs from 'fs-extra'
import {Helper, ErrorType} from './helper'
import * as path from 'path'
import * as txtfile from 'read-text-file'
import * as chalk from 'chalk'
import {MSLGTool} from 'botbuilder-lg'

const readlineSync = require('readline-sync')

export class Parser {
    private tool: MSLGTool = new MSLGTool();

    public Parser(program: any) {
      let filesToParse: any[] = []
      let folderStat: any
      if (program.in) {
        filesToParse.push(program.in)
      }

      if (program.lg_folder) {
        try {
          folderStat = fs.statSync(program.lg_folder)
        } catch (error) {
          throw new Error(program.lg_folder + ' is not a folder or does not exist')
        }
        if (!folderStat.isDirectory()) {
          throw new Error(program.lg_folder + ' is not a folder or does not exist')
        }
        if (program.subfolder) {
          filesToParse = Helper.findLGFiles(program.lg_folder, true)
        } else {
          filesToParse = Helper.findLGFiles(program.lg_folder, false)
        }
        if (filesToParse.length === 0) {
          throw new Error('no .lg files found in the specified folder.')
        }
      }

      let errors: string[] = []

      while (filesToParse.length > 0) {
        const file = filesToParse[0]
        const parseRes = this.parseFile(file, program.verbose)
        errors = errors.concat(parseRes)
        filesToParse.splice(0, 1)
      }

      if (program.stdin) {
        let parsedJsonFromStdin
        try {
          const value = readlineSync.question('Please enter the lg file content: ')
          parsedJsonFromStdin = JSON.parse(value)
        } catch (error) {
          throw new Error(`unable to parse stdin as JSON! \n\n ${JSON.stringify(error, null, 2)}\n\n`)
        }

        errors = errors.concat(this.parseStream(parsedJsonFromStdin, program.verbose))
      }

      if (errors.filter(error => error.startsWith(ErrorType.Error)).length > 0) {
        throw new Error('parsing lg files failed.')
      }

      let fileName: string
      if (program.out) {
        fileName = program.out + '_mslg.lg'
      } else if (program.in) {
        if (!path.isAbsolute(program.in)) {
          fileName = path.resolve('', program.in)
        } else {
          fileName = program.in
        }

        fileName = fileName.substr(fileName.lastIndexOf('\\') + 1).replace('.lg', '') + '_mslg.lg'
      } else {
        if (!path.isAbsolute(program.lg_folder)) {
          fileName = path.resolve('', program.lg_folder)
        } else {
          fileName = program.lg_folder
        }

        fileName = fileName.substr(fileName.lastIndexOf('\\') + 1) + '_mslg.lg'
      }

      let outFolder: string = process.cwd()
      if (program.out_folder) {
        if (path.isAbsolute(program.out_folder)) {
          outFolder = program.out_folder
        } else {
          outFolder = path.resolve('', program.out_folder)
        }

        if (!fs.existsSync(outFolder)) {
          throw new Error('output folder ' + outFolder + ' does not exist')
        }
      }

      if (this.tool.collationMessages.length > 0) {
        this.tool.collationMessages.forEach(error => {
          if (error.startsWith(ErrorType.Error)) {
            process.stderr.write(chalk.default.redBright(error + '\n'))
          } else {
            process.stdout.write(chalk.default.yellowBright(error + '\n'))
          }
        })

        throw new Error('collating lg files failed.\n')
      } else if (program.collate === undefined && this.tool.nameCollisions.length > 0) {
        throw new Error('below template names are defined in multiple files: ' + this.tool.nameCollisions.toString())
      } else {
        const mergedLgFileContent = this.tool.collateTemplates()
        if (mergedLgFileContent === undefined || mergedLgFileContent === '') {
          throw new Error('generating collated lg file failed.')
        }
        const filePath = outFolder + '\\' + fileName
        if (fs.existsSync(filePath)) {
          fs.removeSync(filePath)
        }
        if (program.stdout) {
          process.stdout.write(chalk.default.whiteBright(mergedLgFileContent))
        } else {
          fs.writeFileSync(filePath, mergedLgFileContent)
          process.stdout.write(chalk.default.whiteBright(`Collated lg file is generated here: ${filePath}.\n`))
        }
      }
    }

    private parseFile(fileName: string, verbose: boolean): string[] {
      if (!fs.existsSync(path.resolve(fileName))) {
        throw new Error('unable to open file: ' + fileName)
      }

      const fileContent = txtfile.readSync(fileName)
      if (!fileContent) {
        throw new Error('unable to read file: ' + fileName)
      }

      if (verbose) process.stdout.write(chalk.default.whiteBright('Parsing file: ' + fileName + '\n'))

      const errors: string[] = this.tool.validateFile(fileContent, path.resolve(fileName))
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

    private parseStream(fileContent: string, verbose: boolean): string[] {
      if (verbose) process.stdout.write(chalk.default.whiteBright('Parsing from stdin.\n'))

      const errors: string[] = this.tool.validateFile(fileContent, path.resolve('./'))
      if (errors.length > 0) {
        errors.forEach(error => {
          process.stderr.write(chalk.default.redBright(error + '\n'))
        })
      }

      return errors
    }
}
