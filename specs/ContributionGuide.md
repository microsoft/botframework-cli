# Contribution guide

## Pre-requisites
    1. Review and follow guidelines based on [Foundation Dev Spec](https://github.com/microsoft/botframework-cli/blob/master/specs/FoundationDevSpec.md)
    2. Create a corresponding design spec & schedule a review with BF CLI primary owners
 
## Steps to create a new plugin
    1. Clone the repo by running 'git clone https://github.com/microsoft/botframework-cli.git'
    2. Inside the project folder run 'npm run build'
    3. If you want to create a new plugin, inside the packages folder run 'npx oclif plugin <plugin-name>'
    4. Add @microsoft/bf-cli-command as a dependency

## Steps to create a new command
    1. To add a command, inside the plugin folder run 'npx oclif command <command-name>'. If you want to add a subcommand just name it colon separated as <command-name:subcommand-name>
    2. Replace the import 'import {Command, flags} from '@oclif/command' line inside the newly created command with 'import {Command, flags} from '@microsoft/bf-cli-command'
    3. Add the type to the flags property like this:   static flags: flags.Input<any> = {}
    4. Implement the run method
    
## Stage Preview
    1. All command groups in preview shall display the following message in help and run: Preview: This command is in preview stage. Please use with discretion and report any issues in the git repository.
    2. File an issue for review and scheduling into GA
    3. If command group is in early stages of development, direct users to your forked repository.
