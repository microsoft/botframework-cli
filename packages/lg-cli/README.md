# LG command group

We have a preview [MSLG][1] tool in botbuilder-tools repo. This specification brings that functionality into BF-CLI. 

## User scenarios 
1. I have one or more .lg files (or LG content). I need to parse and run validations on the content.
2. I have more than one .lg file (for organization purposes). I need to merge all the content into a single .lg file.
3. I have one or more .lg files. I need to machine translate the content to one or more languages.
4. I have one or more .lg files. I need to create all possible expansions of a given template or all templates. 

## Parent command group
```bash
> bf lg
```

## Commands and arguments

1. Parse and validate
```bash
> bf lg:verify
```
This command will output all validation errors found across all provided content. Optionally the user can persist the validation output to a file.

| Parameter                 | Description                                                                                  |
|---------------------------|----------------------------------------------------------------------------------------------|
| -i, --in <file or folder> | [Required] .lg file or folder that contains .lg file.                                        |
| -r, --recurse             | [Optional] Indicates if sub-folders need to be considered to file .lg file(s)                |
| -o, --out=out             | [Optional] Output file or folder name. If not specified stdout will be used as output        |
| -f, --force               | [Optional] If --out flag is provided with the path to an existing file, overwrites that file |

1. Translate
```bash
> bf lg:translate
```
Translate provided .lg content into one or more target languages.

| Parameter                   | Description                                                                                  |
|-----------------------------|----------------------------------------------------------------------------------------------|
| -i, --in <file or folder>   | [Required] .lg file or folder that contains .lg file.                                        |
| -r, --recurse               | [Optional] Indicates if sub-folders need to be considered to file .lg file(s)                |
| -o, --out=out               | [Optional] Output file or folder name. If not specified stdout will be used as output        |
| -f, --force                 | [Optional] If --out flag is provided with the path to an existing file, overwrites that file |
| --srclang=srclang           | [Optional] Source lang code. Auto detect if missing.                                         |
| --tgtlang=tgtlang           | [Required] Comma separated list of target languages.                                         |
| --translate_comments        | [Optional] When set, machine translate comments found in .lg file                            |
| --translate_link_text       | [Optional] When set, machine translate link description in .lg file                          |
| --translatekey=translatekey | [Required] Machine translation endpoint key. [Translator Text API][10]                       |

1. Expand
```bash
> bf lg:expand
```
Expand one or all templates in a .lg file or an inline expression.

| Parameter                 | Description                                                                                                                         |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| -i, --in <file or folder> | [Required] .lg file or folder that contains .lg file.                                                                               |
| -r, --recurse             | [Optional] Indicates if sub-folders need to be considered to file .lg file(s)                                                       |
| -o, --out=out             | [Optional] Output file or folder name. If not specified stdout will be used as output                                               |
| -f, --force               | [Optional] If --out flag is provided with the path to an existing file, overwrites that file                                        |
| --template=templateName   | [Optional] Name of the template to expand. Template names with spaces must be enclosed in quotes.                                   |
| --expression=expression   | [Optional] Inline expression provided as a string to evaluate.                                                                      |
| --all                     | [Optional] Flag option to request that all templates in the .lg file be expanded.                                                   |
| --interactive             | [Optional] Flag option to request that all missing entity value references be obtained through interactive prompts. Default (false) |
| --testInput=testJSONfile  | [Optional] full or relative path to a JSON file containing test input for all variable references.                                  |

[1]:https://github.com/microsoft/botbuilder-tools/tree/V.Future/packages/MSLG
[10]:https://azure.microsoft.com/en-us/services/cognitive-services/translator-text-api/