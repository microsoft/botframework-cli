# [BotSkills] Dev Spec One-Pager

## Template Usage: 
Use this template as a foundation for quick one-pager. Feel free to morph as you see fit for consideration & sharing. Don't force conformance to the headings, they're mostly for inspiration.

# TBD: This doc is just a draft placeholder

## Summary
The _BotSkills_ tool is used to manage (list, connect, modify) skills to bots. Skills themeselves are bots which can be "chained" behind a primary bot. To connect bots to primary bot one must configure the bot so that it is aware of the skills as well as write corresponding dispatching code to delegate conversations to the corresponding skill. For more on skills please refer to the following [Skills](tbd) documentation.

## Requirements
<Any requirements driving this feature, goals, functionality, itemized considerations>

The principal requirements for this tool is to retain 1-1 equivalence to the existing tool as described [here](https://github.com/microsoft/botframework-solutions/blob/master/tools/botskills/README.md).


## Inputs
<input requirements, upstream dependencies>
These are requirements inputs (not program inputs). What are the pre-conditions, and dependencies required for this tool.
### Upstream Dependencies and Preconditions
  * An existing bot and a corresponding skill bot to manage (list, connect, update...)
  * The BF CLI foundation
  * Run precondition: It must run within the directory of the C#??? project

### Downstream Dependencies
Skill bots require the _BotSkills_ tool to be configured. One can bypass the use of this tool, but it will require multiple manual steps which are significantly eased by the use of this tool.

## Outputs
<output guarantees, downstream dependencies>
The tool generates configuration ???...

## Use Cases
<all or sample of use cases, examples>

## Exceptions
<restrictions, constraints, other non-goals worth calling out>

## Design Specifications
<brief description of the selected design choice, relevant details to how it satisfies the requirement>

### Implementation Specifications

### Testing Specifications

### Documentation Specifications


## Technologies
<any technologies discussion as applicable>
The tool uses the foundation capabilities provided by BF CLI and assumes

## Methods 
<noteworthy, methods, techniques, algorithms>

## Acceptance Criteria
<minimum bar, testing, other completion quality related items>
Testing of all tools permutations shall be 

## Special Considerations
<issues, exceptions, workarounds, assumptions, pre-conditions, up/downstream dependencies> 

## Issues
<while actual issues should be tracked github/issues initial placeholders may be placed here transiently for convinience.
  * Issue
  * Todo
  * ...

## References


### The current _BotSkills_ tool usage: 

~~~
c:\>botskills --help
Usage: botskills [options] [command]

The skill program makes it easy to manipulate skills for Microsoft Bot Framework tools.

Options:
  -v, --version  output the version number
  -h, --help     output usage information

Commands:
  connect        connect any skill to your assistant bot
  disconnect     disconnect a specific skill from your assitant bot
  update         update a specific skill from your assistant bot
  refresh        refresh the connected skills
  list           list the connected skills in the assistant
  help [cmd]     display help for [cmd]

c:\>botskills connect --help
Usage: botskills connect [options]

Connect a skill to your assistant bot. Only one of both path or URL to Skill is needed.

Options:
  -b, --botName <name>          Name of your assistant bot
  -l, --localManifest <path>    Path to local Skill Manifest file
  -r, --remoteManifest <url>    URL to remote Skill Manifest
  --cs                          Determine your assistant project structure to be a CSharp-like structure
  --ts                          Determine your assistant project structure to be a TypeScript-like structure
  --noRefresh                   [OPTIONAL] Determine whether the model of your skills connected are not going to be refreshed (by default they are refreshed)
  --dispatchName [name]         [OPTIONAL] Name of your assistant's '.dispatch' file (defaults to the name displayed in your Cognitive Models file)
  --language [language]         [OPTIONAL] Locale used for LUIS culture (defaults to 'en-us')
  --luisFolder [path]           [OPTIONAL] Path to the folder containing your Skills' .lu files (defaults to './deployment/resources/skills/en' inside your assistant folder)
  --dispatchFolder [path]       [OPTIONAL] Path to the folder containing your assistant's '.dispatch' file (defaults to './deployment/resources/dispatch/en' inside your assistant folder)
  --outFolder [path]            [OPTIONAL] Path for any output file that may be generated (defaults to your assistant's root folder)
  --lgOutFolder [path]          [OPTIONAL] Path for the LuisGen output (defaults to a 'service' folder inside your assistant's folder)
  --skillsFile [path]           [OPTIONAL] Path to your assistant Skills configuration file (defaults to the 'skills.json' inside your assistant's folder)
  --resourceGroup [path]        [OPTIONAL] Name of your assistant's resource group in Azure (defaults to your assistant's bot name)
  --appSettingsFile [path]      [OPTIONAL] Path to your app settings file (defaults to 'appsettings.json' inside your assistant's folder)
  --cognitiveModelsFile [path]  [OPTIONAL] Path to your Cognitive Models file (defaults to 'cognitivemodels.json' inside your assistant's folder)
  --verbose                     [OPTIONAL] Output detailed information about the processing of the tool
  -h, --help                    output usage information
~~~
