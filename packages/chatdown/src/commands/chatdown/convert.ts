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
    stamp: flags.boolean({char: 's', description: 'Use static timestamps when generating timestamps on activities.'}),
    prefix: flags.boolean({char: 'p', description: 'Prefix stdout with package name.'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file', default: false}),
    help: flags.help({char: 'h', description: 'Chatdown command help'})
  }

  async run() {
    try {
      const {flags} = this.parse(ChatdownConvert)

      if (flags.prefix) {
        const pkgName = this.config.name
        intercept(function (txt: any) {
          return `[${pkgName}]\n${txt}`
        })
      }

      let inputEntities: string[] | undefined = []
      let inputIsDirectory: boolean = flags.in ? (flags.in.includes('*') || this.isDirectory(flags.in)) : false
      let outputDirectory: string | null | undefined

      // step 1: get chat data input
      if (flags.in) {
        inputEntities = await this.getInputEntities(inputIsDirectory, flags.in)
      }

      if (flags.out) {
        let outputDir = path.resolve(flags.out) || null
      }

      if (inputEntities.length < 1) {
        throw new CLIError('No chat files found at: ' + flags.in)
      }

      // step 2: convert chat data input to transcript
      const transcripts = await this.convertToTranscript(inputEntities, inputIsDirectory)

      // step 3: write output transcript data
      const x = 666;
      // need for write step
      // const fileName = this.getFileName(entities[i])
      

      console.log(inputEntities)

    } catch (err) {
      if (err.message.match(/Malformed configurations options detected/)) {
        throw new CLIError(err.message)
      }
      throw err
    }
  }

  private async convertToTranscript(entities: any[], inputIsDir: boolean) {
    const transcripts: string[] = []
    /* tslint:disable:prefer-for-of */
    for (let i = 0; i < entities.length; i++) {
      try {
        let transcript;
        if (inputIsDir) {
          transcript = await chatdown(await utils.readTextFile(entities[i]))
        } else {
          transcript = await chatdown(entities[i], flags)
        }
        transcripts.push(transcript)
      } catch (error) {
        if (error.message.match(/no such file or directory/)) {
          throw new CLIError(error.message)
        }
        throw error
      }
    }
    return transcripts
  }

  private getFileName(file: any) {
    return path.basename(file, path.extname(file))
  }

  private async getInputEntities(inputIsDirectory: boolean, inputFlag: string): Promise<string[]> {
    if (inputIsDirectory) {
      return await this.getInputFromDirectory(inputFlag)
    }
    return [await this.getInputFromFileOrStdin(inputFlag)]
  }

  private async getInputFromFileOrStdin(args: any): Promise<string> {
    // Check if file passed in
    if (args && args.length > 0) {
      return utils.readTextFile(args)
    } 
    // Check if piped data was passed in
    const {stdin} = process
    if (!stdin.isTTY) {
      return this.readStdin()
    }
    return ''
  }

  private getFilesFromDirectory(directoryPath: any): Promise<string[]> {
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

  private async getInputFromDirectory(directoryPath: string | undefined): Promise<string[]> {
    if (directoryPath && directoryPath.indexOf('*') > -1) {
      return glob.sync(directoryPath, {ignore: ['**/node_modules/**']})
    }
    try {
      return await this.getFilesFromDirectory(directoryPath)
    } catch (err) {
      if (err.message.match(/Invalid Input/)) {
        throw new CLIError('No chat file path: ' + directoryPath)
      }
      throw new CLIError(`Failed to scan directory ${err}`)
    }
  }

  private isDirectory(path: string): boolean {
    const stats = fs.statSync(path)
    return stats.isDirectory()
  }

}
