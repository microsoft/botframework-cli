# Translate command
Often times you might want to target a multi-lingual bot. You can of course use Machine Translation as an integral part of your bot like documented [here](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-translation?view=azure-bot-service-4.0&tabs=cs). 

In other cases, you might want to manage the translation and localization for the language understanding content for your bot independently. 

Translate command in the @microsoft/bf-lu library takes advantage of the [Microsoft text translation API](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/) to automatically machine translate .lu files to one or more than [60+ languages](https://aka.ms/translate-langs) supported by the Microsoft text translation cognitive service.

You can learn more about language x locale support for [LUIS.ai](https://www.luis.ai/) [here](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/luis-supported-languages)

## What is translated? 
- An .lu file and optionally translate
    - Comments in the lu file
    - LU reference link texts
- List of .lu files under a specific path.

When translating .lu file, 
- [Intent](https://docs.microsoft.com/en-us/azure/bot-service/file-format/bot-builder-lu-file-format?view=azure-bot-service-4.0#intent) names are not translated
- [Entity](https://docs.microsoft.com/en-us/azure/bot-service/file-format/bot-builder-lu-file-format?view=azure-bot-service-4.0#entity) names are not translated

```
>bf luis:translate

OPTIONS
  --in=in                                    (required) Source .lu file(s) or LUIS application JSON model
  --out=out                                  Output folder name. If not specified stdout will be used as output
  --recurse                                  Indicates if sub-folders need to be considered to file .lu file(s)
  --srclang=srclang                          Source lang code. Auto detect if missing.
  --tgtlang=tgtlang                          (required) Comma separated list of target languages.
  --translate_comments=translate_comments    When set, machine translate comments found in .lu or .qna file
  --translate_link_text=translate_link_text  When set, machine translate link description in .lu or .qna file
  --translatekey=translatekey                (required) Machine translation endpoint key.
```

## Getting keys
luis:translate command expects a Machine translation subscription key. You can obtain one [here](https://aka.ms/translate-key)

## Generating LUIS models from translated lu files
You can follow instructions [here](./working-with-luis.md) to create LUIS applications from lu files generated via luis:translate command. 

**Note**: You need to explicitly provide the correct [LUIS lang code](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/luis-supported-languages) to the bf luis:translate command.

**Note**: bf luis:translate command does not verify validity of the .lu file. You might want to try `luis:convert` with the .lu file(s) before translating to address validity issues in the source language before translating. 