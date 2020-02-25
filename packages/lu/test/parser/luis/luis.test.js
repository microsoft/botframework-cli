const LUISBuilder = require('./../../../src/parser/luis/luisBuilder')
var chai = require('chai');
var assert = chai.assert;

xdescribe('Luis Instance', function() {
    it('Parse to LU instance', async () => {
        let luFile = `
        @ ml test
        # test
        - this is a {@test = one}
        `;

        let result = `
> LUIS application information
> !# @app.versionId = 0.1
> !# @app.culture = en-us
> !# @app.luis_schema_version = 3.2.0


> # Intent definitions

## test
- this is a {@test=one}


> # Entity definitions

@ ml test


> # PREBUILT Entity definitions


> # Phrase list definitions


> # List entities

> # RegEx entities


`
        const luisObject = await LUISBuilder.buildFromLUContent(luFile)
        const newLU = luisObject.parseToLU()
        assert.equal(newLU.content, result); 
    });
});