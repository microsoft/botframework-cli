# `qnamaker:build`
The **qnamaker:build** commmand makes it easy for you to manage working with multiple model definitions among team members across data centers and languages.

For each QnA file (and its language variants) **qnamaker:build** will do the following:

1. If there isn't a qnamaker KB, it will create one
2. It runs `bf qnamaker:convert` tool to generate the model
3. It replaces the current KB content with the new KB content
4. It trains and publishes the KB
5. (OPTIONAL) It outputs a .dialog definition of a qnamakerRecognizer configured to use that model.

## Usage

1. Get qnamaker.ai subscriptionKey by creating a [qnamaker cognitive service][1] and retrieving your [subscriptionKey][2]
2. Invoke `bf qnamaker:build --subscriptionKey <key> --in <.qna file | folder with .qna files> ...`

**qnamaker:build** will create all assets you need from your local [.qna files][0]. This will overwrite any content you might have in your KB that was authored/ managed directly via [qnamaker.ai][3]

**Note:** When using `--in` option, `qnamaker:build` will create one QnA Maker KB for every locale found (merges all .qna files per locale into a single KB)

## QnA and language variations files
Every [.qna file][0] can have multiple language variations.  **qnamaker:build** will build a model for each one.

The pattern for .qna files and the language variants are

```
example.en-us.qna
example.fr-fr.qna
example.de-de.qna
etc.
```

Each one of these .qna files will have a language specific model created for it.

**Note:** If no languge code can be deduced either via file name, then the value specified for CLI argument --defaultCulture will be used or defaults to `en-us` if none are present.

## QnA Maker Knowledge Bases created

Every combination of project, environment, and file name (with locale) will be used to name the application created on your behalf.

QnA Maker KB names will use this format:

> {botName}-{suffix}-{QnAfilename}-{langcode}.qna

Example:

```
MyProject(vishwac)-RootDialog.en-us.qna
MyProject(vishwac)-RootDialog.fr-fr.lu
MyProject(vishwac)-RootDialog.de-de.lu
```

## Environments

When multiple people are working with models you want to be able to work with models independently from each other tied to the source control.

By default, **qnamaker:build** uses the logged in user alias as the environment, so that you can simply create and work with local changes.  

You can override the environment via cli argument *--suffix foo* file.

## Generated Settings file
The output of `qnamaker:build` includes a settings file per environment which contains the mapping of [.qna file][0] variants to the QnA Maker applicationID for the model.

Example for user **vishwac** targeting authoring region **westus** 

**qnamaker.settings.vishwac.westus.json**

```json
{
    "qna": {
        "RootDialog_en-us_qna": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "hostname": "https://xxxxxxxxxxxxxxxxxx.azurewebsites.net"
    }
}
```

## Generated .Dialog file for .qna file

With `--dialog` option specified, all language variations of a .qna files with the same prefix will get a .dialog file created which is a LUIS recognizer configured for it. 

Example:

```
./rootDialog/RootDialog.qna.dialog <-- MultiLanguageRecognizer configured to use all of the languages 
./rootDialog/RootDialog.en-us.qna.dialog <-- QnARecognizer
```

The net result is that to consume all of the language models in a dialog you simply can do this:

```json
{
    "$kind":"Microsoft.AdaptiveDialog",
    "recognizer": "RootDialog.qna"  <-- this will be the multilanguage model with all variations
}
```

This will configure your recognizer to a QnAMakerRecognizer("RootDialog.en-us.qna") which internally will use your memory *settings.qna.xxx* to bind to the correct .dialog file for your model and runtime environment.


[0]:https://aka.ms/qna-file-format
[1]:https://docs.microsoft.com/en-us/azure/cognitive-services/QnAMaker/how-to/set-up-qnamaker-service-azure#create-a-new-qna-maker-service
[2]:https://docs.microsoft.com/en-us/azure/cognitive-services/QnAMaker/how-to/set-up-qnamaker-service-azure#find-subscription-keys-in-the-azure-portal
[3]:https://qnamaker.ai
[3]:./lu-file-format.md#External-references
[4]:./lu-file-format.md#Model-description
[5]:./examples/luis-build
[6]:./examples/luis-build/luconfig.json