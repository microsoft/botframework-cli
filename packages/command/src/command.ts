import {Command as Base} from '@oclif/command'
import {CLIError} from '@oclif/errors'

const chalk = require('chalk')
const pjson = require('../package.json')
import Telemetry from './telemetry'

export {CLIError} from '@oclif/errors'

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

  async catch(err: any) {
    if (err instanceof CLIError) {
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
    Telemetry.flushTelemetry()
  }

  trackEvent(msg: string, properties?: { [key: string]: any }) {
    /* tslint:disable:strict-type-predicates */
    if (this.telemetryEnabled !== null && this.telemetryEnabled) {
      Telemetry.trackEvent('bf-cli-' + msg, properties)
    }
  }

  private extractError(input: string | Error): string {
    return input instanceof Error ? input.message.concat(input.name) : input
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
