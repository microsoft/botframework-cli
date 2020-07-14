# Daily Build Propsal for Botframework CLI

This proposal describes our plan to publish daily builds for consumption. The goals of this are:
1. Make it easy for developers (1P and 3P) to consume our daily builds. 
2. Exercise our release to NPM process frequently, so issues don't arise at critical times. 
3. Meet Developers where they are.

Use the [Typescript Team](https://www.npmjs.com/package/typescript) as inspiration, and draft off the work they do. 

# Versioning

The versioning will be as follow:
* -dev.<7-digit-commit-SHA>
* -rc.{Number}

# Daily Builds
Copying what the typescript team does, all our NPM packages would be pushed with the next tag to NPM on a daily basis at 12am . 
(Build)[https://github.com/microsoft/botframework-cli/blob/master/build/botframework-cli-daily.yml] will be done from master. And triggered only once a day. (Release)[https://fuselabs.visualstudio.com/SDK_Public/_release?_a=releases&view=mine&definitionId=7] will be triggered on every time a new build is available.

```
npm publish [<tarball>|<folder>] --tag next 
```

This means developers could install the cli by running

```
npm i -g @microsoft/botframework-cli@next
```

# RC Builds
Copying what the typescript team does, all our NPM packages would be pushed with the rc tag to NPM manually triggered. 
Build will be done from manually selected branch.
Release should be manually triggered with the selected build.

```
npm publish [<tarball>|<folder>] --tag rc 
```

This means developers could install the cli by running

```
npm i -g @microsoft/botframework-cli@rc
```

# Production Release
Once RC is stable the production release will switch the tag from rc to latest.
No new build is needed. Only re tagging latest RC.
Production build should be pointed to the latest stable RC, go through all the packages and re tag them to be latest.

```
npm dist-tag add <pkg>@<version> latest
```

This means developers could install the cli by running

```
npm i -g @microsoft/botframework-cli
```

# PR Builds
Build should be triggered on PR commits. No publish should be done.


# Migration from MyGet

1. Initially, our daily builds should go to both MyGet and NPM. 
2. Our docs are updated once builds are in both locations. 
3. Towards the end of 2020, we stop publising to MyGet.
