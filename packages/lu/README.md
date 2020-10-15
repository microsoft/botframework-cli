
This package is intended for Microsoft use only. It is not designed to be consumed as an independent package.

# Consuming @microsoft/bf-lu as a library
@microsoft/bf-lu can be used within a Node.js application as an imported library. Install locally:

```bash
npm install @microsoft/bf-lu --save
```

# V2 API

## Parsing LU Content
To parse LU files, you can use the LUISBuilder class, which returns a LUIS class

```js
const Luis = require('@microsoft/bf-lu').V2.Luis
const LUISBuilder = require('@microsoft/bf-lu').V2.LuisBuilder
const luContent = `# Greeting
- hi`;

const luisObject = await LUISBuilder.fromContentAsync(luContent)

// Parsed LUIS object
console.log(JSON.stringify(luisObject, 2, null));
        
```

## Validating parsed LU content

You can use the available validate() function to verify if the parsed LUIS object is valid. This helps catch name conflicts, invalid labelled utterances etc. 

```js
const LUISBuilder = require('@microsoft/bf-lu').V2.LuisBuilder
const exception = require('@microsoft/bf-lu').V2.Exception
const luContent = `# Greeting
- hi`;

const luisObject = await LUISBuilder.fromLUAsync(luContent)
luisObject.intents[0].name = "testIntent123456789012345678901234567890123"
luisObject.validate()
```

## Generating lu content from LUIS JSON

You can generate lu content from LUIS instance using parseToLuContent() method. Here's an example code snippet. 

```js
const LUISBuilder = require('@microsoft/bf-lu').V2.LuisBuilder
const exception = require('@microsoft/bf-lu').V2.Exception
const luContent = `# Greeting
- hi
$userName:first=
-vishwac`;
const log = false;
const locale = 'en-us';
async function parseContent() {

    try {   
        const luisObject = await LUISBuilder.fromContentAsync(luContent)
        luisObject.validate()
        const parsedLuisBackToLu = luisObject.parseToLuContent()
    } catch (error) {
        if (error instanceof exception) {
        // do something specific to this exception
        } else {
            console.log(errObj.text);
        }
    }
}

parseContent();

```
## Translating lu files

You can take advantage of the [Microsoft text translation API](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/) to automatically machine translate .lu files to one or more than [60+ languages](https://aka.ms/translate-langs) supported by the Microsoft text translation cognitive service.

To translate lu file content, you can simply use the translate() method in the LU class. Here's a code snippet.

```js
const LU = require('@microsoft/bf-lu').V2.LU
const luContent = `# Greeting
- hi
$userName:first=
-vishwac`;
const targetLanguage = 'de';
const subscriptionKey = '<YOUR TEXT TRANSLATION KEY>';
const translateComments = true;
const translateLinkText = true;

const luInstance = new LU(luContent)
await luInstance.translate(subscriptionKey, targetLanguage, translateComments, translateLinkText)
const translatedCode = luInstance.content

```
