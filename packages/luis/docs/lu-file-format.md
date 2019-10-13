# .lu File Format
.lu files contain markdown-like, simple text based definitions for [LUIS](http://luis.ai) concepts. 

See [here](./qna-file-format.md) to learn more about the .qna file format.

- [Comments](#Adding-comments)
- [Intent](#Intent)
- [Entities](#Entity)
	- [Definition](#Definition)
    - [Machine learned](#Machine-learned-entity)
	- [Prebuilt entity](#Prebuilt-entity)
	- [List entity](#List-entity)
	- [Composite entity](#Composite-entity)
	- [Regex entity](#Regex-entity)
- [Roles](#Roles)
- [Phrase lists features](#Phrase-list-definition)
- [Model as a feature](#Model-as-feature)
- [Tie features to a specific model](#Tie-features-to-a-specific-model)
- [Patterns](#Patterns)
- [Model description](#Model-description)
- [References](#External-references)

## Adding comments
You can add comments to your .lu document by prefixing the comment with >. Here's an example: 

```markdown
> This is a comment and will be ignored

# Greeting
- hi
- hello
```

## Intent
An intent represents an action the user wants to perform. The intent is a purpose or goal expressed in a user's input, such as booking a flight, paying a bill, or finding a news article. You define and name intents that correspond to these actions. A travel app may define an intent named "BookFlight."

Here's a simple .lu file that captures a simple 'Greeting' intent with a list of example utterances that capture ways users can express this intent. You can use - or + or * to denote lists. Numbered lists are not supported.

```markdown
# Greeting
- Hi
- Hello
- Good morning
- Good evening
```

'#\<intent-name\>' describes a new intent definition section. Each line after the intent definition are example utterances that describe that intent.

You can stitch together multiple intent definitions in a single file like this:

```markdown
# Greeting
- Hi
- Hello
- Good morning
- Good evening

# Help
- help
- I need help
- please help
```
Each section is identified by #\<intent name\> notation. Blank lines are skipped when parsing the file.

## Entity
An entity represents detailed information that is relevant in the utterance. For example, in the utterance "Book a ticket to Paris", "Paris" is a location. 

|Sample user utterance|entity|
|--------------------------|----------|
|"Book a flight to **Seattle**?"|Seattle|
|"When does your store **open**?"|open|
|"Schedule a meeting at **1pm** with **Bob** in Distribution"|1pm, Bob|

### Definition
Entites are declarated via
```markdown
@ \<entity-type> \<entity-name> [[hasRoles] \<comma-separated-list-of-roles>]
```

Entities that require a definition (e.g. list, regex, composite etc) are represented using this notation - 

```markdown
@ \<entity-name> = \<definition>
```

Declaration and definition can also be combined into a single line like this -

```markdown
@ \<entity-type> \<entity-name> [[hasRoles] \<comma-separated-list-of-roles>] = \<definition>
```

Entity type, entity name and definition are required. Roles are optional.

Entity names with space in them can be wrapped in quotes.

**Note:** prebuilt entity names cannot have spaces in them.

Here's an example:

```markdown
@ ml "this is a simple entity" role1, role2
@ ml 'this is a simple entity' hasRoles role1, role2
```

## Machine learned entity

```markdown
@ ml name firstName, lastName
```

**Note** For any labelled entity that is not explicitly assigned a type, the parser defaults to ml entity type for that entity.

```markdown
# getUserName
- my name is {username=vishwac}

> Without an explicit entity definition, 'userName' defaults to 'ml' entity type.
```

## Prebuilt entity

The following LUIS prebuilt entity types are supported - 
- age
- datetimeV2
- dimension
- email
- geographyV2
- keyPhrase
- money
- number
- ordinal
- ordinalV2
- percentage
- personName
- phoneNumber
- temperature
- url
- datetime

```markdown
@ prebuilt number numOfGuests, age
@ prebuilt datetimeV2 fromDate, toDate
@ prebuilt age userAge
```

**Note:** Not all prebuilt entity types are available across all locales. See [here](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-reference-prebuilt-entities) for prebuilt entity support by locale.

## List entity

```markdown
@ list color favColor, screenColor
@ color =
    - \<normalized-value>
        - \<synonym1>
        - \<synonym2>
        - ...
    - \<normalized-value>
        - \<synonym1>, \<synonym2>, ...
 
> Alternate definition
@ list color favColor, screenColor =
    - \<normalized-value>
        - \<synonym1>; \<synonym2>; ...
```

**Note::** When using list entity, you should include a value from the list directly in the utterance, not an entity label or any other value. 

## Composite entity

```markdown
@ composite deviceTemperature from, to
@ deviceTemperature =
    - child1, child2

> Alternate definition

@ composite deviceTemperature from, to = [child1, child2]
```

Example definition:

```markdown
# setThermostat
> This utterance labels ‘thermostat to 72’ as composite entity deviceTemperature
    - Please set {deviceTemperature = thermostat to 72}
> This is an example utterance that labels ‘owen’ as customDevice (ml entity) and wraps ‘owen to 72’ with the ‘deviceTemperature’ composite entity
    - Set {deviceTemperature = {customDevice = owen} to 72}

> Define a composite entity ‘deviceTemperature’ that has device (list entity), customDevice (ml entity), temperature (pre-built entity) as children
@ composite deviceTemperature = [device, customDevice, temperature]

@ list device = 
	- thermostat :
		- Thermostat
		- Heater
		- AC
		- Air conditioner
	- refrigterator : 
		- Fridge
    	- Cooler

@ ml customDevice

@ prebuilt temperature
```

## Regex entity

```markdown
@ regex hrf-number from, to
@ hrf-number = /hrf-[0-9]{6}/

> Alternate definition
@ regex hrf-number from, to = /hrf-[0-9]{6}/
```

## Machine learned entity with n-depth support

Here's a definition of an `address` n-depth entity with `fromAddress` and `toAddress` as two roles.

```markdown
@ list listCity
@ prebuilt number
@ prebuilt geographyV2
@ regex regexZipcode = /[0-9]{5}/
@ ml address hasRoles fromAddress, toAddress 
@ address =
    - @ number 'door number'
    - @ ml streetName
    - @ ml location usesFeature geographyV2
        - @ listCity city
        - @ regexZipcode zipcode
```
### Roles

Roles](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-concept-roles) are named, contextual subtypes of an entity.

Every entity type except Phrase Lists can have [roles](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-concept-roles). 

Roles give a name to those differences:

|Entity	|Role	|Purpose|
|-------|-------|-------|
|Location	|origin	|where the plane leaves from|
|Location	|destination	|where the plane lands|

Roles in .lu file format can be explicitly or implicity defined. 

Explicit definition follow the following notation - @ \<entityType> \<entityName> [hasRole[s]] role1, role2, ...
```markdown
> # ml entity definition with roles
@ ml name role1, role2

> this is the same as 
@ ml name hasRoles role1, role2

> this is also the same as 
@ ml name
@ name hasRoles role1, role2

> Also same as 
@ ml name
@ name hasRole role1
@ name hasRole role2
```

Implicit definition: You can refer to roles directly in patterns as well as in labelled utterances via {@\<entityName>:\<roleName>} format. 
```markdown
# AskForUserName
- {userName:firstName=vishwac} {userName:lastName=kannan}
- I'm {userName:firstName=vishwac}
- my first name is {userName:firstName=vishwac}
- {userName=vishwac} is my name

> This definition is same as including an explicit defintion for userName with 'lastName', 'firstName' as roles
> @ ml userName hasRoles lastName, firstName
```

In patterns, you can use roles using the {\<entityName\>:\<roleName\>} notation. Here's an example: 

```markdown
# getUserName
- call me {name:userName}
- I'm {name:userName}
- my name is {name:userName}
```

You can define multiple roles for an entity in patterns and the parser will do rest! 

```markdown
# BookFlight
> roles can be specified for list entity types as well - in this case fromCity and toCity are added as roles to the 'city' list entity defined further below
- book flight from {city:fromCity} to {city:toCity}
- [can you] get me a flight from {city:fromCity} to {city:toCity}
- get me a flight to {city:toCity}
- I need to fly from {city:fromCity}

$city:Seattle=
- Seattle
- Tacoma
- SeaTac
- SEA

$city:Portland=
- Portland
- PDX
```

## Phrase list definition

For phrase lists that need to be marked interchangeable, simply include that in the definition - 

```markdown
@ phraselist todo(interchangeable) = 
	- one
	- two
```

You can enhance LUIS understanding of your model using [PhraseLists](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/luis-tutorial-interchangeable-phrase-list).

You can describe Phrase List entities using the following notation:
@ phraselist \<Name\>
    - \<synonym1\>
    - \<synonym2\>

Here's an example of a phrase list definition:

```markdown
@ phraseList Want
@ phraseList Want =
    - require, need, desire, know
```

> You can also break up the phrase list values into an actual list

@ phraseList Want =
    - require
	- need
	- desire
	- know
```
By default synonyms are set to be **not interchangeable** (matches with the portal experience). You can optionally set the synonyms to be **interchangeable** as part of the definition. Here's an example:

```markdown
@ phraselist question(interchangeable) = 
    - are you
    - you are
```

## Model as feature

Here's how you add a feature to a ml entity or an intent - with `usesFeature`.

```markdown
> entity definition - <> \<entityType> \<entityName> [<roles>]
@ prebuilt personName
@ prebuilt age

> entity definition with roles
@ ml userName hasRoles fistName, lastName

> add entity as feature to another entity
@ userName usesFeature personName

> add entity as feature to intent
@ intent getUserNameIntent usesFeature personName

> Intent definition
# getUserNameIntent
- utterances

> multiple entities as feature to a model
@ intent getUserNameIntent usesFeature age, personName

> intent as feature to another intent
@ intent getUserProfileIntent usesFeature getUserNameIntent

# getUserProfileIntent
- utterances
```

## Tie features to a specific model

Phrase list can be added as a feature to 

- another intent
- another entity
- child in an n-depth entity

Here's how you define phrase list as a feature to another model

```markdown
> phrase list definition
@ phraseList PLCity(interchangeable) = 
    - seattle
    - space needle
    - SEATAC
    - SEA

> phrase list as feature to intent (also applicable to entities)
@ intent getUserProfileIntent usesFeature PLCity

> phrase list as a feature to an ml entity.
@ ml myCity usesFeature PLCity

@ regex regexZipcode = /[0-9]{5}/

> phrase list as feature to n-depth entity with phrase list as a feature
@ ml address fromAddress, toAddress
@ address =
    - @ number 'door number'
    - @ ml streetName
    - @ ml location
        - @ ml city usesFeture PLCity
        - @ regexZipcode zipcode
```

## Patterns
Patterns allow you to define a set of rules that augment the machine learned model. You can define patterns in the .lu file simply by defining an entity in an utterance without a labelled value. 

As an example, this would be treated as a pattern with alarmTime set as a Pattern.Any entity type:
```markdown
# DeleteAlarm
- delete the {alarmTime} alarm
``` 
This example would be treated as an utterance since it has a labelled value with 7AM being the labelled value for entity alarmTime:
```markdown
# DeleteAlarm
- delete the {alarmTime=7AM} alarm
```

**Notes:**
1. Any utterance without at least one labelled value will be treated as a pattern
2. Any entity without an explicit labelled value will default to a Pattern.Any entity type. 

## Model description
You can include configuration information for your LUIS application or QnA Maker KB in the .lu file using this notation. This will help direct the parser to handle the LU content correctly -

```markdown
> !# @\<property> = \<value>
> !# @\<scope>-\<property> = \<value>
> !# @\<scope>-\<property> = \<semicolon-delimited-key-value-pairs>
```

**Note** Any information explicitly passed in via CLI arguments will override information in the .lu file.

```markdown
> Parser instruction - this is optional; unless specified, parser will default to the latest version.
> !# @version = 1.0

> LUIS application description
> !# @app.name = my luis application
> !# @app.desc = description of my luis application
> !# @app.versionId = 0.5
> !# @app.culture = en-us
> !# @app.luis_schema_version = 3.2.0
```

## External references

Few different references are supported in the .lu file. These follow Markdown link syntax.
- Reference to another .lu file via `\[link name](\<.lu file name\>)`. Reference can be an absolute path or a relative path from the containing .lu file.
- Reference to a folder with other .lu files is supported through 
	- `\[link name](\<.lu file path\>/*)` - will look for .lu files under the specified absolute or relative path
	- `\[link name](\<.lu file path\>/**)` - will recursively look for .lu files under the specified absolute or relative path including sub-folders.
- You can also add references to utterances defined in a specific file under an Intent section or as QnA pairs.
	- `\[link name](\<.lu file path\>#\<INTENT-NAME\>) will find all utterances found under \<INTENT-NAME\> in the .lu file and add them to the list of utterances where this reference is specified
	- `\[link name](\<.lu file path\>#*utterances*) will find all utterances in the .lu file and add them to the list of utterances where this reference is specified
    - `\[link name](\<.lu file path\>#*patterns*) will find all patterns in the .lu file and add them to the list of utterances where this reference is specified
	- `\[link name](\<.lu file path\>#*utterancesAndPatterns*) will find all utterances and patterns in the .lu file and add them to the list of utterances where this reference is specified

Here's an example of those references: 

```markdown
> You can include references to other .lu files
[All LU files](./all.lu)

> References to other files can have wildcards in them
[en-us](./en-us/*)

> References to other lu files can include sub-folders as well. 
> /** indicates to the parser to recursively look for .lu files in all subfolders as well.
[all LU files](../**)

> You can include deep references to intents defined in a .lu file in utterances
# None
- [None uttearnces](./all.lu#Help)

> With the above statement, the parser will parse all.lu and extract out all utterances associated with the 'Help' intent and add them under 'None' intent as defined in this file.

> NOTE: This **only** works for utterances as entities that are referenced by the uttearnces in the 'Help' intent will not be brought forward to this .lu file.

# All utterances
> you can use the *utterances* wild card to include all utterances from a lu file. This includes utterances across all intents defined in that .lu file. 
- [all.lu](./all.lu#*utterances*)
> you can use the *patterns* wild card to include all patterns from a lu file. 
> - [all.lu](./all.lu#*patterns*)
> you can use the *utterancesAndPatterns* wild card to include all utterances and patterns from a lu file. 
> - [all.lu](./all.lu#*utterancesAndPatterns*)

> You can include wild cards with deep references to QnA maker questions defined in a .qna file in utterances
# None
- [QnA questions](./*#?)

> With the above statement, the parser will parse **all** .lu files under ./, extract out all questions from QnA pairs in those files and add them under 'None' intent as defined in this file.

> You can include deep references to QnA maker questions defined in a .qna file in utterances
# None
- [QnA questions](./qna1.qna#?)

> With the above statement, the parser will parse qna1.lu and extract out all questions from QnA pairs in that file and add them under 'None' intent as defined in this file.
```
