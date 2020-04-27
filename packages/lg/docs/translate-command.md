# Translate command
Often times you might want to target a multi-lingual bot. You can of course use Machine Translation as an integral part of your bot like documented [here](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-translation?view=azure-bot-service-4.0&tabs=cs). 

In other cases, you might want to manage the translation and localization for the language generation content for your bot independently. 

Translate command in the @microsoft/bf-lg-cli library takes advantage of the [Microsoft text translation API](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/) to automatically machine translate .lg files to one or more than [60+ languages](https://aka.ms/translate-langs) supported by the Microsoft text translation cognitive service.

## What is translated? 
- An .lg file and optionally translate
    - Comments in the lg file
    - LG reference link texts
- List of .lg files under a specific path.

When translating .lg file, 
- [Template](https://aka.ms/lg-file-format) names are not translated
- [Property](https://aka.ms/lg-file-format) names in structured response templates are not translated

```
>bf lg:translate

OPTIONS
  -f, --force                  If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help                   lg:translate help
  -i, --in=in                  (required) .lg file or folder that contains .lg file.
  -o, --out=out                Output file or folder name. If not specified stdout will be used as output
  -r, --recurse                Consider sub-folders to find .lg file(s)
  --srclang=srclang            Source lang code. Auto detect if missing.
  --tgtlang=tgtlang            (required) Comma separated list of target languages.
  --translate_comments         Machine translate all comments found in .lg file
  --translate_link_text        Machine translate link description in .lg file
  --translatekey=translatekey  (required) Machine translation endpoint key.
```

## Getting keys
lg:translate command expects a Machine translation subscription key. You can obtain one [here](https://aka.ms/translate-key)