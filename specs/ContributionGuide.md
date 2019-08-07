# Contribution guide

## Steps to create a new plugin
    1. Clone the repo by running 'git clone https://github.com/microsoft/botframework-cli.git'
    2. Inside the project folder run 'npm run build'
    3. If you want to create a new plugin, inside the packages folder run 'npx oclif plugin <plugin-name>'

## Steps to create a new command
    1. To add a command, inside the plugin folder run 'npx oclif command <command-name>'. If you want to add a subcommand just name it colon separated as <command-name:subcommand-name>
    2. Replace the import 'import {Command, flags} from '@oclif/command' line inside the newly created command with 'import {Command, flags} from '@microsoft/bf-cli-command'
    3. Add the type to the flags property like this:   static flags: flags.Input<any> = {}
    4. Implement the run method