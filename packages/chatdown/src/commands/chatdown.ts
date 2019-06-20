import {flags} from '@oclif/command'
import {Command} from 'cli-command'
const txtfile = require('read-text-file')
const path = require('path')
const chatdown = require('../../utils/index')
const glob = require('glob')
const fs = require('fs-extra')
const intercept = require('intercept-stdout')
const chalk = require('chalk')

export default class Chatdown extends Command {
  static description = 'Chatdown cli tool used to parse chat dialogs (.chat file) into a mock transcript file'

  static examples = ['$ bf chatdown']

  static flags = {
    help: flags.help({char: 'h'}),
    static: flags.boolean({description: 'Use static timestamps when generating timestamps on activities.'}),
    folder: flags.string({char: 'f'}),
    out_folder: flags.string({char: 'o'}),
    version: flags.boolean({char: 'v'}),
    prefix: flags.boolean()
  }

  static args = [{name: 'chat', description: 'The path of the chat file to be parsed. If omitted, stdin will be used.'}]

  async run() {
    try {
      const {flags, argv} = this.parse(Chatdown)

      if (flags.prefix) {
        const pkgName = this.config.name
        intercept(function (txt: any) {
          return `[${pkgName}]\n${txt}`
        })
      }

      if (flags.version) {
        process.stdout.write(this.config.version)
        return
      }

      if (flags.folder) {
        let inputDir = flags.folder.trim()
        let outputDir = (flags.out_folder) ? flags.out_folder.trim() : './'
        if (outputDir.substr(0, 2) === './') {
          outputDir = path.resolve(process.cwd(), outputDir.substr(2))
        }
        const len = await this.processFiles(inputDir, outputDir)
        this.log(chalk`{green Successfully wrote ${len} files}\n`)
        return len
      } else {
        const fileContents = await this.getInput(argv)
        if (fileContents) {
          const activities = await chatdown(fileContents, argv)
          const writeConfirmation = await this.writeOut(activities)
          /* tslint:disable:strict-type-predicates */
          if (typeof writeConfirmation === 'string') {
            process.stdout.write(chalk`{green Successfully wrote file:} {blue ${writeConfirmation}}\n`)
          }
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        this.error(err)
      } else {
        this._help()
      }
    }
  }

  private getInput(args: any) {
    if (args.length > 0) {
      args.in = args[0]
      return txtfile.readSync(path.resolve(args.in))
    } else {
      return new Promise((resolve, reject) => {
        const {stdin} = process
        /* tslint:disable:no-string-based-set-timeout */
        let timeout: any = setTimeout(reject, 1000)
        let input = ''

        stdin.setEncoding('utf8')
        stdin.on('data', chunk => {
          if (timeout) {
            clearTimeout(timeout)
            timeout = null
          }
          input += chunk
        })

        stdin.on('end', () => {
          resolve(input)
        })

        stdin.on('error', error => {
          reject(error)
        })
      })
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
