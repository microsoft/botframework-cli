/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {flags} from '@oclif/command'
import {CLIError, Command, utils} from '@microsoft/bf-cli-command'
const chalk = require('chalk')
const chatdown = require('../../../utils/index')
const fs = require('fs-extra')
const glob = require('glob')
const intercept = require('intercept-stdout')
const path = require('path')

export default class ChatdownConvert extends Command {
  static description = 'Converts chat dialog files in <filename>.chat format into transcript files. Writes corresponding <filename>.transcript for each .chat file.'

  static examples = [`
  $ bf chatdown
  $ bf chatdown --in=./path/to/file/sample.chat
  $ bf chatdown --in ./test/utils/*.sample.chat -o ./
  $ (echo user=Joe && [ConversationUpdate=MembersAdded=Joe]) | bf chatdown --static`]

  static flags = {
    in: flags.string({char: 'i', description: 'The path of the chat file or directory to be parsed. A glob expression may be passed containing chat files to be processed all at once, ex. ./**/*.chat. If flag is omitted, stdin will be used. If an output directory is not present (-o), it will default the output to the current working directory.'}),
    out: flags.string({char: 'o', description: 'Path to the directory where the output of the multiple chat file processing (-o) will be placed.'}),
    static: flags.boolean({char: 's', description: 'Use static timestamps when generating timestamps on activities.'}),
    prefix: flags.boolean({char: 'p', description: 'Prefix stdout with package name.'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file', default: false}),
    help: flags.help({char: 'h', description: 'Chatdown command help'})
  }

  async run() {
    try {
      const {flags} = this.parse(ChatdownConvert)

      let inputIsDirectory = flags.in ? (flags.in.includes('*') || this.isDir(flags.in)) : false

      if (flags.prefix) {
        const pkgName = this.config.name
        intercept(function (txt: any) {
          return `[${pkgName}]\n${txt}`
        })
      }

      let outputDir = flags.out ? path.resolve(flags.out) : null

      if (inputIsDirectory) {
        let inputDir = flags.in ? flags.in.trim() : ''
        const len = await this.processFiles(inputDir, outputDir, flags.force)
        if (len === 0) {
          throw new CLIError('No chat files found at: ' + flags.in)
        }
        this.log(chalk.green(`Successfully wrote ${len} files\n`))
        return
      } else {
        const fileContents = await this.getInput(flags.in)
        const fileName = flags.in ? this.getFileName(flags.in) : ''
        if (fileContents) {
          const activities = await chatdown(fileContents, flags)
          const writeConfirmation = await this.writeOut(activities, fileName, outputDir, flags.force)
          /* tslint:disable:strict-type-predicates */
          if (typeof writeConfirmation === 'string') {
            process.stdout.write(`${chalk.green('Successfully wrote file:')}  ${writeConfirmation}\n`)
          }
        } else if (flags.in && !fileContents) {
          throw new CLIError('No file contents found in: ' + flags.in)
        } else {
          return this._help()
        }
      }

    } catch (err) {
      if (err.message.match(/Malformed configurations options detected/)) {
        throw new CLIError(err.message)
      }
      throw err
    }
  }

  private readonly isDir = (path: string) => {
    const stats = fs.statSync(path)
    return stats.isDirectory()
  }

  private async getInput(args: any) {
    // Check if path passed in --in
    if (args && args.length > 0) {
      return utils.readTextFile(args)
    } else {
      //Check if piped data was sent
      const {stdin} = process
      if (stdin.isTTY) {
        return false
      } else {
        return this.readStdin()
      }
    }
  }

  private getFiles(directoryPath: any) {
    return new Promise((resolve, reject) => {
      let fileList: any = []
      fs.readdir(directoryPath, (err: any, files: any) => {
        if (err) {
          reject('Error scanning directory' + err)
        }
        fileList = files.map((file: any) => path.join(directoryPath, file))
        resolve(fileList)
      })
    })
  }

  private getFileName(file: any) {
    let fileName = path.basename(file, path.extname(file))
    return fileName
  }

  private async processFiles(inputDir: any, outputDir: any, force: boolean) {
    return new Promise(async (resolve, reject) => {
      let files: any = []
      if (inputDir.indexOf('*') > -1) {
        files = glob.sync(inputDir, {ignore: ['**/node_modules/**']})
      } else {
        try {
          files = await this.getFiles(inputDir)
        } catch (err) {
          reject(new CLIError(`Failed to scan directory ${err}`))
        }
      }
      /* tslint:disable:prefer-for-of */
      for (let i = 0; i < files.length; i++) {
        try {
          const fileName = this.getFileName(files[i])
          let activities = await chatdown(await utils.readTextFile(files[i]))
          await this.writeOut(activities, fileName, outputDir, force)
        } catch (e) {
          if (e.message.match(/no such file or directory/)) {
            reject(new CLIError(e.message))
          } else if (e.message.match(/Invalid Input/)) {
            reject(new CLIError('No chat file path: ' + inputDir))
          }
          reject(e)
        }
      }
      resolve(files.length)
    })
  }

  private async writeOut(activities: any, fileName: string, outputDir: any, force: boolean) {
    if (fileName && outputDir) {
      let writeFile = path.join(outputDir, `${fileName}.transcript`)
      await fs.ensureFile(writeFile)
      let validatedPath = utils.validatePath(writeFile, '', force)
      await fs.writeJson(validatedPath, activities, {spaces: 2})
      return writeFile
    }
    const output = JSON.stringify(activities, null, 2)
    await new Promise(done => process.stdout.write(output, 'utf-8', () => done()))
    return true
  }
}
