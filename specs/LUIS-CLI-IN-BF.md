# BF CLI, LUIS command group

[LUIS CLI][1] today supports all commands available through the [authoring][2] and [endpoint][3] APIs of the [LUIS cognitive service][4].

This however is unnecessary since the authoring APIs are targeted at applications that cover the entire spectrum of authoring capabilities which is not the goal of a CLI tool. 

This document analyzes the LUIS REST API surface and makes a recommendation on specific APIs that will be exposed through the BF CLI tool, specifically under the LUIS command group.

## Goals/ non-goals

LUIS cognitive service covers a wide surface area via the authoring API. This is necessary since the luis portal itself is built using the authoring API. However a bunch of this is irrelevant for a CLI tool since the CLI tool is not aimed at replacing a full blown authoring experience. This section lists core goals and non goals for the BF CLI tool, specifically the LUIS command group in it.  

### Goals
- Application level CRUD operations
- Application level CRUD operation for resources (keys, user accounts)
- Version level CRUD operations
- Version level CRUD operations for resources (keys, user accounts)
- Train, publish & Query an application version
- List resources - applications, versions, keys

### Non-goals
- Author an application - intents, entities, phrase lists, patterns, features, ... 
    - These will be authored using the .lu file format

## Command groups, APIs

**P0 list (MUST HAVE)**

**Spec Redirect:** Refer to [LUIS-CLI-Usage-Spec.md](./LUIS-CLI-Usage-Spec.md) for authoritative command line form, parameter, usage, and descriptions.



| Functionality                                                     | API group           | API name                         | BF command group            |
|-------------------------------------------------------------------|---------------------|----------------------------------|-----------------------------|
| Version: Clone a version tied to an application                   | Authoring/ Versions | [Clone version][8]               | BF luis:clone:version       |
| Application: Create an empty LUIS application                     | Authoring/ Apps     | [Add application][5]             | BF luis:create:application  |
| Application: Delete an application                                | Authoring/ Apps     | [Delete application][14]         | BF luis:delete:application  |
| Version: Delete a version tied to an application                  | Authoring/ Versions | [Delete version][10]             | BF luis:delete:version      |
| Version: Export application version                               | Authoring/ versions | [Export application version][48] | BF luis:export:version      |
| Application: Import a new application                             | Authoring/ Apps     | [Import application][6]          | BF luis:import:application  |
| Version: Import a version tied to an application                  | Authoring/ Versions | [Import version][7]              | BF luis:import:version      |
| Application: List LUIS applications                               | Authoring/ Apps     | [List applications][16]          | BF luis:list:application    |
| Application: Get endpoints                                        | Authoring/ Apps     | [Get application endpoints][21]  | BF luis:list:endpoints      |
| Version: List versions tied to a specific application             | Authoring/ Versions | [List versions][17]              | BF luis:list:version        |
| Version: Publish a version tied to an application                 | Authoring/ Apps     | [Publish application][13]        | BF luis:publish:version     |
| Application: Rename application                                   | Authoring/ Apps     | [Rename application][29]         | BF luis:rename:application  |
| Version: Rename a version tied to an application                  | Authoring/ Versions | [Rename version][9]              | BF luis:rename:version      |
| Application: Get application information                          | Authoring/ Apps     | [Get application info][20]       | BF luis:show:application    |
| Version: Get training status for a version tied to an application | Application/ Train  | [Training status][12]            | BF luis:show:trainingstatus |
| Version: Train a version tied to an application                   | Authoring/ Train    | [Train version][11]              | BF luis:train:version       |
| Version: Query endpoint API for a specific application version    | Endpoint/ Predict   | [Query application][15]          | BF luis:query:application   |

**P1 list (NICE TO HAVE)**

| Functionality                                                  | API group           | API name                                  | BF command group                                     |
|----------------------------------------------------------------|---------------------|-------------------------------------------|------------------------------------------------------|
| Application: Remove Azure account from an application          | Authoring/ Apps     | [Remove azure account][28]                | BF luis:delete:azureAccount                          |
| Application: Delete subscription key                           | Authoring/ user     | [Delete subscription key][41]             | BF luis:delete:key --type subscription               |
| Application: Package published application as GZip             | Authoring/ Apps     | [Package as GZip][26]                     | BF luis:export:published --type published            |
| Application: Package trained application as GZip               | Authoring/ Apps     | [Package as GZip][27]                     | BF luis:export:application --type trained            |
| Application: Get Azure accounts tied to an application         | Authoring/ Apps     | [Get Azure accounts][22]                  | BF luis:list:azureAccount                            |
| Application: Get query logs for an application                 | Authoring/ Apps     | [Get query logs][19]                      | BF luis:list:querylogs                               |
| Application: Start async download of query logs                | Authoring/ Apps     | [Start async download query logs][30]     | BF luis:list:initquerylogsasync                      |
| Application: Get asynchronously loaded query logs              | Authoring/ Apps     | [Get query logs async][24]                | BF luis:list:getquerylogsasync                       |
| Application: Move app to another LUIS authoring Azure resource | Authoring/ Apps     | [Move app to another Azure resource][25]  | BF luis:move:application                             |
| Application: Assign an Azure account to the application        | Authoring/ Apps     | [Assign Azure accounts][18]               | BF luis:set:azureAccount                             |
| Application: Add subscription key                              | Authoring/ user     | [Add subscription key][39]                | BF luis:set:key --type subscription                  |
| Version: Assign subscription key to version                    | Authoring/ versions | [Assign subscription key to version][46]  | BF luis:set:key --type subscription --versionId 0.1  |
| Application: Get publish settings                              | Authoring/ Apps     | [Get publish settings][23]                | BF luis:show:publishsettings                         |
| Application: Get LUIS azure accounts                           | Authoring/ user     | [Get LUIS Azure accounts][42]             | BF luis:show:azureAccount                            |
| Application: Get subscription keys                             | Authoring/ user     | [Get subscription keys][44]               | BF luis:show:key --type subscription                 |
| Version: Get application version subscription key              | Authoring/ versions | [Get version subscription key][52]        | BF luis:show:key --type subscription --versionId 0.1 |
| Version: Get application version information                   | Authoring/ versions | [Get application version info][49]        | BF luis:show:version                                 |
| Version: Get version settings                                  | Authoring/ versions | [Get version settings][51]                | BF luis:show:versionsettings                         |
| Application: Update application information                    | Authoring/ Apps     | [Update application info][31]             | BF luis:update:application                           |
| Application: Update publish settings                           | Authoring/ Apps     | [Update publish settings][32]             | BF luis:update:publishsettings                       |
| Version: Update application version settings                   | Authoring/ versions | [Update application version settings][54] | BF luis:update:version                               |

**Explicitly excluded**

| Functionality                                            | API group                                                                                                             |
|----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| Add prebuilt application                                 | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/59104e515aca2f0b48c76be5 |
| Get application settings                                 | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/58aef9fb39e2bb03dcd5909d |
| Get LUIS application cultures list                       | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c35 |
| Get LUIS application domains list                        | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c33 |
| Get LUIS tokenizer version for culture                   | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5c56cfc9cf9c9235b4fc8c04 |
| Get LUIS application usage scenarios list                | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c34 |
| Get custom prebuilt domains per culture                  | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/59104d855aca2f0b48c76be4 |
| Get all LUIS prebuilt domains                            | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/59104cec5aca2f0b48c76be3 |
| Get personal assistant applications                      | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c32 |
| Add label to an utterance                                | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c08 |
| Batch add labels                                         | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c09 |
| Delete example labels                                    | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0b |
| Review labelled examples                                 | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0a |
| Create a pattern feature                                 | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9bfd |
| Create a phrase list feature                             | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9bff |
| Delete a pattern feature                                 | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c04 |
| Delete a phrase list feature                             | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c07 |
| Get pattern feature info                                 | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c02 |
| Get phrase list feature info                             | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c05 |
| Get version features                                     | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c01 |
| Get version pattern feature list                         | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9bfe |
| Get version phrase list feature list                     | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c00 |
| Update pattern feature                                   | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c03 |
| Update phrase list feature                               | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c06 |
| **All model operations**                                 | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5ade0d69d5b81c209ce2e59b |
| **All pattern operations**                               | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5adf41e9d5b81c09bc0db021 |
| Rename subscription key                                  | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/58b6f1a639e2bb139ce823c8 |
| Delete unlabeled utterance                               | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/58b6f32139e2bb139ce823c9 |
| CUT - Application: Remove user from access list          | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/58fcce195aca2f08a4104343 |
| CUT - Application: Delete external API key               | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c4d |
| CUT - Version: Delete application version external key   | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c44 |
| CUT - Application: Reset programmatic key                | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c4b |
| CUT - Application: Add email to access list              | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/58fcccdd5aca2f08a4104342 |
| CUT - Application: Add external API key                  | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c49 |
| CUT - Version: Update application version external key   | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c43 |
| CUT - Application: Get user access list                  | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/58fccccd5aca2f08a4104341 |
| CUT - Application: Get external API keys                 | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c4a |
| CUT - Version: Get application version external API keys | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/589228f639e2bb0d9c2805f6 |
| CUT - Application: Update user access list               | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/58fcce825aca2f08a4104344 |
| N/A - Version: Review example utterances                 | https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0a |

[1]:https://github.com/microsoft/botbuilder-tools/tree/master/packages/LUIS
[2]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2f
[3]:https://westus.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee78
[4]:https://docs.microsoft.com/en-us/azure/cognitive-services/luis/what-is-luis
[5]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2f
[6]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c31
[7]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5892283039e2bb0d9c2805f5
[8]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c3a
[9]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c3e
[10]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c3f
[11]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c45
[12]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c46
[13]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c3b
[14]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c39
[15]:https://westus.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee78
[16]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c30
[17]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c3c
[18]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5be32228e8473de116325515
[19]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c36
[20]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c37
[21]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/58aef9fb39e2bb03dcd5909d
[22]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5be32028a1d48f88cfd57e20
[23]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5ae3212ed5b81c02cc64c6d2
[24]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5ae02f7ed5b81c092c6cf2c3
[25]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/apps-move-app-to-another-luis-authoring-azure-resource
[26]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/apps-packagepublishedapplicationasgzip
[27]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/apps-packagetrainedapplicationasgzip
[28]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5be32554f8591db3a86232e1
[29]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c38
[30]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5ae02c03d5b81c092c6cf2c2
[31]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/58aeface39e2bb03dcd5909e
[32]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5ae32174d5b81c02cc64c6d3






[39]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c47

[41]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c4c
[42]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5be313cec181ae720aa2b26c

[44]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c48

[46]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c42

[48]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c40
[49]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c3d

[51]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/versions-get-application-version-settings
[52]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c41

[54]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/versions-update-application-version-settings