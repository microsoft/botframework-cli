# Refresh command
After you have bootstrapped and created your LUIS model and / or QnAMaker knowledge base, you might make subsequent refinements to your models directly from [luis.ai](https://luis.ai/) or [qnamaker.ai](https://qnamaker.ai). You can use the refresh command to re-generate .lu files from your LUIS JSON and / or QnAMaker JSON files.  

```
>bf luis:convert or bf qnamaker:convert

  Usage: bf luis:convert --in <LUISJsonFile>  or bf qnamaker:convert --in <QnAJSONFile>

```

# Exporting LUIS model (for bf luis:convert)
## Using CLI
```bash
luis export version --appId <string> --versionId <string> --authoringKey <key>
```
## using [LUIS](http://luis.ai) portal
- Navigate to [LUIS](http://luis.ai)
- Sign in
- Click on My apps
- Find the app you wish to download, click "..." -> Export app

# Exporting QnA Maker 
## using CLI
```bash
bf qnamaker:export:kb --kbId <kbId> --environment <string>
```


