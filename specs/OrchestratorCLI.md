## 										*--DRAFT--*



# Orchestrator CLI Spec



## Summary

Orchestrator command shall enable Bot Framework developer to add language understanding functionality based on Orchestrator [1] technology to their bots. 

There are two development workflows that shall be considered:

1. Mainstream bot development workflow as the primary workflow
2. Advanced language performance optimization cycle



## Requirements
### General and Common

Use the following common guidelines for all commands (unless explicitly excluded).

- All commands return:
  - Success or Error status
  - Error code and message if available
- Upon successful completion:
  - Print back affected values (if too long, specify container e.g. filename or use ellipsis ...)
  - Server detailed response (e.g. training status)
- All commands must display synopsis with example in help
- All commands must print which flags/arguments are optional, mandatory and default values
- All lengthy operations (> 5 seconds) shall print progress indicator (dots at 5 sec interval)
- All flags assume to be provided value pair (e.g. -o, --out expects -o, --out <filename>)
- All flags that are marked `mandatory default to...` are mandatory *unless* specified in config in which case they default to provided values in config file
- Use *camelCase* for all parameters

### Prerequisites
* BF CLI environment (OCliff etc)
* Access to downloadable models 

### Use Cases

Initially, Orchestrator is designed as a LUIS alternative for *Dispatch Scenario*, i.e. for mapping utterances to intents only. Entity recognition is on the roadmap as a future capability.

#### Primary

The mainstream bot language recognition development cycles with Orchestrator is assumed to be as follows 

1. Create Intent-utterances example based .lu definition referred to as *label file* using the Language Understanding practices as described in Language Understanding [2] for dispatch (e.g. in a .lu file or within the Composer [3].
2. Download Natural Language Representation Base Model (will be referred to as the *basemodel*).
3. Combine the label file .lu from (1) with the base nlr model from (2) to create a *snapshot* file with a .blu extension.
4. Create another test .lu file similar to (1) with utterances that are similar but are not identical to the ones specified in the example based .lu definition in (1).
5. Test quality of utterance to intent recognition
6. Examine report to ensure that the recognition quality is satisfactory. For more on report interpretation see **TBD**.
7. If not, adjust the label file in (1) and repeat steps 2-6 until satisfied.

#### Variation: Composer Dialogs 

If designing a Composer or Adaptive based multi folder, multi-dialog bot that requires processing across directories and generation of corresponding .dialog files use the *build* command. 

The *build* command does... **TBD**

#### Advanced

The advanced language recognition development cycle assumes some level understand of machine learning concepts and interactive iterations over the language example definition and potentially evaluation of different models.

For the advanced scenario please refer to the following documentation **TBD**



## Design Specifications

<brief description of the selected design choice, relevant details to how it satisfies the requirement>

*At minimum describe the command line form*

### Command Line Form
At the root *bf orchestrator* shall print synopsis, and brief description of each sub-command. Similarly each sub-command --help command shall print additional usage details.



| Sub-Command | Options                                                      | Comments                                                     |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| basemodel   | :get <br />:list                                             | Downloads the default, generally optimal base model, the Natural Language Representation (nlr) as basis for creating the snapshot file. see [4] for more on *nlr*<br />Other models may work better in some scenarios, and there are tradeoffs of performance; speed, memory usage. One may experiment by using different models. It is however recommended to get familiar with advanced usage (**TBD** see advanced command)<br />To see the list of available models use the list command. |
| create      | -i --in  \<label file><br />--m --model \<path><br />-o --out \<path><br />--hierarchical **TBD:necessary for R11?**<br /> | Creates Orchestrator snapshot .blu file from .lu/.qna files  |
| test        | -a, --ambiguous=ambiguous            Ambiguous threshold, default to 0.2<br/>  -i, --in=in                          Path to a previously created snapshot file<br/>  -l, --low_confidence=low_confidence  Low confidence threshold, default to 0.5<br/>  -m, --model=model                    Directory or hosting Orchestrator config and model files.<br/>  -o, --out=out                        Directory where analysis and output files will be placed.<br/>  -p, --multi_label=multi_label        Plural/multi-label prediction threshold, default to 1<br/>  -t, --test=test                      Path to a test file.<br/>  -u, --unknown=unknown                Unknow label threshold, default to 0.3<br />-t, --prediction=prediction | Run tests on label, and model files. <br /><br />**TBD: How** we distinguish evaluate/assess/test, with mode flag or implicit with explanation? e.g.if test file not specified, run in assessment mode. Add See Also: explain, add link to detailed discussion... |
| build       | -i, --in=in          Path to lu file or folder with lu files.<br/>  -m, --model=model    Path to Orchestrator model.<br/><br/>  -o, --out=out        Path where Orchestrator snapshot/dialog file(s) will be placed. Default to current working<br/>                       directory.<br/><br/>  --dialog             Generate multi language or cross train Orchestrator recognizers.<br/><br/>  --luconfig=luconfig  Path to luconfig.json. | **TBD: Explain build command**                               |
| interactive | Enter **advanced** interactive mode                          | See full reference here **TBD**                              |
| query       | --phrase \<phrase><br />--model \<snapshot file>             | Queries a snapshot .blu file for given phrase to find corresponding label. |

*standard global commands such as --help & --force are assumed





#### Porting Map [If Applicable]



Dispatch CLI is a predecessor to Orchestrator dispatch functionality in concept.

**TBD** Need to try to map either concepts or commands to older tool

**Command Group:** Orchestrator

| Sub-Command | Options | Old Command | Comments |
| ----------- | ------- | ----------- | -------- |
|             |         |             |          |
|             |         |             |          |



## Special Considerations
Orchestrator command group is starting as a plugin while in preview and will eventually be promoted to a command group parallel to luis, and qnamaker. It will evolve to include additional nlr base models, and differently from the mentioned LU services it is a local implementation with no service functionality behind. As such it is likely that some advanced tuning capability will be required in order to exploit the full power. In that case, users will be required to possess more advanced knowledge of machine learning and model optimization as well as be more comfortable with the advanced functionality described above. 



## Issues
<while actual issues should be tracked github/issues initial placeholders may be placed here transiently for convenience.

  * Fix TBD and additional references
  * ...

## References

\<any references of relevance\>

[Orchestrator]: https://aka.ms/bf-orchestrator	"Orchestrator"
[Language Understanding]: https://docs.microsoft.com/en-us/composer/concept-language-understanding "Language Understanding"
[Composer]: https://docs.microsoft.com/en-us/composer/introduction "Composer"

[Natural Language Representation Models]: ./nlrmodels.md "Natural Language Representation Models"



[1]: https://aka.ms/bf-orchestrator	"Orchestrator"
[2]: https://docs.microsoft.com/en-us/composer/concept-language-understanding "Language Understanding"
[3]: https://docs.microsoft.com/en-us/composer/introduction "Composer"

[4]: ./nlrmodels.md "Natural Language Representation Models"



