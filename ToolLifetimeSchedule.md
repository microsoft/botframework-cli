# Tool Lifetime Support Policy

Every Microsoft product has a lifecycle. The lifecycle begins when a product is released and ends when it's no longer supported. Knowing key dates in this lifecycle helps you make informed decisions about when to upgrade or make other changes to your software. This product is governed by Microsoft's [Modern Lifecycle Policy](https://support.microsoft.com/en-us/help/30881/modern-lifecycle-policy).

## What releases qualify for servicing and how do updates effect servicing qualifications?
Customers can choose Long Term Support (LTS) releases or Current releases. LTS releases will receive only critical and compatible fixes throughout their lifecycle. Current releases will receive these same fixes and will also be updated with compatible innovations and features.

Within a release's support lifecycle, systems must remain current on released patch updates.

## Release Schedule 

| **Tool**   | **Current Version** | **Current Status\*** | **Next Status\*** | **Current to Next Date** |
| ---------- | ------------------- | -------------------- | ----------------- | ------------------------ |
| Chatdown   | 1.2.4               | LTS                  | EOL               | June 1, 2020             |
| LuDown     | 1.4.0               | LTS                  | EOL               | June 1, 2020             |
| LuisGen    | 2.2.1               | LTS                  | EOL               | June 1, 2020             |
| QnAMaker   | 1.2.3               | LTS                  | EOL               | June 1, 2020             |
| LUIS (API) | 2.6.2               | LTS                  | EOL               | June 1, 2020             |
| BF         | 4.6.0               | Current              | --                | --                       |
|            |                     |                      |                   |                          |
*See Support Status section below

## Support Status 

### EOL: End of Life

- No more fixes of any kind. 
- Product is no longer supported.
- Download links may be removed.
- Repository will remain in Read-Only mode for reference (but could be removed eventually).
- Issues cannot be filed any longer
- Exception: Critical security fixes may be applied in discretionary manner.

### LTS: Long Term Support

- Support is restricted to critical security fixes.
- Microsoft may elect to fix specific singular issues to facilitate transition to EOL Status.
- Repository will be locked down to Microsoft critical fixes only.
- Issues can be filed and will be evaluated per above criteria.

### Current: Latest stable release

- All feature work and bug fixes will be applied to this version.
- Minor versions will be applied aligned to SDK release schedule.
- Repository is opened for normal OSS work
- Issues are accepted

### Preview: Future Release

- Work under active development including latest features, some of which are experimental.
- Final release will typically transition to Current.
- Repository may be restricted.
- Issues are accepted

## How do the different support tracks work?
Customers choosing LTS will need the latest patch update installed to qualify for support. If a system is running 1.0 and 1.0.1 has been released, 1.0.1 will need to be installed as a first step. Once a patch update has been installed applications will begin using the update by default. LTS releases will be supported for 2-years after general availability, or for a 12 month Maintenance period after the next LTS release ships, whichever is longer.

In addition to staying current with the latest patch update, customers using Current will need to update as new minor versions are released to stay in support. The latest released minor version will become the minimum serviceable baseline after release. After a 3 month Maintenance period, the previous minor version will no longer be supported. For example, after 1.2 releases systems running version 1.1 will have 3 months to update to 1.2 to remain eligible for support. Applications do not automatically begin using the new minor update.
