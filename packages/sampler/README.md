@microsoft/bf-sampling-cli
======================

This package is a plugin for @microsoft/botframework-cli. It is not designed to be consumed as an independent package.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-luis-cli.svg)](https://npmjs.org/package/@microsoft/bf-luis-cli)

Sampler CLI is used for sampling utterances of lu files.

## Prerequisite

- [Node.js](https://nodejs.org/) version 12 or higher
- @microsoft/botframework-cli
```
$ npm install -g @microsoft/botframework-cli
```

## Installation
To install the bf-sampler-cli plugin:

```
bf plugins:install @microsoft/bf-sampler-cli@beta
```

To uninstall the bf-sampler-cli plugin, a step for upgrading the plugin:

```
bf plugins:unstall @microsoft/bf-sampler-cli@beta
```

# Commands

<!-- commands -->

* [`bf sampler`](#bf-sampler)
* [`bf sampler:sampling`](#bf-samplersampling)

## `bf sampler`

Display Sampler CLI available commands

```
USAGE
  $ bf sampler

OPTIONS
  -h, --help  Sampler commands help
```

_See code: [src\commands\orchestrator\index.ts]https://github.com/microsoft/botframework-cli/blob/beta/packages/sampler/src/commands/sampler/index.ts)_

## `bf sampler:sampling`

Do sampling to lu files.

```
USAGE
  $ bf sampler:sampling

OPTIONS
  -h, --help                                Orchestrator 'assess' command help.
  -i, --in=in                               Path to lu file or folder that contains lu files.
  -o, --out=out                             Path where sampled lu files will be placed. Default to current working directory.
  --maxImbalanceRatio=maxImbalanceRatio     [Default: 0.1] Max imbalance ratio for sampling.
  --maxUtteranceAllowed=maxUtteranceAllowed [Default: 15000] Max utterances allowed after samping.
  --sampleSize=sampleSize                   [Default: 2] sample size.

EXAMPLE
  bf sampler:sampling --in ./path/to/file/ --out ./path/to/folder/ --maxImbalanceRatio 0.1 --maxUtteranceAllowed 15000 --sampleSize 2
```

_See code: [src\commands\orchestrator\assess.ts]https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/sampler/sampling.ts)_


<!-- commandsstop -->