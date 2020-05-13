@microsoft/bf-dialog
====================

This package is intended for Microsoft use only and should be consumed through @microsoft/botframework-cli. It is not designed to be consumed as an independent package.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-dialog.svg)](https://npmjs.org/package/@microsoft/bf-dialog)
[​![Downloads/week](https://img.shields.io/npm/dw/@microsoft/bf-dialog.svg)](https://npmjs.org/package/@microsoft/bf-dialog)
[![License](https://img.shields.io/npm/l/@microsoft/bf-dialog.svg)](https://github.com/microsoft/botframework-cli/blob/master/package.json)

# Relevant docs
- [Dialog documentation](https://github.com/microsoft/botframework-cli/tree/master/packages/dialog/docs/readme.md)

# Commands
<!-- commands -->
* [`bf dialog`](#bf-dialog)
* [`bf dialog:merge PATTERNS`](#bf-dialogmerge-patterns)
* [`bf dialog:verify PATTERNS`](#bf-dialogverify-patterns)

## `bf dialog`

Dialog related commands for working with .schema and .dialog files.

```
USAGE
  $ bf dialog

OPTIONS
  -h, --help  Dialog command help
```

_See code: [src/commands/dialog/index.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/dialog/src/commands/dialog/index.ts)_

## `bf dialog:merge PATTERNS`

Merge component .schema files into an app.schema.

```
USAGE
  $ bf dialog:merge PATTERNS

ARGUMENTS
  PATTERNS  Any number of glob regex patterns to match .schema, .csproj, or package.json files.

OPTIONS
  -h, --help           show CLI help
  -o, --output=output  [default: app.schema] Output path and filename for merged schema.
  -v, --verbose        Show verbose logging of files as they are processed.

EXAMPLES
  $ bf dialog:merge *.csproj
  $ bf dialog:merge libraries/**/*.schema **/*.csproj -o app.schema
```

_See code: [src/commands/dialog/merge.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/dialog/src/commands/dialog/merge.ts)_

## `bf dialog:verify PATTERNS`

Verify .dialog files match their app.schema.

```
USAGE
  $ bf dialog:verify PATTERNS

ARGUMENTS
  PATTERNS  Any number of glob regex patterns to match .dialog files.

OPTIONS
  -h, --help     show CLI help
  -v, --verbose  Show verbose output
```

_See code: [src/commands/dialog/verify.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/dialog/src/commands/dialog/verify.ts)_
<!-- commandsstop -->
