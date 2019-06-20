declare class Telemetry {
    private static _client;
    static trackEvent(name: string, properties?: {
        [key: string]: any;
    }): void;
    static flushTelemetry(): void;
    private static startup;
}
export default Telemetry;
