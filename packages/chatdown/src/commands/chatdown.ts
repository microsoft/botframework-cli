import {flags} from '@oclif/command'
import {CLIError, Command} from '@microsoft/bf-cli-command'

const chalk = require('chalk')
const chatdown = require('../../utils/index')
const fs = require('fs-extra')
const glob = require('glob')
const intercept = require('intercept-stdout')
const path = require('path')
const txtfile = require('../../utils/read-text-file')
const piped = require('../../utils/read-piped-data')

export default class Chatdown extends Command {
  static description = 'Converts chat dialog files in <filename>.chat format into transcript file. Writes corresponding <filename>.transcript for each .chat file'

  static examples = [`
  $ bf chatdown
  $ bf chatdown --chat=./path/to/file/sample.chat
  $ bf chatdown -f ./test/utils/*.sample.chat -o ./
  $ (echo user=Joe && [ConversationUpdate=MembersAdded=Joe]) | bf chatdown --static`]

  static flags = {
    chat: flags.string({char: 'c', description: 'The path of the chat file to be parsed. If omitted, stdin will be used.'}),
    folder: flags.string({char: 'f', description: 'Path to directory and/or all subdirectories containing chat files to be processed all at once, ex. ./**/*.chat. If an output directory is not present (-o), it will default the output to the current working directory. '}),
    out_folder: flags.string({char: 'o', description: 'Path to the directory where the output of the multiple chat file processing (-f) will be placed.'}),
    static: flags.boolean({char: 's', description: 'Use static timestamps when generating timestamps on activities.'}),
    prefix: flags.boolean({char: 'p', description: 'Prefix stdout with package name.'}),
    help: flags.help({char: 'h', description: 'Chatdown command help'})
  }

  async run() {
    try {
      const {flags} = this.parse(Chatdown)

      if (flags.prefix) {
        const pkgName = this.config.name
        intercept(function (txt: any) {
          return `[${pkgName}]\n${txt}`
        })
      }

      if (flags.folder) {
        let inputDir = flags.folder.trim()
        let outputDir = (flags.out_folder) ? flags.out_folder.trim() : './'
        if (outputDir.substr(0, 2) === './') {
          outputDir = path.resolve(process.cwd(), outputDir.substr(2))
        }
        const len = await this.processFiles(inputDir, outputDir)
        if (len === 0) {
          throw new CLIError('No chat files found at: ' + flags.folder)
        }
        this.log(chalk.green(`Successfully wrote ${len} files\n`))
        return
      }

      let fileContents = await this.getInput(flags.chat)
      if (fileContents) {
        const activities = await chatdown(fileContents, flags)
        const writeConfirmation = await this.writeOut(activities)
        /* tslint:disable:strict-type-predicates */
        if (typeof writeConfirmation === 'string') {
          process.stdout.write(`${chalk.green('Successfully wrote file:')}  ${writeConfirmation}\n`)
        }
      } else {
        return this._help()
      }
    } catch (err) {
      if (err.message.match(/Malformed configurations options detected/)) {
        throw new CLIError(err.message)
      }
      throw err
    }
  }

  private async getInput(args: any) {
    try {
      // Check if path passed in --chat
      if (args && args.length > 0) {
        return txtfile.readSync(args)
      } else {
        //Check if piped data was sent
        const {stdin} = process
        if (stdin.isTTY) {
          return false
        } else {
          return await piped.readStdin()
        }
      }
    } catch (err) {
      if (err.message.match(/no such file or directory/)) {
        throw new CLIError(err.message)
      }
      if (err.message.match(/No Input/)) {
        return false
      }
      throw err
    }
  }

  private async processFiles(inputDir: any, outputDir: any) {
    return new Promise(async (resolve, reject) => {
      let files = glob.sync(inputDir, {ignore: ['**/node_modules/**']})
      /* tslint:disable:prefer-for-of */
      for (let i = 0; i < files.length; i++) {
        try {
          let fileName = files[i]
          if (files[i].lastIndexOf('/') !== -1) {
            fileName = files[i].substr(files[i].lastIndexOf('/'))
          }
          fileName = fileName.split('.')[0]
          let activities = await chatdown(txtfile.readSync(files[i]))
          let writeFile = `${outputDir}/${fileName}.transcript`
          await fs.ensureFile(writeFile)
          await fs.writeJson(writeFile, activities, {spaces: 2})
        } catch (e) {
          if (e.message.match(/no such file or directory/)) {
            reject(new CLIError(e.message))
          } else if (e.message.match(/Invalid Input/)) {
            reject(new CLIError('No chat file path: '+inputDir))
          }
          reject(e)
        }
      }
      resolve(files.length)
    })
  }

  private async writeOut(activities: any) {
    const output = JSON.stringify(activities, null, 2)
    await new Promise(done => process.stdout.write(output, 'utf-8', () => done()))
    return true
  }
}
