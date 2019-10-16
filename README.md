# BF Command Line Interface

[![Build Status](https://fuselabs.visualstudio.com/SDK_v4/_apis/build/status/CLI/Botframework-CLI-CI-PR?branchName=master)](https://fuselabs.visualstudio.com/SDK_v4/_build/latest?definitionId=537&branchName=master)
[![Coverage Status](https://img.shields.io/coveralls/github/microsoft/botframework-cli/master)](https://coveralls.io/github/microsoft/botframework-cli?branch=master)

The new BF Command Line Interface (CLI) tool replaces the collection of standalone tools used to manage Bot Framework bots and related services. We have ported most tools and are in process of porting the rest. The new BF CLI aggregates the collection of cross-platform tools into one cohesive and consistent interface.

The old tools will be deprecated in subsequent releases. All new investments, bug fixes, and new features will be implemented in the new consolided BF CLI alone.

## Available Commands
The following commands are currently available:
* [Chatdown](https://github.com/microsoft/botframework-cli/tree/master/packages/cli#bf-chatdown) 
* [QnAMaker](https://github.com/microsoft/botframework-cli/tree/master/packages/cli#bf-qnamaker)
* [Config](https://github.com/microsoft/botframework-cli/tree/master/packages/cli#bf-config)
* [Luis](https://github.com/microsoft/botframework-cli/tree/emimunoz/luis/packages/cli#bf-luis)

### Future Commands
The following commands will be ported in upcoming releases:
* LUIS (API)
* Dispatch

See [Porting Map](https://github.com/microsoft/botframework-cli/blob/master/PortingMap.md) for a mapping reference between old and new tools


## Plugin Architecture
BF CLI is based on [OClif](https://github.com/oclif/oclif) Framework and inherits its command line parsing style, and plugin architecture. 

## Installation

BF is based on the Node.js platform. You must download the following __prerequisties__:

* [Node.js](https://nodejs.org/) version 10.14.1 or higher

Install the tool using the following command: 

~~~
npm i -g @microsoft/botframework-cli
~~~

To view detailed usage information see the [CLI ReadMe page](https://github.com/microsoft/botframework-cli/tree/master/packages/cli)

## Issues and Feature Requests
Please file issues and feature requests [here](https://github.com/microsoft/botframework-cli/issues).

Thank you for your support.

## Privacy
Privacy is very important to us. BF CLI contains optional instrumentation that is designed to help us improve the tool based on **anonymous** usage patterns. __It is disabled, opted-out by default__. If you elect to opt-in, we will gather some usage data as follows:
* Command group calls
* Flags used **excluding** specific values (i.e. if used parameter _--folder:name_, we will only gather the use of _--folder_ but will not capture _name_).

To disable data collection see the  __*bf config*__ command.

Please refer to [Microsoft Privacy Statement](https://privacy.microsoft.com/en-US/privacystatement) for more details.  

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
