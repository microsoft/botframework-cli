@microsoft/bf-dialog
====================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-dialog.svg)](https://npmjs.org/package/@microsoft/bf-dialog)
[![Downloads/week](https://img.shields.io/npm/dw/@microsoft/bf-dialog.svg)](https://npmjs.org/package/@microsoft/bf-dialog)
[![License](https://img.shields.io/npm/l/@microsoft/bf-dialog.svg)](https://github.com/microsoft/botframework-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @microsoft/bf-dialog
$ bf COMMAND
running command...
$ bf (-v|--version|version)
@microsoft/bf-dialog/0.0.0 darwin-x64 node-v12.1.0
$ bf --help [COMMAND]
USAGE
  $ bf COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bf dialog:merge [FILE]`](#bf-dialogmerge-file)
* [`bf dialog:verify [FILE]`](#bf-dialogverify-file)

## `bf dialog:merge [FILE]`

The bf dialog:merge creates an merged schema file which represents merging of all of the component
schemas and the SDK schemas together into an application .schema file.

The file pattern can be an arbitrary GLOB patterns for finding .schema files (such as myfolder/**/*.schema), but
the better way to use it is to invoke it in the folder that has a project in it (either .csproj or packages.json).
In that case the project file will be analyzed for all dependent folders and .schema files will be merged to create
the app.schema for the project.

```
USAGE
  $ bf dialog:merge GLOB1 [GLOB2] [GLOB3] [GLOB4] [GLOB5] [GLOB6] [GLOB7] [GLOB8] [GLOB9]

OPTIONS                                                                                                                                                                                                                                                                                           -b, --branch=branch  [default: 4.Future] The branch to use for the meta-schema component.schema.                                                                                                                                                                                                -h, --help           show CLI help
  -o, --output=output  [default: app.schema] Output path and filename for merged schema. [default: app.schema]                                                                                                                                                                                  -u, --update         Update .schema files to point the <branch> component.schema and regenerate component.schema if baseComponent.schema is present.
  --verbose            output verbose logging of files as they are processed
```

Example:
```
bf dialog:merge -o app.schema
```

_See code: [src/commands/dialog/merge.ts](https://github.com/microsoft/botframework-cli/blob/v0.0.0/src/commands/dialog/merge.ts)_

## `bf dialog:verify [FILE]`

The dialog:verify command is used to validate that all of the .dialog file resources for a project are valid based on the 
applications app.schema file (see dialog:merge command).

```
USAGE
  $ bf dialog:verify GLOB1 [GLOB2] [GLOB3] [GLOB4] [GLOB5] [GLOB6] [GLOB7] [GLOB8] [GLOB9]

OPTIONS                                                                                                                                                                                                                                                                                           -h, --help  show CLI help
  --verbose   Show verbose output
```

Example:
```
bf dialog:verify test/**/*.dialog
```

_See code: [src/commands/dialog/verify.ts](https://github.com/microsoft/botframework-cli/blob/v0.0.0/src/commands/dialog/verify.ts)_
