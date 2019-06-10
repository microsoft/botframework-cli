import {Command as Base} from '@oclif/command'
import Telemetry from './telemetry'   

const pjson = require('../package.json')

export abstract class Command extends Base {
  base = `${pjson.name}@${pjson.version}`
  
    async init(){ 
      this.trackEvent(`${this.id}`, {'flags' : this.getTelemetryProperties()})
      super.init();
    }
  
    error(input: string | Error, options: {code?: string, exit: false}): void
    error(input: string | Error, options?: {code?: string, exit?: number}): never
    error(input: string | Error, options: {code?: string, exit?: number | false} = {}) {
      console.error(input);
    }

    async catch(err: any){
      this.trackEvent(this.id+'', {'flags' : this.getTelemetryProperties(), 'error': this.extractError(err)})
      return super.catch(err);
    }
  
    // Flush telemetry to avoid performance issues
    async finally(_: Error | undefined){
      Telemetry.flushTelemetry();
      super.finally(_);
    }

    // Implement telemetry tracking in Command
    async trackEvent(msg : string, properties?: { [key: string]: any }){
      Telemetry.trackEvent(msg, properties);
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
