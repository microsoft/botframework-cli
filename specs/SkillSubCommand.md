# Skill Support

*--- DRAFT ---*

### Workspace

- Need to review proposal, see if command line args make sense.

- Review --fullEmbedding (why do we need it, etc).

- Considered using add command but I think it creates more confusion.


## Summary

The Skill Support shall be added to existing command/sub-command to facilitate retrieval of skill LU and integrate it into existing LU. Since skill routing LU is primarily a function of Orchestrator the functionality will be exposed within Orchestrator command. The underlying library may support other uses such as equivalent functionality within Composer.

## Requirements
### Prerequisites
* Accessible skill's manifest with dispatch section AND/OR
* Accessible referenced LU file from skill's manifest
* Local target LU to merge into (typically parent dialog's LU)
* Conform to CLI command line guidelines ([FoundationDevSpec](./FoundationDevSpec.md), [CLIOutputDesign](./CLIOutputDesign.md))

### Dependencies
BF CLI with Orchestrator command and supporting libraries.

### Use Cases
* Merge skill LU from manifest into target local LU, .blu snapshot file
* Merge skill LU without manifest into target local LU, snapshot .blu file
* Update local target LU, snapshot .blu file from skill LU (with or without manifest)
* Displays difference between skill LU and local parent LU
* Remove skill LU intents from local LU, snapshot .blu file

### Exceptions
<restrictions, constraints, other non-goals worth calling out>

## Design Specifications
Provided a skill's manifest and/or referenced LU merge the LU contents per manifest guidelines or in absence of a manifest from command line parameter input. If manifest is provided use configuration in manifest to merge corresponding LUs in manifest. If manifest is absent, use command line hints with acceptable defaults.

### Command Line Form

Using a new Orchestrator:skill subcommand we will management actions for skill LU (& .blu) at parent

### BF Orchestrator:skill:merge

Merges skill LU from manifest or .lu file into local parent .lu/.blu files. If target parent file exists & --force flag is specified this turns into an update command.

As an update command it updates local .lu/.blu with remote skill LU. No merging is performed under target labels, rather it is all or nothing, meaning all content from source skill's selected intents are updated & override corresponding intents within parent LU. 

If manifest is provided:

* Download manifest, keep as a reference in output path
* For each LU in dispatch section create corresponding LU/.blu files per parameter specifications
* If targets does not exist, just copy over skill's LU and prints corresponding message
* Use intent filters as specified in manifest


| Parameter        | Value                    | Description                                                  |
| ---------------- | ------------------------ | ------------------------------------------------------------ |
| --in             | \<manifest-url>, lu      | accept manifest or skill LU                                  |
| --labels         | \<intent-list>           | if manifest is absent filter desired labels to import. Default: * (all) |
| --outType        | \<lu, blu, all>          | output LU or snapshot file or both. Default: all             |
| --mergeLabel     | \<skill-name>, *         | if *, creates a label for each imported, otherwise group under provided skill-name label |
| --force          | ...                      | common override semantics. see update mode above.            |
| -d, --debug      | ...                      | same                                                         |
| -h, --help       | ...                      | same                                                         |
| -m, --model      | path to model            | same as :add                                                 |
| -o, --out        | path to generated folder | same as :add                                                 |
| --fullEmbeddings | ...                      | What is that? Why do we expose it, how would users know why to use this or not? |



### Orchestrator:skill:diff

The command shows all examples under provided intent labels that are present/not-present in the local parent LU. User may use this command to anticipate changes to parent LU.

| Parameter    | Value               | Description                                                  |
| ------------ | ------------------- | ------------------------------------------------------------ |
| --in         | \<manifest-url>, lu | accept manifest or skill LU                                  |
| --local      | \<.lu file>         | parent target .lu file to compare with (no comparison with snapshot) |
| --labels     | \<intent-list>      | if manifest is absent filter desired labels to import. Default: * (all) |
| --mergeLabel | \<skill-name>, *    | if *, creates a label for each imported, otherwise group under provided skill-name label |
| -d, --debug  | ...                 | same                                                         |
| -h, --help   | ...                 | same                                                         |
| -o, --out    | \<filename>         | output to this file instead of stdout                        |



### BF Orchestrator:skill:remove

The command removes all examples & intents in the local parent LU that are present in skill LU. If intent labels are specified on command line, all examples for those labels are removed. 

| Parameter    | Value               | Description                                                  |
| ------------ | ------------------- | ------------------------------------------------------------ |
| --in         | \<manifest-url>, lu | accept manifest or skill LU                                  |
| --local      | \<.lu file>         | parent target .lu file to compare with (no comparison with snapshot) |
| --labels     | \<intent-list>      | if manifest is absent filter desired labels to import. Default: * (all) |
| --mergeLabel | \<skill-name>, *    | if *, creates a label for each imported, otherwise group under provided skill-name label |
| -d, --debug  | ...                 | same                                                         |
| -h, --help   | ...                 | same                                                         |
| -o, --out    | \<filename>         | output to this file instead of overwriting parent LU file.   |





## Special Considerations
<issues, exceptions, workarounds, assumptions, pre-conditions, up/downstream dependencies> 

## Issues
<while actual issues should be tracked github/issues initial placeholders may be placed here transiently for convenience.

  * Issue
  * Todo
  * ...

## References

\<any references of relevance\>