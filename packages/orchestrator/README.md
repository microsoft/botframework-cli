orchestrator
============

Bot Orchestrator

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/orchestrator.svg)](https://npmjs.org/package/orchestrator)
[![Downloads/week](https://img.shields.io/npm/dw/orchestrator.svg)](https://npmjs.org/package/orchestrator)
[![License](https://img.shields.io/npm/l/orchestrator.svg)](https://github.com/microsoft/botframework-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @microsoft/bf-orchestrator
$ oclif-example COMMAND
running command...
$ oclif-example (-v|--version|version)
@microsoft/bf-orchestrator/1.0.0 win32-x64 node-v12.16.1
$ oclif-example --help [COMMAND]
USAGE
  $ oclif-example COMMAND
...
```
<!-- usagestop -->
```sh-session
$ npm install -g orchestrator
$ oclif-example COMMAND
running command...
$ oclif-example (-v|--version|version)
orchestrator/1.0.0 win32-x64 node-v12.13.1
$ oclif-example --help [COMMAND]
USAGE
  $ oclif-example COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`oclif-example `](#oclif-example-)
* [`oclif-example create [FILE]`](#oclif-example-create-file)
* [`oclif-example evaluate [FILE]`](#oclif-example-evaluate-file)
* [`oclif-example orchestrator:create [FILE]`](#oclif-example-orchestratorcreate-file)
* [`oclif-example predict [FILE]`](#oclif-example-predict-file)
* [`oclif-example test [FILE]`](#oclif-example-test-file)

## `oclif-example `

Display Orchestrator CLI available commands

```
USAGE
  $ oclif-example

OPTIONS
  -h, --help  Orchestrator command help
```

_See code: [src\commands\index.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\index.ts)_

## `oclif-example create [FILE]`

Create orchestrator example file from .lu/.qna files to be used for bot runtime

```
USAGE
  $ oclif-example create [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src\commands\create.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\create.ts)_

## `oclif-example evaluate [FILE]`

Create orchestrator evaluation report from .lu/.qna files

```
USAGE
  $ oclif-example evaluate [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src\commands\evaluate.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\evaluate.ts)_

## `oclif-example orchestrator:create [FILE]`

describe the command here

```
USAGE
  $ oclif-example orchestrator:create [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src\commands\orchestrator\create.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\orchestrator\create.ts)_

## `oclif-example predict [FILE]`

Returns score of given utterance using previously created orchestrator examples

```
USAGE
  $ oclif-example predict [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src\commands\predict.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\predict.ts)_

## `oclif-example test [FILE]`

Run orchestrator test evaluation using given test file

```
USAGE
  $ oclif-example test [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src\commands\test.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\test.ts)_
<!-- commandsstop -->
* [`oclif-example evaluate [FILE]`](#oclif-example-evaluate-file)
* [`oclif-example generate [FILE]`](#oclif-example-generate-file)
* [`oclif-example hello [FILE]`](#oclif-example-hello-file)
* [`oclif-example predict [FILE]`](#oclif-example-predict-file)
* [`oclif-example test [FILE]`](#oclif-example-test-file)

## `oclif-example evaluate [FILE]`

describe the command here

```
USAGE
  $ oclif-example evaluate [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src\commands\evaluate.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\evaluate.ts)_

## `oclif-example generate [FILE]`

describe the command here

```
USAGE
  $ oclif-example generate [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src\commands\generate.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\generate.ts)_

## `oclif-example hello [FILE]`

describe the command here

```
USAGE
  $ oclif-example hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ oclif-example hello
  hello world from ./src/hello.ts!
```

_See code: [src\commands\hello.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\hello.ts)_

## `oclif-example predict [FILE]`

describe the command here

```
USAGE
  $ oclif-example predict [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src\commands\predict.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\predict.ts)_

## `oclif-example test [FILE]`

describe the command here

```
USAGE
  $ oclif-example test [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src\commands\test.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src\commands\test.ts)_
<!-- commandsstop -->
