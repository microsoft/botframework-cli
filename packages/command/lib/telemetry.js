"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const AppInsights = tslib_1.__importStar(require("applicationinsights"));
const INSTRUMENTATION_KEY = '12ca0fd4-de70-420e-aa46-3ec7f6cd040d';
class Telemetry {
    static trackEvent(name, properties) {
        if (!this._client) {
            this.startup();
        }
        try {
            this._client.trackEvent({ name, properties });
        }
        catch (e) {
            // swallow the exception; we don't want to crash the app
            // on a failed attempt to collect usage data
        }
    }
    static flushTelemetry() {
        if (this._client) {
            this._client.flush();
        }
    }
    static startup() {
        AppInsights.setup(INSTRUMENTATION_KEY)
            // turn off extra instrumentation
            .setAutoCollectConsole(false)
            .setAutoCollectDependencies(false)
            .setAutoCollectExceptions(false)
            .setAutoCollectPerformance(false)
            .setAutoCollectRequests(false)
            .setAutoDependencyCorrelation(false);
        AppInsights.start();
        this._client = AppInsights.defaultClient;
    }
}
exports.default = Telemetry;
