import {Command as Base} from '@oclif/command'
import Telemetry from './telemetry'   

const pjson = require('../package.json')


export abstract class Command extends Base {
  base = `${pjson.name}@${pjson.version}`

  TrackEvent(msg : string, properties?: { [key: string]: any }){
    Telemetry.trackEvent(msg, properties);
  }
}
