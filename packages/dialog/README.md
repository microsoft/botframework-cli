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
- [@microsoft/bf-dialog](#microsoftbf-dialog)
- [Relevant docs](#relevant-docs)
- [Commands](#commands)
  - [`bf dialog`](#bf-dialog)
  - [`bf dialog:merge PATTERNS`](#bf-dialogmerge-patterns)
  - [`bf dialog:verify PATTERNS`](#bf-dialogverify-patterns)

## `bf dialog`

Dialog related commands for working with .schema and .dialog files.

```
USAGE
  $ bf dialog

OPTIONS
  -h, --help  Dialog command help
```

_See code: [src/commands/dialog/index.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/dialog/blob/v1.0.0/src/commands/dialog/index.ts)_

## `bf dialog:merge PATTERNS`

Merge `<kind>.schema` and `<kind>[.<locale>].uischema` definitions from a project and its dependencies into a single .schema for describing .dialog files and a per locale .uischema for describing how Composer shows them.  If a dependent package has an ExportedAssets directory it is copied to ImportedAssets/<package> in the --imports directory.

```
USAGE
  $ bf dialog:merge PATTERNS

ARGUMENTS
  PATTERNS  Any number of glob regex patterns to match .csproj, .nuspec or package.json files.

OPTIONS
  -h, --help             show CLI help
  -o, --output=output    Output path and filename for merged .schema and .uischema.  Defaults to first project name.
  -s, --schema=schema    Path to merged .schema file to use if merging .uischema only.
  -v, --verbose          Show verbose logging of files as they are processed.
  --extension=extension  [default: .dialog,.lg,.lu,.schema,.qna,.uischema] Extension to include as a resource for C#.

  --imports=imports      Output path for imported assets.  Defaults to the directory of --out with an ImportedAssets
                         directory.

EXAMPLES
  $ bf dialog:merge myProject.csproj plugins/*.nuspec
  $ bf dialog:merge package.json -o app.schema
```

_See code: [src/commands/dialog/merge.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/dialog/blob/v1.0.0/src/commands/dialog/merge.ts)_

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

_See code: [src/commands/dialog/verify.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/dialog/blob/v1.0.0/src/commands/dialog/verify.ts)_
<!-- commandsstop -->
