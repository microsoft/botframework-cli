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

| New Command                   | Old Tool(s) | Status  |
| ----------------------------- | ----------- | ------- |
| Chatdown                      | Chatdown    | Preview |
| QnAMaker                      | QnAMaker    | Preview |
| luis:convert, luis:translate  | LuDown      | Preview |
| luis:convert                  | LuisGen     | Preview |
| LUIS                          | LUIS (api)  | TBD     |
| LG                            | MSLG        | TBD     |
| Dispatch                      | Dispatch    | TBD     |
| Dialog                        | \<new\>     | TBD     |





## See Also

* [BF CLI](https://github.com/microsoft/botframework-cli) main page