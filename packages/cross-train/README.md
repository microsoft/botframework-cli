@microsoft/bf-cross-train
==================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-cross-train)](https://npmjs.org/package/@microsoft/bf-cross-train)

# Commands
<!-- commands -->
* [`bf cross-train`](#bf-cross-train)

## `bf cross-train`

Lu and Qna cross train tool

```
USAGE
  $ bf cross-train

OPTIONS
  -h, --help       cross-train command help
  -i, --in         source lu and qna files folder
  -o, --out        output folder name. If not specified, the cross trained files will be wrote to cross-trained folder under folder of current command
  -- config        path to config file of mapping rules which is relative to folder specified by --in. If not specified, it will read default config.json from the folder specified by --in
  --intentName     Interuption intent name. Default: _Interuption
```

_See code: [src/commands/cross-train.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/cross-train/src/commands/cross-train.ts)_
