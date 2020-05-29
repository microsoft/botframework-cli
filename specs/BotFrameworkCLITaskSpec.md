# Bot Framework CLI Task Dev Spec One-Pager

## Summary

The task wraps some of the [BF CLI](https://docs.microsoft.com/en-us/azure/bot-service/bf-cli-overview?view=azure-bot-service-4.0) commands used to manage bots related services.

It includes the commands of the following tools:
- [LUIS](https://github.com/microsoft/botframework-cli/tree/master/packages/luis)
- [QnA Maker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker)
- [Dispatcher (upcomming)](https://github.com/microsoft/botframework-cli/tree/master/packages/dispatcher)

The goal is to provide a simpler and intuitive way to execute these commands in a pipeline improving the user experience.


## Requirements

#### Azure Subscription

To execute the different commands, an Azure subscription has to be linked to Team Foundation Server or to Azure Pipelines using the Services tab in the Account Administration section.

### Prerequisites

- For running LUIS commands, a LUIS Cognitive Service is needed.
- For running QnA commands, a QnA Maker Cognitive Service is needed.

### Use Cases

These are some of the possible use cases:

- The creation, publishing, and training of a LUIS application.
- The import of a LUIS application from a JSON file.
- The convertion of a .lu file to a LUIS JSON Model.
- The translation of LUIS utterances to different languages.
- The deletion of a LUIS application or application version.
- The creation, population, publishing, and training of a QnA Knowledge Base.
- The convertion of .qna files to JSON models.
- The translation of a QnA application Model to different languages.
- Testing queries in a QnA Knowledge Base.

## Design Specifications

The UI of the task keeps consistency with the Azure Pipeline Tasks style. Also maintains most of their input's names.

### Parameters of the task

The parameters listed with a * are required for the task:

- **Azure Subscription***: The service connection name linked with the Azure Subscription where the resources will be created.

- **Command selection***: The command to be executed. It could be LUIS or QnA Maker.

- **Sub-Command***: A dropdown list with the available subcommands for the command previously selected.

- **Subscription Key***: The subscription key of the LUIS or the QnA Service.

After selecting the command and sub-command, the task will display different input fields according to the arguments needed for each sub-command. 
For example, for the command _LUIS_ and sub-command _Application Create_, the task will display:

- **Application Name***: The name for the application that will be created.

- **Endpoint***: The enpoint hostname from the LUIS Service.

- **Culture**: The culture for the luis application. The default value is 'en-us'.

- **Version Id***: The id of the version for the LUIS application.

- **Description**: The description for the LUIS application.

## Usage and installation

**Installing**

- Install the task from [Azure DevOps Marketplace](https://marketplace.visualstudio.com/items?itemName=Southworks-Pipelines-Test.bf-cli-task).

- Select the organization where the task will be installed and click the _Install_ button. 

- Then click the **Proceed to organization** button.

**Running**

- In Azure DevOps go to your pipeline or create a new one.
- Adding a new task, search for **Bot Framework**.

- Fill in the [parameters](#parameters-of-the-task).
- Run the pipeline. The step will display output in the console at the DevOps job view.
- Once the step ran you should see the indicator of the step having run successfully or not.

## Available Commands

The LUIS available commands are:
- **Application Create**: Creates a LUIS application.
- **Build**: Builds .lu files to train and publish LUIS applications.
- **Train**: Issues asynchronous training request for a LUIS application.
- **Publish**: Publishes an application's version.
- **Application Delete**: Deletes a LUIS application.
- **Application Import**: Imports a LUIS application from JSON or .lu content.
- **Aplication Rename**: Renames a LUIS application and updates its description.
- **Convert**: Converts .lu files to LUIS application JSON models or vice versa.
- **Generate**: Generates a strongly typed C# or TS source code from an exported LUIS JSON model.
- **Translate**: Translates LUIS JSON models or lu files to different languages.
- **Version Clone**: Creates a new version equivalent to the selected application version.
- **Version Export**: Exports a LUIS application version to JSON format.
- **Version Import**: Imports a new version into a LUIS application from JSON or LU content.
- **Version Rename**: Renames a LUIS application version.
- **Version Delete**: Deletes a LUIS application version.

The QnA Maker available commands are:

- **Create KB**: Creates a new QnA knowledge base.
- **Delete KB**: Deletes a knowledge base by its id.
- **Publish KB**: Publishes all unpublished in the knowledge base to the prod endpoint.
- **Replace KB**: Replaces a knowledge base contents with new contents.
- **Update KB**: Adds or deletes QnA Pairs/URLs to an existing knowledge base.
- **Train KB**: Issues a training call to add suggestions to the knowledge base.
- **Query KB**: Generates a question for fetching the answer from the knowledge base.
- **Convert**: Converts .qna files to QnA application JSON models or vice versa.
- **Translate**: Translates a QnA JSON model or qna files to different languages.
- **Alterations Replace KB**: Replaces word alterations for the KB with the give records.
- **Endpoint Settings Update**: Updates the endpoint settings.
- **Endpoint Keys Refresh**: Refreshs the endpoint keys.


## Known Issues
The task is missing telemetry to differentiate when the commands are called through the task from the CLI calls.