@microsoft/bf-luis-cli
======================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-luis-cli.svg)](https://npmjs.org/package/@microsoft/bf-luis-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@microsoft/bf-luis-cli.svg)](https://npmjs.org/package/@microsoft/bf-luis-cli)
[![License](https://img.shields.io/npm/l/@microsoft/bf-luis-cli.svg)](https://github.com/packages/bf-luis-cli/blob/master/package.json)

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
$ npm install -g @microsoft/bf-luis-cli
$ bf COMMAND
running command...
$ bf (-v|--version|version)
@microsoft/bf-luis-cli/0.0.0 win32-x64 node-v10.16.3
$ bf --help [COMMAND]
USAGE
  $ bf COMMAND
...
```
<!-- usagestop -->
```sh-session
$ npm install -g @microsoft/bf-luis-cli
$ oclif-example COMMAND
running command...
$ oclif-example (-v|--version|version)
@microsoft/bf-luis-cli/0.0.0 win32-x64 node-v10.16.3
$ oclif-example --help [COMMAND]
USAGE
  $ oclif-example COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bf luis:version:clone`](#bf-luisversionclone)

## `bf luis:version:clone`

Creates a new version equivalent to the current snapshot of the selected application version.

```
USAGE
  $ bf luis:version:clone

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      LUIS application Id
  --endpoint=endpoint                LUIS endpoint hostname
  --subscriptionKey=subscriptionKey  LUIS cognitive services subscription key (aka Ocp-Apim-Subscription-Key)
  --targetVersionId=targetVersionId  LUIS target version Id
  --versionId=versionId              LUIS version Id

EXAMPLE

       $ bf luis:version:clone --appId {APP_ID} --versionId {VERSION_ID} --targetVersionId {TARGET_VERSION_ID} 
  --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
```

_See code: [src\commands\luis\version\clone.ts](https://github.com/packages/bf-luis-cli/blob/v0.0.0/src\commands\luis\version\clone.ts)_
<!-- commandsstop -->
* [`oclif-example luis:version:clone [FILE]`](#oclif-example-luisversionclone-file)

## `oclif-example luis:version:clone [FILE]`

Creates a new version equivalent to the current snapshot of the selected application version.

```
USAGE
  $ bf luis:version:clone --appId {APP_ID} --versionId {VERSION_ID} --targetVersionId {TARGET_VERSION_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}

OPTIONS
  -h, --help          show CLI help
  --appId             LUIS application Id
  --versionId         LUIS version Id
  --targetVersionId   LUIS target version Id
  --endpoint          LUIS endpoint hostname
  --subscriptionKey   LUIS cognitive services subscription key (aka Ocp-Apim-Subscription-Key)
```

_See code: [src\commands\luis\version\clone.ts](https://github.com/packages/bf-luis-cli/blob/v0.0.0/src\commands\luis\version\clone.ts)_
<!-- commandsstop -->
