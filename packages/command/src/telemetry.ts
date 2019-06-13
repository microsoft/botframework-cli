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
    } catch (e) {
      // swallow the exception; we don't want to crash the app
      // on a failed attempt to collect usage data
    }
  }

  public static flushTelemetry(): void{
    if (this._client) {
      this._client.flush();
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
        .setAutoDependencyCorrelation(false);
      AppInsights.start();

      this._client = AppInsights.defaultClient;
    }
}

export default Telemetry;