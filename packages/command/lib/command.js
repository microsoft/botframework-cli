"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const telemetry_1 = tslib_1.__importDefault(require("./telemetry"));
const pjson = require('../package.json');
class Command extends command_1.Command {
    constructor() {
        super(...arguments);
        this.base = `${pjson.name}@${pjson.version}`;
    }
    async init() {
        this.trackEvent(`${this.id}`, { 'flags': this.getTelemetryProperties() });
        super.init();
    }
    error(input, options = {}) {
        console.error(input);
    }
    async catch(err) {
        this.trackEvent(this.id + '', { 'flags': this.getTelemetryProperties(), 'error': this.extractError(err) });
        return super.catch(err);
    }
    // Flush telemetry to avoid performance issues
    async finally(_) {
        telemetry_1.default.flushTelemetry();
        super.finally(_);
    }
    // Implement telemetry tracking in Command
    async trackEvent(msg, properties) {
        telemetry_1.default.trackEvent(msg, properties);
    }
    extractError(input) {
        return input instanceof Error ? input.message.concat(input.name) : input;
    }
    getTelemetryProperties() {
        // Retrieve flags from command
        const { flags, argv } = this.parse(this.ctor);
        // Iterate through flags and store only flags and not parameters or arguments to avoid instrumentation on user data
        let properties = [];
        for (let key in flags) {
            properties.push(key);
        }
        return properties.sort();
    }
}
exports.Command = Command;
