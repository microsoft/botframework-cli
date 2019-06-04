import * as AppInsights from 'applicationinsights';

const INSTRUMENTATION_KEY = '';

class Telemetry{
  private static _client: AppInsights.TelemetryClient;

  public static trackEvent(name: string, properties?: { [key: string]: any }): void {
    if (!this._client) {
      this.startup();
    }
    try {
      this._client.trackEvent({ name, properties });
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
      AppInsights.defaultClient.context.tags[AppInsights.defaultClient.context.keys.cloudRoleInstance] = '';
      AppInsights.start();

      this._client = AppInsights.defaultClient;
    }
}

export default Telemetry;