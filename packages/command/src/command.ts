// tslint:disable:object-curly-spacing ordered-imports

import { Command as Base } from '@oclif/command'
export { flags } from '@oclif/command'
import { CLIError as OCLIFError } from '@oclif/errors'
import { CLIError } from './clierror'
export { CLIError } from './clierror'
import ReadPipedData from './readpipeddata'
import Telemetry from './telemetry'
const chalk = require('chalk')
const pjson = require('../package.json')

export abstract class Command extends Base {
  base = `${pjson.name}@${pjson.version}`
  telemetryEnabled = false

  async init() {
    this.telemetryEnabled = (this.config.pjson.telemetry === undefined || this.config.pjson.telemetry === null) ? false : this.config.pjson.telemetry
    this.trackEvent(`${this.id}`, {flags : this.getTelemetryProperties()})
    return super.init()
  }

  error(input: string | Error, options: {code?: string, exit: false}): void
  error(input: string | Error, options?: {code?: string, exit?: number}): never
  /* tslint:disable:no-unused */
  error(input: string | Error, options: {code?: string, exit?: number | false} = {}) {
    /* tslint:disable:no-console */
    console.error(chalk.red(input))
  }

  warn(input: string | Error): void {
    /* tslint:disable:no-console */
    console.error(chalk.yellow(input))
  }

  async catch(err: any) {
    if (err instanceof CLIError || err instanceof OCLIFError) {
      if (!err.message.match(/EEXIT: 0/)) {
        this.error(err.message)
      }
    } else {
      try {
        this.trackEvent(this.id + '', {flags : this.getTelemetryProperties(), error: this.extractError(err)})
        this.error('Unknown error during execution. Please file an issue on https://github.com/microsoft/botframework-cli/issues')
        this.error(err.message)
      } catch (e) {}
    }
  }

  // Flush telemetry to avoid performance issues
  async finally(_: Error | undefined) {
    /* tslint:disable:strict-type-predicates */
    if (this.telemetryEnabled !== null && this.telemetryEnabled) {
      Telemetry.flushTelemetry()
    }
    process.stdin.destroy()
  }

  async readStdin(): Promise<string> {
    try {
      return await ReadPipedData.read()
    } catch (error) {
      return ''
    }
  }

  trackEvent(msg: string, properties?: { [key: string]: any }) {
    /* tslint:disable:strict-type-predicates */
    if (this.telemetryEnabled !== null && this.telemetryEnabled) {
      Telemetry.trackEvent('bf-cli-' + msg, properties)
    }
  }

  private extractError(input: string | Error): string {
    return input instanceof Error ? input.name : input
  }

  private getTelemetryProperties(): Array<string> {
    // Retrieve flags from command
    const {flags, argv} = this.parse(this.ctor)

    // Iterate through flags and store only flags and not parameters or arguments to avoid instrumentation on user data
    let properties: string [] = []
    Object.keys(flags).forEach(key => {
      properties.push(key)
    })

    return properties.sort()
  }
}
