/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as AppInsights from 'applicationinsights'

const INSTRUMENTATION_KEY = 'cc91f74a-1abd-4be0-8a96-fddedbc08dd7'

/* tslint:disable:no-unnecessary-class */
class Telemetry {
  public static trackEvent(name: string, properties?: { [key: string]: any }): void {
    if (!this._client) {
      this.startup()
    }
    try {
      this._client.trackEvent({name, properties})
      /* tslint:disable:no-unused */
    } catch (e) {
      // swallow the exception; we don't want to crash the app
      // on a failed attempt to collect usage data
    }
  }

  public static flushTelemetry(): void {
    if (this._client) {
      this._client.flush()
    }
  }

  private static _client: AppInsights.TelemetryClient

  private static startup(): void {
    AppInsights.setup(INSTRUMENTATION_KEY)
      // turn off extra instrumentation
      .setAutoCollectConsole(false)
      .setAutoCollectDependencies(false)
      .setAutoCollectExceptions(false)
      .setAutoCollectPerformance(false)
      .setAutoCollectRequests(false)
      .setAutoDependencyCorrelation(false)

    AppInsights.defaultClient.context.tags[AppInsights.defaultClient.context.keys.cloudRoleInstance] = ''
    AppInsights.defaultClient.context.tags[AppInsights.defaultClient.context.keys.deviceId] = ''
    AppInsights.defaultClient.context.tags[AppInsights.defaultClient.context.keys.locationIp] = '0.0.0.0'
    AppInsights.defaultClient.context.tags[AppInsights.defaultClient.context.keys.deviceOSVersion] = ''
    AppInsights.defaultClient.context.tags[AppInsights.defaultClient.context.keys.deviceType] = ''
    AppInsights.start()

    this._client = AppInsights.defaultClient
  }
}

export default Telemetry
