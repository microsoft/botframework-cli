# Foundation Dev Spec

## Summary
The CLI will be using OClif JS/TS  command line shell platform. The platform provides a uniform mechanism for command line parsing and runtime execution environment with extensibility of additional commands similar to az cli but tailored for local bot framework requirements. 

The following specifications detail the foundation requirements, design and implementation considerations.

## Requirements

The command line shell must adhere to the following requirements that shall be expanded upon in later sections:

* Command groups with parameters
* Verbs with parameters
* Defaults management
* Common groups: version, help, verbose, logging
* Parser requirements, limitations, constraints (what could but shouldn't be allowed for instance)
* Extensible plugin architecture
* Isolation across plugins
* Error handling, return codes, exceptions management, & corresponding messaging
* Linting, static analysis
* Common upgrade / update mechanisms using Microsoft approved standard library sources
* Package management (ala Lerna)
* Partner onboarding process & how-to documentation
* Usage documentation
* Extensibility guidelines documentation
* Automated code annotation generation
* Logging infrastructure (to file, STDOUT/STDERR, Application Insights)
* Test Infrastructure for UT, and CI support
* Build environment, CI cadence for nightly, weekly, release, with versioning design, in repo etc)
* Telemetry instrumentation
* Installation & runtime environment (how/where to install, uninstall and invoke using 'bf' command)
* Configuration management

## AZ CLI Guidelines
Review [AZ CLI guidelines](https://github.com/Azure/azure-cli/blob/dev/doc/command_guidelines.md) as a baseline & alignment. Our objective is to align to AZ CLI as much as possible. 

Here's a "reducted" (but almost verbatim) version of the guidelines as applicable to 'bf'. 

### General Patterns
* All commands, comm and group and arguments must have descriptions
* You must provide command examples for non-trivial commands
* Command output must go to stdout, everything else to stderr (log/status/errors).
* Log to logger.error() or logger.warning() for user messages; do not use the print() function
* Use the appropriate logging level for printing strings. e.g. logging.info(“Upload of myfile.txt successful”) NOT return “Upload successful”.

### Command Naming and Behavior

* Commands must follow a "[noun] : [verb] : [noun]" pattern (e.g. config:show:telemetry)
* Multi-word subgroups should be hyphenated e.g. foo-resource instead of fooresource
* All command names should contain a verb e.g. account get-connection-string instead of account connection-string
* For commands which maintain child collections, the follow pairings are acceptable. CREATE/DELETE (same as top level resources); ADD/REMOVE
* Avoid hyphenated command names when moving the commands into a subgroup would eliminate the need. e.g. database show and database get instead of show-database and get-database
* If a command subgroup would only have a single command, move it into the parent command group and hyphenate the name. This is common for commands which exist only to pull down cataloging information. e.g. database list-sku-definitions instead of database sku-definitions list
* In general, avoid command subgroups that have no commands. This often happens at the first level of a command branch. e.g. keyvault create instead of keyvault vault create (where keyvault only has subgroups and adds unnecessary depth to the tree).

### Argument Naming Conventions
* Arguments with specific units: 
    * In general, DO NOT put units in argument names. ALWAYS put the expected units in the help text. Example: --duration-in-minutes should simply be --duration. This prevents the need to add more arguments later if more units are supported.
    * Consider allowing a syntax that will let the user specify units. For example, even if the service requires a value in minutes, consider accepting 1h or 60m. It is fine to assume a default (i.e. 60 = 60 minutes).
    * It is acceptable to use a unit in the argument name when it is used like an enum. For example, --start-day is okay when it accepts MON, TUE, etc. --start-hour is okay when it indicates an hour of the day.
* Overloading Arguments: 
    * Avoid having multiple arguments that simply represent different ways of getting the same thing. Instead, use a single descriptive name and overload it appropriately. For example, assume a command which can accept a parameter file through a URL or local path.

### Standard Command Types
The following are standard names and behavioral descriptions for CRUD commands commonly found within the CLI. These standard command types MUST be followed for consistency with the rest of the CLI.
* CREATE - standard command to create a new resource. Usually backed server-side by a PUT request. 'create' commands should be idempotent and should return the resource that was created.
* UPDATE - command to selectively update properties of a resource and preserve existing values. May be backed server-side by either a PUT or PATCH request, but the behavior of the command should always be PATCH-like. All update commands should be registered using the generic_update_command helper to expose the three generic update properties. update commands MAY also allow for create-like behavior (PATCH) in cases where a dedicated create command is deemed unnecessary. update commands should return the updated resource.
* SET - command to replace all properties of a resource without preserving existing values, typically backed server-side by a PUT request. This is used when PATCH-like behavior is deemed unnecessary and means that any properties not specifies are reset to their default values. set commands are more rare compared to update commands. set commands should return the updated resource.
* SHOW - command to show the properties of a resource, backed server-side by a GET request. All show commands should be registered using the show_command or custom_show_command helpers to ensure 404(Not Found) is always returning an exit code of 3.
* LIST - command to list instances of a resource, backed server-side by a GET request. When there are multiple "list-type" commands within an SDK to list resources at different levels (for example, listing resources in a subscription vice in a resource group) the functionality should be exposed by have a single list command with arguments to control the behavior. For example, if --resource-group is provided, the command will call list_by_resource_group; otherwise, it will call list_by_subscription.
* DELETE - command to delete a resource, backed server-side by a DELETE request. Delete commands return nothing on success.
* WAIT - command that polls a GET endpoint until a condition is reached. If any command within a command group or subgroup exposes the --no-wait parameter, this command should be exposed.

### Non-standard Commands
For commands that don't conform to one of the above-listed standard command patterns, use the following guidance.
(*) Don't use single word verbs if they could cause confusion with the standard command types. For example, don't use get or new as these sound functionally the same as show and create respectively, leading to confusion as to what the expected behavior should be.
(*) Descriptive, hyphenated command names are often a better option than single verbs.

### Coding Practices
(*) All commands should have tests

## Inputs
Inputs specifications define dependencies, and running environment dependencies

## Dependencies:
* OSS Oclif 
  * [https://github.com/oclif/command]
    [https://github.com/oclif/config]
* Microsoft approved OSS library sources 
  * registry [https://ossmsft.visualstudio.com/_oss?searchText=%40oclif%2Fcommand&_a=artifact]
             [https://ossmsft.visualstudio.com/_oss?searchText=%40oclif%2Fconfig&_a=artifact]
             [https://ossmsft.visualstudio.com/_oss?searchText=%22%40oclif%2Fplugin-help%22&_a=artifact]
* Run in all supported platforms: Win10 + 4 x Linux supported OS's
	

## Non-dependencies
* Heroku CLI (we're using it as an example, but not depending on it)


## Outputs
* Corresponding to requirements above: 
  * Command line parsing capabilities
  * Extensible plugin capabilities
  * Build/test/static analysis infrastructure
  * Acceptance criteria enforcement mechanism
    * Verify & fail builds if not passing required quality gates (code coverage, issues, docs)
    * Upgrade/update messaging, retry logic, failover, opt-in model and source libraries 
    * Opt in to telemetry & telemetry instrumentation
* Command line form specifications [**TBD**]
* Automated documentation placeholders
* Error handling, messaging, codes, exceptions
  * Code should identify component, and failure category (see for example exception categories).  
	
<output guarantees, downstream dependencies>

## Use Cases
Show a few examples representatives of usage by core foundation (help/version/verbose) and specific extensions.

## Exceptions
<restrictions, constraints, other non-goals worth calling out>

## Design Specifications
Each command extends from oclif/command https://github.com/oclif/command https://oclif.io/docs/commands.

A basic command looks like the following

    import Command from '@oclif/command'

    export class MyCommand extends Command {
      static description = 'description of this example command'

      async run() {
        console.log('running my command')
      }
    }

The only part that is required is the run function
BF CLI has a command class extending '@oclif/command'. All BF CLI plugins should extend the bf-cli commmand  custom class [https://github.com/microsoft/botframework-cli/blob/master/packages/command/src/command.ts]. 
This custom command class will send telemetry when a command is run, exposes the trackEvent to the command and handles errors the same way as AZ Bot CLI

[**TBD**: This is the big section that describes the solutions for the requirements above]

### Command groups with parameters
As Multi CLIs grow it can be useful to nest commands within topics. This is supported simply by placing command files in subdirectories. For example, with the BF CLI we have a topic bf ludown with commands like bf ludown, bf ludown:parse:toluis , bf ludown:translate, etc. The directory structure looks like this:

    package.json 
    src/ 
    └── commands/ 
      └── ludown/ 
        └── parse/ 
          └──toluis.ts 
    └── translate.ts

#### Verbs with parameters
Flag options are non-positional arguments passed to the command. Flags can either be option flags which take an argument, or boolean flags which do not. An option flag must have an argument.Here are some other ways the user can use input flags. This is assuming the command has flags like -f, --file=file and -v, --verbose (string and boolean flag):
    $ bf -v
    $ bf --file=foo
    $ bf --file foo
    $ bf -f foo
    $ bf -f=foo
    $ bf -ffoo
    $ bf -vffoo

For detailed info please refer to oclif doc [https://oclif.io/docs/flags].

#### Common groups: version, help, verbose, logging
Help and version are executed before any other flag. Oclif default flags for this are -v, --version and -h, --help
Verbose should be implemented by each command according to its needs. Some commands like chatbot don’t implement them. If needed it can be declared a custom flag that can be shared amongst multiple commands in cli command base class
Logging is exposed in the command class as this.log() logging to process.stdout.write and this.error to console.error.
The new CLI Command Base class exposes the trackEvent to log telemetry events

#### Extensible plugin architecture
Plugins are a great way to offer experimental functionality, allow users to extend your CLI, break up a CLI into modular components, or share functionality between CLIs.
Plugins can have commands or hooks just like a CLI. BF cli will add each tool as a plugin. To add a plugin such as chatdown, first add it to your CLI as a dependency then add the following to cli package.json:
    {
      "name": "bf-cli",
      "version": "0.0.0",
      // ...
      "oclif": {
        "plugins": [
          "bf-chatdown"
        ]
      }
    }

To create a new plugin, just run the following command inside the packages folder of botframework-cli:

npx oclif plugin myplugin_name

#### Isolation
Each plugin has it's own set of unit tests and runs independently.
#### Error handling, return codes, exceptions management, & corresponding messaging
Run function is executed inside a try catch.

    async catch(err: any) {
      if (err instanceof CLIError) return this.exit(0)
      if (!err.message) throw err
      if (err.message.match(/Unexpected arguments?: (-h|--help|help)(,|\n)/)) {
        return this._help()
      } else if (err.message.match(/Unexpected arguments?: (-v|--version|version)(,|\n)/)) {
        return this._version()
      } else {
        try {
          this.trackEvent(this.id + '', {flags : this.getTelemetryProperties(), error: this.extractError(err)})
          this.log('Unknown error during execution. Please file an issue on https://github.com/microsoft/botframework-cli/issues')
        } catch {}
        throw err
      }
    }


#### Linting, static analysis
Linting is already setup by oclif [https://github.com/oclif/tslint/blob/master/tslint.json].

#### Common upgrade / update mechanisms using Microsoft approved standard library sources

For example, in current CLI, the presences of an update is detected and results with a message to the user when invoked for help, per below. We need to detect the need for update and notify the user or accept opt-in "always keep me up-to-date, notify me but don't install, update-with-no-prompt, update-with-prompt, do-not-update" set of configuration options.

[BF]c:\workspace\botroot>ludown

     Update available 1.3.0 -> 1.3.1
     Run npm i -g ludown to update.
    Usage: ludown [options] [command]

    Ludown is a command line tool to bootstrap language understanding models from .lu files

    Options:
      --prefix       Add [ludown] prefix to all messages
      -v, --Version  output the version number
      -h, --help     output usage information

    Commands:
      parse|p        Convert .lu file(s) into LUIS JSON OR QnA Maker JSON files.
      refresh|d      Convert LUIS JSON and/ or QnAMaker JSON file into .lu file
      translate|t    Translate .lu files
      help [cmd]     display help for [cmd]


#### Package management (ala Lerna)
Lerna is used only in development to bootstrap the packages that are not yet published. Each plugin and cli is an independent npm package. Main CLI will have the plugin listed as npm dependency. 

#### Partner onboarding process & how-to documentation

#### Automated documentation generation
By default you can pass --help to the CLI to get help such as flag options and argument information. This information is also automatically placed in the README whenever the npm package of the CLI is published.

#### Logging infra (to file, STDOUT/STDERR, application insights)
Logging is exposed in the command class as this.log() logging to process.stdout.write and this.error to console.error.
The new CLI Command Base class exposes the trackEvent to send telemetry events if needed.

#### Test Infrastructure for UT, and CI support
When a new command is created by executing the command: npx oclif command command_name a matching test file is created under test folder:
	src/
	  commands/
	       command_name.ts
	test/
	  commands/
	       command_name.test.ts
All the tests are discoverable by the script npm run test executing : "test": "nyc --extension .ts mocha --forbid-only \"test/**/*.test.ts\""

#### Build environment, CI cadence for nightly, weekly, release, versioning design, repo)
[https://fuselabs.visualstudio.com/SDK_v4/_build?definitionId=537]

#### Telemetry instrumentation
Telemetry is exposed  through the cli-command [https://github.com/microsoft/botframework-cli/blob/master/packages/command/src/command.ts]

#### Installation, invocation & runtime environment (how/where to install, uninstall and invoke using 'bf' command)
$ npm install -g botframework-cli
$ bf COMMAND
running command...
$ bf (-v|--version|version)
botframework-cli/0.0.0 darwin-x64 node-v12.1.0
$ bf --help [COMMAND]
USAGE
  $ bf COMMAND

#### Configuration management
<where do we store configuration file, how do we manage it, what format, what's in it, how plugins can read/write/update configuration>


## Technologies
<any technologies discussion as applicable>
We are using Oclif as a foundation for the command line parsing. In addition we're using the following utilities as follows:
* [**TBD**]

## Acceptance Criteria
<minimum bar, testing, other completion quality related items>
Code coverage must be at > 90% coverage across all components. Build should break if test pass reports coverage < 90% or tests do not pass at 100%.

[**TBD**: how do we verify quality, establish acceptance criteria so that the tool maintains high quality]

## Special Considerations
<while actual issues should be tracked github/issues initial placeholders may be placed here transiently for convinience.
  * Issue
  * Todo
  * ...
* [**TBD**:anything]

## Issues
	Issue, todo…


References
<any references of relevance>
* Oclif can be found here; https://oclif.io
* [**TBD**: library xyz can be found here]
