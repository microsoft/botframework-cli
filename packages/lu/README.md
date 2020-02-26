# Consuming @microsoft/bf-lu as a library
@microsoft/bf-lu can be used within a Node.js application as an imported library. Install locally:

```bash
npm install @microsoft/bf-lu --save
```

## Parsing lu files
To parse LU files, you can use the parseFile() method. 

```js
const ludown = require('@microsoft/bf-lu');
const luContent1 = `# Greeting
- hi`;
const log = false;
const locale = 'en-us';
ludown.parser.parseFile(luContent1, log, locale)
    .then(function(parsedContent) {
        // Parsed LUIS object
        console.log(JSON.stringify(parsedContent.LUISJsonStructure, 2, null));
        // Parsed QnA content
        console.log(JSON.stringify(parsedContent.qnaJsonStructure, 2, null));
        // Additional files to parse
        console.log(JSON.stringify(parsedContent.additionalFilesToParse, 2, null));
    })
    .catch(function(err) {
        let errObj = new ludown.helperClasses.Exception(err);
        // err is of type ludown.helperClasses.Exception. 
        // Possible error codes are available under ludown.helperEnums.errorCodes
        if(errObj.errCode === ludown.helperEnums.errorCodes.INVALID_INPUT) {
            // do something specific to this error code
        } else {
            console.log(errObj.text);
        }
    })
```

## Validating parsed lu files

You can use the available validateLUISBlob() function to verify if the parsed LUIS blob is valid. This helps catch name conflicts, invalid labelled utterances etc. 

```js
const ludown = require('@microsoft/bf-lu');
const luContent = `# Greeting
- hi {userName=bob}
$userName:first=
-vishwac`;
const log = false;
const locale = 'en-us';
async function parseContent() {
    let parsedContent;
    try {
        parsedContent = await ludown.parser.parseFile(luContent, log, locale);
    } catch (err) {
        let errObj = new ludown.helperClasses.Exception(err);
        // err is of type ludown.helperClasses.Exception. 
        // Possible error codes are available under ludown.helperEnums.errorCodes
        if(errObj.errCode === ludown.helperEnums.errorCodes.INVALID_INPUT) {
            // do something specific to this error code
        } else {
            console.log(errObj.text);
        }
    }
    // validate the parsed luis content
    ludown.parser.validateLUISBlob(parsedContent.LUISJsonStructure)
        .then(res => res)
        .catch(function(err) {
            let exception = new ludown.helperClasses.Exception(err);
            console.error('Oops, invalid LUIS content!\n');
            console.error(exception.errCode + ' : ' + exception.text);
        })
}

parseContent();
```

## Generating lu content from LUIS JSON

You can generate lu content from LUIS and QnA maker JSON using constructMdFromLUIS() and constructMdFromQnA() methods. Here's an example code snippet. 

```js
const ludown = require('@microsoft/bf-lu')
const luContent = `# Greeting
- hi
$userName:first=
-vishwac`;
const log = false;
const locale = 'en-us';
async function parseContent() {
    let parsedContent;
    try {
        parsedContent = await ludown.parser.parseFile(luContent, log, locale);
    } catch (err) {
        let errObj = new ludown.helperClasses.Exception(err);
        // err is of type ludown.helperClasses.Exception. 
        // Possible error codes are available under ludown.helperEnums.errorCodes
        if(errObj.errCode === ludown.helperEnums.errorCodes.INVALID_INPUT) {
            // do something specific to this error code
        } else {
            console.log(errObj.text);
        }
    }
    
    if(await ludown.parser.validateLUISBlob(parsedContent.LUISJsonStructure)) {
        // reconstruct md content
        ludown.refresh.constructMdFromLUIS(parsedContent.LUISJsonStructure)
        .then(function(result){
            console.log(result);
        })
        .catch(function(err) {
            let exception = new ludown.helperClasses.Exception(err);
            console.error('Oops, invalid LUIS content!\n');
            console.error(exception.errCode + ' : ' + exception.text);
        })
    }

}

parseContent();

```

## Translating lu files

You can take advantage of the [Microsoft text translation API](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/) to automatically machine translate .lu files to one or more than [60+ languages](https://aka.ms/translate-langs) supported by the Microsoft text translation cognitive service.

To translate lu file content, you can simply use the parseAndTranslate() method. Here's a code snippet.

```js
const ludown = require('@microsoft/bf-lu');
const luContent = `# Greeting
- hi
$userName:first=
-vishwac`;
const log = false;
const targetLanguage = 'de';
const subscriptionKey = '<YOUR TEXT TRANSLATION KEY>';
const translateComments = true;
const translateLinkText = true;
ludown.translate.parseAndTranslate(luContent, subscriptionKey, targetLanguage, '', translateComments, translateLinkText, log)
    .then(function(result) {
        console.log(result);
    })
    .catch(function(err){
        let exception = new ludown.helperClasses.Exception(err);
        console.error(exception.errCode + ' : ' + exception.text);
    })

```


# V2 API

## Parsing lu files
To parse LU files, you can use the LUISBuilder class, which returns a LUIS class

```js
const Luis = require('@microsoft/bf-lu').Luis
const LUISBuilder = require('@microsoft/bf-lu').LuisBuilder
const luContent1 = `# Greeting
- hi`;

const luisObject = await LUISBuilder.buildFromLUContent(luContent1)

// Parsed LUIS object
console.log(JSON.stringify(luisObject, 2, null));
        
```

## Validating parsed lu files

You can use the available validate() function to verify if the parsed LUIS object is valid. This helps catch name conflicts, invalid labelled utterances etc. 

```js
const LUISBuilder = require('@microsoft/bf-lu').LuisBuilder
const exception = require('@microsoft/bf-lu').Exception
const luContent = `# Greeting
- hi {userName=bob}
$userName:first=
-vishwac`;

async function parseContent() {
    try {   
        const luisObject = await LUISBuilder.buildFromLUContent(luContent)
        luisObject.validate()
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

## Generating lu content from LUIS JSON

You can generate lu content from LUIS instance using parseToLuContent() method. Here's an example code snippet. 

```js
const LUISBuilder = require('@microsoft/bf-lu').LuisBuilder
const exception = require('@microsoft/bf-lu').Exception
const luContent = `# Greeting
- hi
$userName:first=
-vishwac`;
const log = false;
const locale = 'en-us';
async function parseContent() {

    try {   
        const luisObject = await LUISBuilder.buildFromLUContent(luContent)
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
const ludown = require('@microsoft/bf-lu');
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