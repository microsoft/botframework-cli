# Dialog Command Dev Spec One-Pager

## <span style="color:red"> *** DRAFT *** </span> 

## Summary
Dialog command manipulates Adaptive dialog files, primarily around merging and verifying integrity. 

## Requirements
### Prerequisites
* Foundation BF CLI
* Respect all global flags (--quite, --log, --help)
* Accepts input/output pipes
* Process folders

Temp: Based on original original dev readme ([temp original doc]( https://github.com/microsoft/botframework-cli/blob/master/packages/dialog/README.md)).

### Dependencies

BF Foundation is assumed to be ready.

Depends on Dialog / adaptive library.

### Use Cases
Here's a brief sample of usage cases:

     $ bf dialog
     $ bf dialog:merge ./dialogs/*
     $ bf dialog:verify
     $ bf dialog:merge -o app.schema


## Design Specifications
The command supports the adaptive dialog files in use by Composer and the rest of the adaptive dialog system. It merges disparate dialog files based on provided schema files into a single cohesive and self-referential file. Secondly, it supports validation pass to ensure the integrity of the merged file. 

The dialog command is based on the adaptive dialog library. 

## `bf dialog:merge [FILE]`

The bf dialog:merge creates a merged schema file which represents merging of all of the component schemas and the SDK schemas together into an application .schema file.

The file pattern can be an arbitrary GLOB patterns for finding .schema files (such as myfolder/**/*.schema), but the better way to use it is to invoke it in the folder that has a project in it (either .csproj or packages.json). In that case the project file will be analyzed for all dependent folders and .schema files will be merged to create the app.schema for the project.

## `bf dialog:verify [FILE]`

The dialog:verify command is used to validate that all of the .dialog file resources for a project are valid based on the applications app.schema file (see dialog:merge command).

If there are "lint" errors, the command will display detailed error information or return successful confirmation.

#### Glob Pattern

Wild card and recursive file pattern specifications do not follow common guidelines, instead, we're using the  [glob (programming)](https://en.wikipedia.org/wiki/Glob_(programming)) pattern. Note: this is an exceptional pattern to the standard  BF CLI. **TBD**: Can we avoid this exception and follow standard BF CLI patterns?

Otherwise, with exception of Glob file pattern, `bf dialg` respects all global flags based on [Contributing Guide](https://github.com/microsoft/botframework-cli/blob/master/CONTRIBUTING.md#general-guidelines) .


### Command Line Form

```
 $ bf
Operates on Adaptive Dialog assetts, merges, and verifies integrity of .dialog, and .schema files. 

$ bf dialog:merge <options> <FileSpec>	 
Creates a .schema file by merging component schemas and the SDK schemas 

Where  <options>:
  -o, --output=output  Specify output path and filename for merged schema. [default: app.schema] 
  -u, --update      Update and regenerates .schema file.

$ bf dialog:verify <options>  <FileSpec>	 
Verifies that all of the .dialog file resources are valid based on the application schema specifications
```
```
Where <options> include all global options (e.g. help, version)

Where FileSpec: 
     GLOB1 [GLOB2] [GLOB3] [GLOB4] [GLOB5] [GLOB6] [GLOB7] [GLOB8] [GLOB9] where GLOB is a glob pattern

```

## Special Considerations
<issues, exceptions, workarounds, assumptions, pre-conditions, up/downstream dependencies> 

## Issues
<while actual issues should be tracked github/issues initial placeholders may be placed here transiently for convenience.

  * Issue
  * Todo
  * ...

## References

\<any references of relevance\>
