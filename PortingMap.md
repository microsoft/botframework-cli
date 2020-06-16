# Notice of new Bot Framework (BF) CLI

The Bot Framework team has been working on consolidating the command line interface toolset for managing bots. The new tool, BF provides a one-stop tool that embeds the functionality of the old tools collection. 

The new tool is designed based on JavaScript [OClif Framework](https://github.com/oclif/oclif). 

The principles guiding the tool include:

* Unified and consistent user interface across all command groups
* Common utilities library
* Instrumentation to collect anonymous usage statistics to help prioritize investment areas (Optional user Opt-in, disabled by default)
* High quality bar in all releases by embedded testing in nightly builds
* Extensible plug-in architecture for future tools


## Tool Command Map

Commands invoked by BF [New Command] as follows:


| New Command                                    | Old Tool(s) | Release Date   | Status |
| ---------------------------------------------- | ----------- | ---------- | ------ |
| chatdown                                       | Chatdown    | 10/30/19   | GA     |
| qnamaker                                       | QnAMaker    | 10/30/19   | GA     |
| luis/qnamaker:convert, luis/qnamaker:translate | LuDown      | 10/30/19   | GA     |
| luis:generate                                  | LuisGen     | 10/30/19   | GA     |
| luis:application, endpoints, train, version    | LUIS (api)  | 12/18/19   | GA     |
| luis:build                                     | N/A         | 3/16/20 | GA    |
| lg                                             | MSLG        | 5/19/20 | GA    |
| dialog                                         | N/A         | 5/19/20 | GA    |
| \<In Design>                                   | Dispatch    | TBD | TBD    |


## Deprecation Schedule

Legacy tools shall be maintained for an extended period past the deprecation message in the tool, typically spanning 2 release cycles in order to support easy transition to the new _bf cli_. 

See [Tool Lifetime Support Policy](./ToolLifetimeSchedule.md) for detailed timeline.

## See Also

* [BF CLI](https://github.com/microsoft/botframework-cli) main page
* [Tool Lifetime Support Policy](./ToolLifetimeSchedule.md)
