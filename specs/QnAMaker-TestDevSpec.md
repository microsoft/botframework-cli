# [BF QNAMAKER TEST] Dev Spec One-Pager

This specification details how to verify or test the published QnAMaker model.  

## Requirement

As a BF user, I’d like to test my qnamaker to meet with the design requirement for expected answers.

> Example: "Where can I get coffee"

User would like to know whether this question can get the expected answer like 
> "You can get coffee in our Seattle store at 1 pike place, Seattle, WA"

As a BF user, I’d like to batch test all my questions.

```
Example:
"Hello there"  (expected answer "Hello.")
"Where can I get coffee" (expected answer "You can get coffee in our Seattle store at 1 pike place, Seattle, WA")
"How do I programmatically update my KB?" (expected answer "You can use our REST apis to manage your KB. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/58994a073d9e04097c7ba6fe/operations/58994a073d9e041ad42d9baa")
```

## Design Spec

Based on the requirement, user needs to provide the testdata file and the QnA configuration. This testdata includes the testing questions labeled with user’s expected answers. User will get a test report for the actual predicted results by running this command.

### Prerequisites

- QnA model has been published to remote QnA service
- QnA service hostname, endpointKey，subscriptionKey, qnaId(trained model)
- Testdata file

### Summary

- Support qna file format and json file format as the input file.
- Support both single question and multiple questions test. 
- Support qnamaker filters test
- Support batch testing.
- Result includes the summary at the beginning and the detail attached right after that.
  - Answer matched with the expected one can be counted as pass.
  - Detail result will include the actual predicted top answer with the score.

### Use Case

```

USAGE
  $bf qnamaker:test

OPTIONS
  -e, --endpointKey=endpointKey          (required) Specifies the endpoint key for your private QnA service (From qnamaker.ai portal user settings page).
  -f, --force                            If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help                             qnamaker:test help
  -i, --in=in                            Source .qna file(s) or QnA KB JSON file
  -k, --kbId=kbId                        (required) Specifies the active qnamaker knowledgebase id.
  -o, --out=out                          Output file or folder name. If not specified stdout will be used as output
  --hostname=hostname                    (required) Specifies the url for your private QnA service.
  --log                                  Enables log messages
  --scorethreshold=scorethreshold        Specifies the confidence score threshold for the returned answer.
  --test                                 Query against the test index

```

### Example:

Command :

```
qnamaker:test -i <testdata.qna> -o <result.qna> -e <endpointKey> --hostname <hostname> -k <kbId>
```

Input: testdata.qna

````
> # QnA pairs

> !# @qna.pair.source = Custom Editorial
## ? Where can I get coffee

```markdown
You can get coffee in our Seattle store at 1 pike place, Seattle, WA
``` 


> !# @qna.pair.source = Custom Editorial
## ? Do you think I'm the smartest?
- Between you or me, who is the most smart?
- Do you think you're the brightest

```markdown
You're definitely smarter than I am.
```


> !# @qna.pair.source = Custom Editorial
## ? How do I programmatically update my KB?
**Filters:**
- category = api

```markdown
You can use our REST apis to manage your KB. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/58994a073d9e04097c7ba6fe/operations/58994a073d9e041ad42d9baa
```
````


Output: result.lu  
```
> Total passed utterances: 8/10

> <list out all the rest results>
```

We use .qna format both for input and output, .qna files contain Markdown-like text based definitions for QnAmaker.ai concepts. You can find the detail of the format [here](https://docs.microsoft.com/en-us/azure/bot-service/file-format/bot-builder-qna-file-format?view=azure-bot-service-4.0)

### Scenario 1: User’s expected answer matches with the predicted one, list out the qna-pair ID with confidence score. 


Input:

````
> !# @qna.pair.source = Custom Editorial
## ? Where can I get coffee

```markdown
You can get coffee in our Seattle store at 1 pike place, Seattle, WA
``` 
````

Output:
````
> Utterance passed in this answer: 1/1
> !# @qna.pair.source = Custom Editorial

> PASS, 167(92.01)
## ? Where can I get coffee

```markdown
You can get coffee in our Seattle store at 1 pike place, Seattle, WA
``` 
````

All the questions in the input will be sent to remote QnA service and get a predicted answer, while the answer below the question in the input will be considered as the expected answer. If the predicted answer and the expected one are exactly the same(both raw text and QnAid if provided), the case will be treated as PASS. The QnAId("167" in the above sample) of the answer with a match score("92.01" in parentheses) will also be listed.

### Scenario 2: User’s expected answer does not match with the predicted one, list out the actual predicted top-scoring answer.

````
> Utterance passed in this answer: 0/1
> !# @qna.pair.source = Custom Editorial

> FAIL, 161(100), Predicted Answer: No, I'm the smartest!
## ? Do you think I'm the smartest?

```markdown
You're definitely smarter than I am.
```
````

The expected answer for the question "Do you think I'm the smartest?" is "You're definitely smarter than I am.", but the predicted answer is "No, I'm the smartest!". So this case will be considered as

### Scenario 3: No good answer found for the question, list with an id -1 with score 0.

````
> Utterance passed in this answer: 0/1
> !# @qna.pair.source = Custom Editorial

> FAIL, -1(0), Predicted Answer: No good match found in KB.
## ? How old are you?

```markdown
Age doesn't really apply to me.
```

````

### Scenario 4: Multiple questions for one answer, list out the result for each one.

````

> Utterance passed in this answer: 1/2
> !# @qna.pair.source = Custom Editorial

> PASS, 158(72.01)
## ? Are you smarter than me?
> FAIL, 161(100), Predicted Answer: No, I'm the smartest!
- Do you think I'm the smartest?

```markdown
You're definitely smarter than I am.
```

````
Before each qna-pair there is a summary that tells how many questions there are and how many passed.

### Scenario 5: Get the answer with StrictFilter

````
> Utterance passed in this answer: 1/2
> !# @qna.pair.source = Custom Editorial

> PASS, 154(100)
## ? How do I programmatically update my KB?

**Filters:**
- category = api

```markdown
You can use our REST apis to manage your KB. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/58994a073d9e04097c7ba6fe/operations/58994a073d9e041ad42d9baa
```
````

The key-value pair in the Filters field will be used as strict filter to get the predicted answer.

### Scenario 6: Batch test

````
> # QnA pairs

> Total passed utterances: 6/9


> Utterance passed in this answer: 1/1
> !# @qna.pair.source = Custom Editorial

> PASS, 153(100)
## ? How can I change the default message from QnA Maker?

```markdown
You can change the default message if you use the QnAMakerDialog. See this for details: https://docs.botframework.com/en-us/azure-bot-service/templates/qnamaker/#navtitle
```


> Utterance passed in this answer: 1/2
> !# @qna.pair.source = Custom Editorial

> PASS, 154(100)
## ? How do I programmatically update my KB?
> FAIL, -1(0), Top Result: No good match found in KB.
- change qna maker

**Filters:**
- category = api

```markdown
You can use our REST apis to manage your KB. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/58994a073d9e04097c7ba6fe/operations/58994a073d9e041ad42d9baa
```


> Utterance passed in this answer: 4/6
> !# @qna.pair.source = custom editorial

> PASS, 158(72.01)
## ? Do you think I'm the smartest?
> FAIL, -1(0), Top Result: No good match found in KB.
- Between you or me, who is the most smart?
> PASS, 158(80.05)
- Do you think you're the brightest
> FAIL, 161(100), Top Result: Age doesn't really apply to me.
- how old are you?
> PASS, 158(62.8)
- Do you think you're more knowledgeable than me?
> PASS, 158(74.33)
- I'm definitely more clever

```markdown
You're definitely smarter than I am.
```

> # QnA Alterations


````

When you batch test the qna-pairs in one .qna file, you will get a summary at the beginning of the doc which tells the total number of questions and the number of passes.

### TODO
We may support other scenarios later, such as test for multi-turn conversation or topN matched result.