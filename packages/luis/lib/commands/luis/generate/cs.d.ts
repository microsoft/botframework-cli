import { Command, flags } from '@microsoft/bf-cli-command';
export default class LuisGenerateCs extends Command {
    static description: string;
    static flags: flags.Input<any>;
    reorderEntities(app: any, name: string): void;
    run(): Promise<void>;
}
