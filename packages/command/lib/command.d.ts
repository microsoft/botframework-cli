import { Command as Base } from '@oclif/command';
export declare abstract class Command extends Base {
    base: string;
    init(): Promise<void>;
    error(input: string | Error, options: {
        code?: string;
        exit: false;
    }): void;
    error(input: string | Error, options?: {
        code?: string;
        exit?: number;
    }): never;
    catch(err: any): Promise<any>;
    finally(_: Error | undefined): Promise<void>;
    trackEvent(msg: string, properties?: {
        [key: string]: any;
    }): Promise<void>;
    private extractError;
    private getTelemetryProperties;
}
