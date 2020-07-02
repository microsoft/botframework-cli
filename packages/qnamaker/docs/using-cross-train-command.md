# `qnamaker:cross-train`
Cross-train writes out updated .qna files that contain cross-trained `DeferToRecognizer` QnA pair. 

Cross-train is required to use the [CrossTrainedRecognizerSet][1] available as part of [adaptive dialogs][2] as well as if you are looking or CI/CD support for [Composer][3] generated bots.

## What is cross-train? 
With [adaptive dialog][2], you now have the ability to author one or more [.qna file][5] file per dialog. Cross train command supports this by analyzing your cross-train configuration and does the following: 
- Automatically adds a `dialogName = <dialogName>` meta data filter to each QnA pair
- Adds one or QnA pairs that pull utterances from .lu content (if any) with answer `intent=DeferToRecognizer_LUIS_DialogName`. 

Both these are necessary for cross-trained recognizer to work. 

<img src="./cross-train.png" />

In cases where you are taking advantage of [CrossTrainedRecognizerSet][1], cross train command also sets up a `_interruption` intent with cross trained uttrances for your interruptions. See [here][10] to learn more. 

## Usage

```bash
> bf qnamaker:cross-train --in <source .lu files> --out <output folder> --config <cross-train configuration>
```

A cross-train configuration is necessary for the command to work. Here is an example cross-train configuration 

```jsonc
{
    // list each .lu file including variations per lang x locale. 
    // Lang x locale is denoted using 4 letter code. e.g. it-it, fr-fr
    // Paths can either be absolute (full) paths or paths relative to this config file.
    "./RootDialog/RootDialog.lu": {
        // indicate if this is an .lu file for a root dialog.
        "rootDialog": true,
        // list of trigers within that dialog
        "triggers": {
            // Key is name of intent within the .lu file (in this case RootDialog.lu) 
            // Value is the path to the child dialog's .lu file.
            "AddItem": "./AddToDoDialog/AddToDoDialog.lu",
            "DeleteItem": "./DeleteToDoDialog/DeleteToDoDialog.lu",
            "ViewItem": "./ViewToDoDialog/ViewToDoDialog.lu",
            "GetUserProfile": "./GetUserProfileDialog/GetUserProfileDialog.lu"
        }
    }
}
```

## Related commands
You might find these additional commands relevant/ helpful - 

- [bf qnamaker:build][6]
- [bf luis:cross-train][7]
- [bf luis:build][8]

[1]:https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-adaptive-dialog-recognizers?view=azure-bot-service-4.0#cross-trained-recognizer-set
[2]:https://aka.ms/adaptive-dialogs
[3]:https://aka.ms/composer
[4]:https://luis.ai
[5]:https://aka.ms/qna-file-format
[6]:./using-qnamaker-build.md
[7]:../../luis/docs/using-cross-train-command.md
[8]:../../luis/using-luis-build.md
[10]:../../luis/docs/using-cross-train-command.md