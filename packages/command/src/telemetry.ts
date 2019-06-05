import * as AppInsights from 'applicationinsights';

const INSTRUMENTATION_KEY = '12ca0fd4-de70-420e-aa46-3ec7f6cd040d';

class Telemetry{
  private static _client: AppInsights.TelemetryClient;

  public static trackEvent(name: string, properties?: { [key: string]: any }): void{
    if (!this._client) {
      this.startup();
    }
    try {
      this._client.trackEvent({ name, properties });
      // TODO: Check is flush is better than reducing the Batch interval
      //this._client.flush();
    } catch (e) {
      // swallow the exception; we don't want to crash the app
      // on a failed attempt to collect usage data
    }
  }


  private static startup(): void {

      AppInsights.setup(INSTRUMENTATION_KEY)
        // turn off extra instrumentation
        .setAutoCollectConsole(false)
        .setAutoCollectDependencies(false)
        .setAutoCollectExceptions(false)
        .setAutoCollectPerformance(false)
        .setAutoCollectRequests(false)
        // Fix for zonejs / restify conflict (https://github.com/Microsoft/ApplicationInsights-node.js/issues/460)
        .setAutoDependencyCorrelation(false);
      // do not collect the user's machine name
      AppInsights.defaultClient.config.maxBatchIntervalMs = 100;
      AppInsights.defaultClient.context.tags[AppInsights.defaultClient.context.keys.cloudRoleInstance] = '';
      AppInsights.start();

      this._client = AppInsights.defaultClient;
    }
}

export default Telemetry;