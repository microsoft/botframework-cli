# Command Line Form Specifications

The following specification provides a one-stop global view of the command line form encompassing all CLI sub-components. This is used to ensure uniform & consistent patterns. For further CLI specifications, please refer to the following [Foundation Dev Spec](https://github.com/microsoft/botframework-cli/blob/master/specs/FoundationDevSpec.md).



# Released

| Command Group | Sub-Command(s)  | Options                                           | Description (summary)                                        |
| ------------- | --------------- | ------------------------------------------------- | ------------------------------------------------------------ |
|               | help \| version | --h, --help, -v, --version                        | Top container for all commands. Default options for usage and version info. Options are global. |
| **chatdown**  |                 | (-h, --help, -v, --versions are always available) | Converts chat dialog files in <filename>.chat format into transcript file. |
|               |                 | -c, --chat                                        | The path of the chat file to be parsed.                      |
|               |                 | -f, --folder                                      | Path to directory and/or all subdirectories containing input chat files |
|               |                 | -o, --out_folder                                  | Path to the directory of output multiple chat files          |
|               |                 | -p, --prefix                                      | Prefix stdout with package name                              |
|               |                 | -s, --static                                      | Use static timestamps when generating timestamps             |
|               |                 |                                                   |                                                              |
|               |                 |                                                   |                                                              |



# Planned

| Command Group | Sub-Command(s)                          | Options                                           | Description (summary)                                        | Comments                                                     |
| ------------- | --------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **qnamaker**  |                                         | (-h, --help, -v, --versions are always available) | Manages QnaMaker service resources (data and control planes). |                                                              |
|               |                                         | -s, --subscriptionKey <key>                       | Cognitive Services subscription key                          |                                                              |
|               |                                         | -h,  --hostname <url>                             | Url for your private QnA service                             |                                                              |
|               |                                         | -e,  --endpointKey <key>                          | Endpoint key for private QnA service                         |                                                              |
|               |                                         | -k,  --kbId <kbid>                                | Active qnamaker knowledgebase id                             |                                                              |
|               | **create**                              | (command group params)                            | Creates QnAMaker knowledgebase                               |                                                              |
|               |                                         | -i, --in                                          | .json file with KB content                                   |                                                              |
|               |                                         | -n, --name                                        | KB name                                                      |                                                              |
|               |                                         | -w, --wait                                        | sync op. wait for completion                                 |                                                              |
|               | **delete**                              | (command group params)                            | Delete a knowledgebase                                       |                                                              |
|               |                                         |                                                   |                                                              |                                                              |
|               | **export**                              | (command group params)                            | Exports a kb to .json file                                   |                                                              |
|               |                                         | --environment                                     | Specifies Test or Prod environments                          |                                                              |
|               | Was: **~~get~~** Proposed: **metadata** | (command group params)                            | Get metadata about a knowledgebase                           | Name collision                                               |
|               | **metadata:kb**                         |                                                   | shows KB metadata information                                |                                                              |
|               | **metadata:operationdetails**           | --operationId                                     | shows metadata about running operation                       |                                                              |
|               | **init**                                | prompts for info                                  | stores prompted default configuration values (e.g. cognitive sub key) |                                                              |
|               | **list**                                | (command group params)                            | lists information about service                              |                                                              |
|               | **list:alterations**                    |                                                   | Downloads all word alterations (synonyms)                    |                                                              |
|               | **list:endpointKeys**                   |                                                   | lists all endpoint Keys                                      |                                                              |
|               | **list:kbs**                            |                                                   | lists all available KBs                                      |                                                              |
|               | **publish**                             | (command group params)                            | publishes specified KB                                       |                                                              |
|               | **~~query~~**  **question** <text>      | (command group params)                            | executes QnA query                                           | Deviated from original which has --question parameter. Renamed command |
|               | **refresh:endpointkeys**                | (command group params)                            | Re-generates an endpoint key                                 | Consider simplifying: RefreshEPK                             |
|               |                                         | --keyType                                         | type of key                                                  |                                                              |
|               | **set**                                 | (command group params)                            | sets default configuration params                            |                                                              |
|               | **set:kbid**                            |                                                   | sets kbId                                                    |                                                              |
|               | **set:subscriptionkey**                 |                                                   | sets cognitive service key                                   | Consider rename to CSK(?)                                    |
|               | **update**                              | (command group params)                            | add/del qna pairs/urls to existing KB                        |                                                              |
|               |                                         | --in <file>                                       | updated KB                                                   |                                                              |
|               | **replace**                             | (command group params)                            | replace KB                                                   |                                                              |
|               | **replace:kb**                          | --in <file>                                       | replaces KB with specified .json KB                          |                                                              |
|               | **replace:alterations**                 | --in <file>                                       | replaces KB with altered model                               |                                                              |

