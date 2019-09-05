# ChatDown Dev Spec One-Pager

## Summary
Converts chat dialog files in *.chat* format into transcript file. Writes corresponding *.transcript* for each .chat file.

## Requirements
### Prerequisites
* Foundation BF CLI
* Port 1-1 existing chatdown CLI with exceptions as specified below
* Respect all global flags (--quite, --log, --help etc)
* Accepts input/output pipes
* Process folders

### Dependencies

BF Foundation is assumed to be ready.

### Use Cases
Here's a brief sample of usage cases:

     $ bf chatdown
     $ bf chatdown --in=./path/to/file/sample.chat
     $ bf chatdown -i ./test/utils/*.sample.chat -o ./
     $ (echo user=Joe && [ConversationUpdate=MembersAdded=Joe]) | bf chatdown --stamp REL4.5:
### Exceptions
<restrictions, constraints, other non-goals worth calling out>

## Design Specifications
<brief description of the selected design choice, relevant details to how it satisfies the requirement>



### Command Line Form
\<Describe the command line form\>

USAGE
  $ bf chatdown

OPTIONS
  -i, --in [file|folder]	   The path of the chat file or folder of .chat files to be parsed.  Default: STDIN

 -o, --out [file|folder]	Output file or folder. Default: STDOUT

  -r, --recurs					If processing folder, will recurs down. Optional

  -h, --help                       This help

  -s, --stamp [value]       If value not specified, stamps the file with local time. Optional

​										 Stamp value may be any 32 length string ([a-zA-Z0-9\-_\.:])



#### Porting Map [If Applicable]

\<Describe mapping from old tool to new tool\>

**Command Group:** Chatdown

| Sub-Command | Options     | Old Command  | Comments                |
| ----------- | ----------- | ------------ | ----------------------- |
|             | -i, --in    | -c, --chat   |                         |
|             | -o, --out   | -f, --folder |                         |
|             | -s, --stamp | -s, --static |                         |
|             |             | -p, --prefix | global default behavior |

All standard BF commands are respected (e.g. -h, -?, --help, -v, --version, --quite, --log...)

## Special Considerations
<issues, exceptions, workarounds, assumptions, pre-conditions, up/downstream dependencies> 

## Issues
<while actual issues should be tracked github/issues initial placeholders may be placed here transiently for convenience.

  * Issue
  * Todo
  * ...

## References

\<any references of relevance\>