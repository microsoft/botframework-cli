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

# Commands
<!-- commands -->
* [`bf luis:version:clone`](#bf-luisversionclone)

## `bf luis:version:clone`

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

_See code: [src\commands\luis\version\clone.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/version/clone/index.ts)_
<!-- commandsstop -->
