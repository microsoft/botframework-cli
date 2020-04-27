# Translate command
Often times you might want to target a multi-lingual bot. You can of course use Machine Translation as an integral part of your bot like documented [here](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-translation?view=azure-bot-service-4.0&tabs=cs). 

In other cases, you might want to manage the translation and localization for the language understanding content for your bot independently. 

Translate command in the @microsoft/bf-lu library takes advantage of the [Microsoft text translation API](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/) to automatically machine translate .lu files to one or more than [60+ languages](https://aka.ms/translate-langs) supported by the Microsoft text translation cognitive service.

You can learn more about language x locale support for [qnamaker.ai](https://www.qnamaker.ai/) [here](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/overview/languages-supported)

## What is translated? 
- An .qna file and optionally translate
    - Comments in the qna file
    - QnA reference link texts
- List of .qna files under a specific path.

```
>bf qnamaker:translate

OPTIONS
  -f, --force                  If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help                   qnamaker:translate help
  -i, --in=in                  Source .qna file(s) or QnA maker application JSON model
  -o, --out=out                Output folder name. If not specified stdout will be used as output
  -r, --recurse                Indicates if sub-folders need to be considered to find .qna file(s)
  --srclang=srclang            Source lang code. Auto detect if missing.
  --tgtlang=tgtlang            (required) Comma separated list of target languages.
  --translate_comments         When set, machine translate comments found in .qna file
  --translate_link_text        When set, machine translate link description in .qna file
  --translatekey=translatekey  (required) Machine translation endpoint key.
```

## Getting keys
qnamaker:translate command expects a Machine translation subscription key. You can obtain one [here](https://aka.ms/translate-key)

## Generating LUIS models from translated lu files
You can follow instructions [here](./working-with-qna.md) to create LUIS models from lu files generated via luis:translate command. 

**Note**: You need to explicitly provide the correct [QnAMaker lang](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/overview/language-support#languages-supported) to the bf qnamaker:translate command.

**Note**: bf qnamaker:translate command does not verify validity of the .qna file. You might want to try `qnamaker:convert` with the .qna file(s) before translating to address validity issues in the source language before translating. 