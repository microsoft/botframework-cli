import {Command, flags} from "@oclif/command";

export default class Hello extends Command {
  public static description: string = "describe the command here";

  public static examples: string[] = [
    `$ oclif-example hello
hello world from ./src/hello.ts!
`,
  ];

  public static flags = {
    // flag with no value (-f, --force)
    force: flags.boolean({char: "f"}),
    // flag with no value (-f, --force)
    help: flags.help({char: "h"}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: "n", description: "name to print"}),
  };

  public static args = [{name: "file"}];

  public async run() {
    // tslint:disable-next-line:no-shadowed-variable
    const {args, flags} = this.parse(Hello);

    const name = flags.name || "world";
    this.log(`hello ${name} from ./src/commands/hello.ts`);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}
