import { Command, flags } from '@microsoft/bf-cli-command';
export default class QnamakerConvert extends Command {
    static description: string;
    static flags: flags.Input<any>;
    run(): Promise<void>;
    private writeOutput;
}
