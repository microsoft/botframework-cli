import {Command as Base} from '@oclif/command'
import Telemetry from './telemetry'   

const pjson = require('../package.json')


export abstract class Command extends Base {
  base = `${pjson.name}@${pjson.version}`

  // Implement telemetry tracking in Command
  async TrackEvent(msg : string, properties?: { [key: string]: any }){
    Telemetry.trackEvent(msg, properties);
  }

  async init(){ 
    this.TrackEvent(this.id+'', {'flags' : this.getTelemetryProperties()})
    super.init();
  }

  error(input: string | Error, options: {code?: string, exit: false}): void
  error(input: string | Error, options?: {code?: string, exit?: number}): never
  error(input: string | Error, options: {code?: string, exit?: number | false} = {}) {
    this.TrackEvent(this.id+'', {'flags' : this.getTelemetryProperties(), 'error': input})
    return super.error(input, options as any);
  }

  private getTelemetryProperties() : Array<string>{
        // Retrieve flags from command
        const {flags, argv} = this.parse(this.ctor)

        // Iterate through flags and store only flags and not parameters or arguments to avoid instrumentation on user data
        let properties : string [] = [];
        for (let key in flags) {
          properties.push(key);
        }
        return properties;
  }
}
