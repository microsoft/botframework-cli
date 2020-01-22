# .qna File Format
.qna files contain markdown-like, simple text based definitions for [QnAmaker.ai](http://qnamaker.ai) concepts. 

See [here](./lu-file-format.md) to learn more about the .lu file format.

Supported concepts: 

- [Comments](#Adding-comments)
- [QnA pairs](#Question-and-Answer-pairs)
- [Filters](#QnAMaker-Filters)
- [QnA Alterations](#QnA-Maker-alterations)
- [File references](#QnA-Maker-pdf-file-ingestion)
- [References](#External-references)
- [Model description](#Model-description)

## Adding comments
You can add comments to your .lu document by prefixing the comment with >. Here's an example: 

```markdown
> This is a comment and will be ignored

# Greeting
- hi
- hello
```

## Question and Answer pairs
.qna file (and the parser) supports question and answer definitions as well. You can this notation to describe them:

```markdown
# ? Question
    [list of question variations]
    ```markdown
    Answer
    ```
```

Here's an example of question and answer definitions. The bf qnamaker:convert command will automatically separate question and answers into a qnamaker JSON file that you can then use to create your new [QnaMaker.ai](http://qnamaker.ai) knowledge base article.

```markdown
> # QnA Definitions
> 
### ? who is the ceo?
	```markdown
	You can change the default message if you use the QnAMakerDialog. 
	See [this link](https://docs.botframework.com/en-us/azure-bot-service/templates/qnamaker/#navtitle) for details. 
	```

### ? How do I programmatically update my KB?
	```markdown
	You can use our REST apis to manage your KB. 
	\#1. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/58994a073d9e04097c7ba6fe/operations/58994a073d9e041ad42d9baa
	```
```

You can add multiple questions to the same answer by simply adding variations to questions:

```markdown
### ? Who is your ceo?
- get me your ceo info
	```markdown
		Vishwac
	```
```
```
```

## QnAMaker Filters

Filters in QnA Maker are simple key value pairs that can be used to narrow search results, boost answers and store context. You can add filters using the following notation: 
```markdown
***Filters:***
- name = value
- name = value 
```

Here's an example usage: 
```markdown
### ? Where can I get coffee? 
- I need coffee

**Filters:**
- location = seattle

    ```markdown
    You can get coffee in our Seattle store at 1 pike place, Seattle, WA
    ```

### ? Where can I get coffee? 
- I need coffee

**Filters:**
- location = portland

    ```markdown
    You can get coffee in our Portland store at 52 marine drive, Portland, OR
    ```
```

## QnA Maker alterations
QnA Maker supports [word alterations](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/concepts/best-practices#use-synonyms) as a way to improve the likelihood that a given user query is answered with an appropriate response. You can use this feature to add synonyms to keywords that take different form. 

You can describe word alterations/ synonyms list in .qna files using the following notation - 
```markdown
$<synonym word>:qna-alteration=
- <list of synonyms>
```

Here's an example: 
```markdown
$botframework : qna-alterations=
- bot framework
- Microsoft bot framework
```

## QnA Maker pdf file ingestion
QnA Maker also supports ingesting pdf files during KB creation. You can add files for QnA maker to ingest using the URL reference scheme. If the URI's content-type is not text/html, then the parser will add it to files collection for QnA Maker to ingest. 

```markdown
[SurfaceManual.pdf](https://download.microsoft.com/download/2/9/B/29B20383-302C-4517-A006-B0186F04BE28/surface-pro-4-user-guide-EN.pdf)
```

## Model description
You can include configuration information for your LUIS application or QnA Maker KB in the .qna file using this notation. This will help direct the parser to handle the LU content correctly -

```markdown
> !# @\<property> = \<value>
> !# @\<scope>-\<property> = \<value>
> !# @\<scope>-\<property> = \<semicolon-delimited-key-value-pairs>
```

**Note** Any information explicitly passed in via CLI arguments will override information in the .qna file.

```markdown
> Parser instruction - this is optional; unless specified, parser will default to the latest version.
> !# @version = 1.0

> QnA Maker KB description
> !# @kb.name = my qna maker kb name
```

## External references

Few different references are supported in the .qna file. These follow Markdown link syntax.
- Reference to another .qna file via `\[link name](\<.qna file name\>)`. Reference can be an absolute path or a relative path from the containing .qna file.
- Reference to a folder with other .qna files is supported through 
	- `\[link name](\<.qna file path\>/*)` - will look for .qna files under the specified absolute or relative path
	- `\[link name](\<.qna file path\>/**)` - will recursively look for .qna files under the specified absolute or relative path including sub-folders.
- Reference to URL for QnAMaker to ingest during KB creation via `\[link name](\<URL\>)`
- You can also add references to utterances defined in a specific file under an Intent section or as QnA pairs.
	- `[link name](<.lu file path>#<INTENT-NAME>) will find all utterances found under <INTENT-NAME> in the .lu file and add them to the list of questions where this reference is specified
	- `[link name](\<.lu file path>#*utterances*) will find all utterances in the .lu file and add them to the list of questions where this reference is specified
	- `\[link name](\<.qna file path\>#?) will find questions from all QnA pairs defined in the .qna file and add them to the list of utterances where this reference is specified.
	- `\[link name](\<.qna folder\>/*#?) will find all questions from all .qna files in the specified folder and add them to the list of utterances where this reference is specified. 

Here's an example of those references: 

```markdown
> QnA URL reference
[QnaURL](https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs)

> Include all content in ./kb1.qna
[KB1](./kb1.qna)

> Look for all .qna files under a path
[ChitChat](./chitchat/*)

> Recursively look for .qna files under a path including sub-folders.
[Chit chat](../chitchat/resources/**)
```
