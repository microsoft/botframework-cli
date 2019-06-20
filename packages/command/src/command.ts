import {Command as Base} from '@oclif/command'
import Telemetry from './telemetry'
import {CLIError} from '@oclif/errors' 

const pjson = require('../package.json')

export abstract class Command extends Base {
  base = `${pjson.name}@${pjson.version}`
  telemetryEnabled = false
  
  async init(){ 
    this.telemetryEnabled = (this.config.pjson.telemetry == undefined || this.config.pjson.telemetry == null) ? false: this.config.pjson.telemetry
    this.trackEvent(`${this.id}`, {'flags' : this.getTelemetryProperties()})
    return super.init();
  }
  
  error(input: string | Error, options: {code?: string, exit: false}): void
  error(input: string | Error, options?: {code?: string, exit?: number}): never
  error(input: string | Error, options: {code?: string, exit?: number | false} = {}) {
    console.error(input);
  }

  async catch(err: any){
    if (err instanceof CLIError) return this.exit(0)
    if (!err.message) throw err
    if (err.message.match(/Unexpected arguments?: (-h|--help|help)(,|\n)/)) {
      return this._help()
    } else if (err.message.match(/Unexpected arguments?: (-v|--version|version)(,|\n)/)) {
      return this._version()
    } else {
      try {
        this.trackEvent(this.id+'', {'flags' : this.getTelemetryProperties(), 'error': this.extractError(err)})
        this.log('Unknown error during execution. Please file an issue on https://github.com/microsoft/botframework-cli/issues')
      } catch {}
      throw err
    }
  }
  
  // Flush telemetry to avoid performance issues
  async finally(_: Error | undefined){
    Telemetry.flushTelemetry();
    return super.finally(_);
  }

  // Implement telemetry tracking in Command
  async trackEvent(msg : string, properties?: { [key: string]: any }){
    if (this.telemetryEnabled != null && this.telemetryEnabled) {
      Telemetry.trackEvent(msg, properties);
    }
  }

  private extractError(input: string | Error) : string {
    return input instanceof Error ? input.message.concat(input.name)  : input;
  }

  private getTelemetryProperties() : Array<string>{
    // Retrieve flags from command
    const {flags, argv} = this.parse(this.ctor)

    // Iterate through flags and store only flags and not parameters or arguments to avoid instrumentation on user data
    let properties : string [] = [];
    for (let key in flags) {
      properties.push(key);
    }

    return properties.sort();
  }
}
