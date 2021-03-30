@microsoft/bf-lg-cli
======================

This package is intended for Microsoft use only and should be consumed through @microsoft/botframework-cli. It is not designed to be consumed as an independent package.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-luis-cli.svg)](https://npmjs.org/package/@microsoft/bf-luis-cli)

# Relevant docs
- [.lg file format][1]
- [translating .lg files][2]


# Commands
<!-- commands -->
* [`bf lg`](#bf-lg)
* [`bf lg:expand`](#bf-lgexpand)
* [`bf lg:translate`](#bf-lgtranslate)
* [`bf lg:verify`](#bf-lgverify)
* [`bf lg:analyze`](#bf-lganalyze)

## `bf lg`

Parse, collate, expand and translate lg files.

```
USAGE
  $ bf lg

OPTIONS
  -h, --help  lg command help
```

_See code: [src/commands/lg/index.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/lg/src/commands/lg/index.ts)_

## `bf lg:expand`

Expand one or all templates in .lg file(s). Expand an inline expression.

```
USAGE
  $ bf lg:expand

OPTIONS
  -f, --force              If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help               lg:expand help
  -i, --in=in              (required) Folder that contains .lg file.
  -o, --out=out            Output file or folder name. If not specified stdout will be used as output
  -r, --recurse            Consider sub-folders to find .lg file(s)
  --all                    When set, all templates in the .lg file be expanded.
  --expression=expression  Inline expression provided as a string to evaluate.
  --interactive            Interactively prompt for all missing entity value references required for expansion.
  --template=template      Name of the template to expand. Template names with spaces must be enclosed in quotes.
  --testInput=testInput    Path to a JSON file containing test input for all variable references.
```

_See code: [src/commands/lg/expand.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/lg/src/commands/lg/expand.ts)_

## `bf lg:translate`

Machine translate .lg files using Microsoft Translator Text API.

```
USAGE
  $ bf lg:translate

OPTIONS
  -f, --force                  If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help                   lg:translate help
  -i, --in=in                  (required) Folder that contains .lg file.
  -o, --out=out                Output file or folder name. If not specified stdout will be used as output
  -r, --recurse                Consider sub-folders to find .lg file(s)
  --region=region              (required) The sub region.
  --srclang=srclang            Source lang code. Auto detect if missing.
  --tgtlang=tgtlang            (required) Comma separated list of target languages.
  --translate_comments         Machine translate all comments found in .lg file
  --translate_link_text        Machine translate link description in .lg file
  --translatekey=translatekey  (required) Machine translation endpoint key.
```

_See code: [src/commands/lg/translate.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/lg/src/commands/lg/translate.ts)_

## `bf lg:verify`

Verify .lg file(s) and collate them into a single file.

```
USAGE
  $ bf lg:verify

OPTIONS
  -f, --force    If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help     lg:verify help
  -i, --in=in    (required) Folder that contains .lg file.
  -o, --out=out  Output file or folder name. If not specified stdout will be used as output
  -r, --recurse  Considers sub-folders to find .lg file(s)
```

_See code: [src/commands/lg/verify.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/lg/src/commands/lg/verify.ts)_

## `bf lg:analyze`

Analyze templates in .lg files to show all the places where a template is used.

```
USAGE
  $ bf lg:analyze

OPTIONS
  -f, --force    If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help     lg:analyze help
  -i, --in=in    (required) LG File or folder that contains .lg file(s)
  -o, --out=out  Output file or folder name. If not specified stdout will be used as output
  -r, --recurse  Consider sub-folders to find .lg file(s)
```

_See code: [src/commands/lg/verify.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/lg/src/commands/lg/analyze.ts)_
<!-- commandsstop -->

[1]:https://aka.ms/lg-file-format
[2]:./docs/translate-command.md
