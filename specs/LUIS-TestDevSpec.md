# [BF LU TEST] Dev Spec One-Pager

This specification details how to verify or test the published LUIS model.  

## Requirement

As a BF user, I’d like to test my utterances to meet with the design requirement for expected intent or expected entity.

> Example: "Hello, How is the weather in Seattle?"

User would like to know whether this utterance meets with the expected intent "weather" and "Seattle" is labeled with the "Location" entity.

As a BF user, I’d like to batch test all my utterances.

```
Example:
"Hello?"  (expected intent "Welcome")
"I want to book the ticket." (expected intent "bookflight")
"Check my Email." (expected intent "Email")
```

## Design Spec

Based on the requirement, user needs to provide the testdata file and the LUIS configuration. This testdata includes the testing utterances labeled with user’s expected intent/entities. User will get a test report for the actual predicted results by running this command.

### Prerequisites

- LUIS model has been published to remote LUIS
- LUIS endpoint， subscriptionKey,  applicationId (trained model)
- Testdata file

### Summary

- Support lu file format and json file format as the input file.
- Support both intent and entity test. Entity types include the simple entity, ml entity and composite entity.
- Support intent only test. 
- Support role test for prebuilt entity and custom entity type. 
    - eg. simiple entity, ml entity, composite entity, regex entity, list entity, prebuit entity, pattern.any entity  
- Support batch testing.
- Result includes the summary at the beginning and the detail attached right after that.
  - Both entity and intent matched with the expected ones can be counted as pass.
  - Detail result will include the actual predicted intent with the score and the predicted entities.
  - If "allowIntentsCount" is set, user can get prediction score for \<number\> intents and default is the top-scoring intent.

### Use Case

```

USAGE
  $bf luis:test

OPTIONS
  -a, --appId=appId                      (required) LUIS application Id
  -h, --help                             luis:test help
  -i, --in=in                            Source .lu file or LUIS application JSON model for testing
  -o, --out=out                          Output file or folder name. If not specified stdout will be used as output
  -s, --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key
  --allowIntentsCount=allowIntentsCount  [default: 1] Top-scoring intent or top n Intent with score to show in the result
  --endpoint=endpoint                    [default: https://westus.api.cognitive.microsoft.com] LUIS endpoint hostname
  --force                                If --out flag is provided with the path to an existing file, overwrites that file
  --intentOnly                           Only test intent
  --staging                              Presence of flag targets the staging app, if no flag passed defaults to production

```

Example:

```

Command :
luis:test -i <testdata.lu> -o <result.lu> -s <subscriptionKey> -a <luisAppId> --endpoint <endpoint>

Input: testdata.lu

# ExpectedIntentName1

- Utterance foo

# ExpectedIntentName2

- Utterance {@entityType1=foo} and {@entiyType2=bar}

- Utterance {@Role1=foo} and {@Role2=bar}

- Utterance {@compositeType={@entityType1=foo} and {@entiyType2=bar}}

Output: result.lu  

> Total passed utterance: 8/10

> <list out all the failed results>
```

Scenario 1: User’s expected intent does not match with the predict intent, list out the actual predicted top1 intent. (the predicted entity is same with the expected entity)

```

# ExpectedIntentName1  

> FAIL, Predicted intent: OtherIntentName(score)

> PASS, Predicted entities: utterance foo

- Utterance foo

```

Scenario 2: User’s expected entity does not match with the predict entity, list out the actual predicted entity. (the predicted intent is same with the expected intent)

```

# ExpectedIntentName2  

> PASS, Predicted intent: ExpectedIntentName(score)  

> FAIL, Predicted entities: utterance {@entityType3=foo} and {@entityType4=bar}

- Utterance {@entityType1=foo} and {@entiyType2=bar}

```

Scenario 3: User’s expected intent and entity match with the predicted results, list out the predicted results.  

```
# ExpectedIntentName2

> PASS, Predicted intent: ExpectedIntentName(score)

> PASS, Predicted entities: utterance {@Role1=foo} and {@Role2=bar}

- Utterance {@Role1=foo} and {@Role2=bar}

```

Scenario 4: User’s expected intent does not match with the predicted intent and user can get top 3 predicted intent with score to figure out the failure by set the parameter “--allowIntentCount 3”.

```
# ExpectedIntentName2

> FAIL , Predicted intent: OtherIntentName1(score), OtherIntentName2(score), OtherIntentName3(score)

> PASS, Predicted entities: Utterance {@compositeType={@entityType1=foo} and {@entiyType2=bar}}

- Utterance {@compositeType={@entityType1=foo} and {@entiyType2=bar}}

```

Scenario 5: User can test intent only

```
Command:

luis:test -i <LUISTest.lu> -o <result.lu> -s <subscriptionKey> -a <luisAppId> --endpoint <endpoint> --intentonly

Input:

# ExpectedIntentName

- Utterance {@entityType1=foo} and {@entiyType2=bar}

- Utterance foo and bar

Output:

# ExpectedIntentName  

> FAIL, predicted intent: OtherIntentName(score)

- Utterance {@entityType1=foo} and {@entiyType2=bar}


# ExpectedIntentName

> PASS, predicted intent: ExpectedIntentName(score)

- Utterance foo and bar

```
