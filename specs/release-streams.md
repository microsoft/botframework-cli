# Daily Build Propsal for Botframework CLI

This proposal describes our plan to publish daily builds for consumption. The goals of this are:
1. Make it easy for developers (1P and 3P) to consume our daily builds. 
2. Exercise our release to NPM process frequently, so issues don't arise at critical times. 
3. Meet Developers where they are.

Use the [Typescript Team](https://www.npmjs.com/package/typescript) as inspiration, and draft off the work they do. 

# Versioning

The tags we use for preview versions are:
* -preview.<yyyymmdd>
* -rc.{0}

Note: use of "." rather than "-" to follow semver2 sorting rules. 

# Daily Builds
Copying what the typescript team does, all our NPM packages would be pushed with the next tag to NPM on a daily basis at 2am . 
Build will be done from master. And triggered only once a day

This means developers could install the cli by running

```
npm i -g @microsoft/botframework-cli@next
```

# RC Builds
Copying what the typescript team does, all our NPM packages would be pushed with the rc tag to NPM manually triggered. 
Build will be done from manually selected branch.
Build should be the exact same as daily but with different triggers.

This means developers could install the cli by running

```
npm i -g @microsoft/botframework-cli@rc
```

# Production Release
Once RC is stable the production release will switch the tag from rc to latest.
No new build is needed. Only re tagging latest RC

This means developers could install the cli by running

```
npm i -g @microsoft/botframework-cli
```

# PR Builds
Build should be the exact same as daily triggered on PR commits. No publish should be done.


# Migration from MyGet

1. Initially, our daily builds should go to both MyGet and Azure Devops. 
2. Our docs are updated once builds are in both locations. 
3. Towards the end of 2020, we stop publising to MyGet.
