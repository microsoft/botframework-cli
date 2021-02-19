const LUISBuilder = require('./../../../src/parser/luis/luisBuilder')
const LU = require('./../../../src/parser/lu/lu')
var chai = require('chai');
const luisobjenum = require('../../../src/parser/utils/enums/luisobjenum');
var assert = chai.assert;

describe('LUISBuilder', function() {
    it('Build app from LU content', async() => {
        let luContent1 = `# Greeting
- hi`;

        const luisObject = await LUISBuilder.fromLUAsync(luContent1)
        assert.equal(luisObject.intents.length, 1)
    })
    it('Validate test', async() => {
        let luContent = `# Greeting
        - hi`;

const luisObject = await LUISBuilder.fromLUAsync(luContent)
luisObject.intents[0].name = "testIntent123456789012345678901234567890123"
assert.isTrue(luisObject.validate())
    })
    it('Build luis app from LU content', async () => {
        let luFile = `
        @ ml test
        # test
        - this is a {@test = one}
        `;
        const luisObject = await LUISBuilder.fromContentAsync(luFile)
        assert.equal(luisObject.entities.length, 1);
        assert.equal(luisObject.entities[0].name, 'test');
        assert.equal(luisObject.utterances.length, 1);
        assert.equal(luisObject.utterances[0].entities.length, 1);
        assert.equal(luisObject.utterances[0].entities[0].entity, 'test');   
    });

    it('Build luis app from LU Object', async () => {
        let luFile = `
        @ ml test
        # test
        - this is a {@test = one}
        `;
        const luObject = new LU(luFile, '')
        const luisObject = await LUISBuilder.fromLUAsync([luObject])
        assert.equal(luisObject.entities.length, 1);
        assert.equal(luisObject.entities[0].name, 'test');
        assert.equal(luisObject.utterances.length, 1);
        assert.equal(luisObject.utterances[0].entities.length, 1);
        assert.equal(luisObject.utterances[0].entities[0].entity, 'test');   
    });

    it('Build luis app from LU Object List and collate them', async () => {
        let testLU1 = `$userName:simple role=firstName`;
        let testLU2 = `$userName:simple role=lastName`;
        const luObject1 = new LU(testLU1)
        const luObject2 = new LU(testLU2)
        const luisObject = await LUISBuilder.fromLUAsync([luObject1, luObject2])
        assert.equal(luisObject.entities.length, 1);
        assert.equal(luisObject.entities[0].roles.length, 2);
        assert.deepEqual(luisObject.entities[0].roles, ['firstName', 'lastName']);
    });

    it('PL with enabledForAllModels = false is handled correctly', async () => {
        let testJSON = require('../../fixtures/testcases/plFeatureDisabled.json');
        const luisObject = LUISBuilder.fromJson(testJSON).parseToLU();
        assert.equal(luisObject.content.includes('disabledForAllModels'), true);
    })

    it('Overlapping entities are converted to LU correctly', async () => {
        let testJSON = require('../../fixtures/testcases/overlappingEntities.json');
        const luisObject = LUISBuilder.fromJson(testJSON).parseToLU();
        assert.equal(luisObject.content.includes(`- {@add=add {@globalCount={@count={@countNumber=two} apples}}}`), true);
    })

    it('Intent name with spaces are handled correctly with feature assignment', async () => {
        let testJSON = require('../../fixtures/testcases/intentWithSpace.json');
        const luisObject = LUISBuilder.fromJson(testJSON).parseToLU();
        assert.equal(luisObject.content.includes(`@ intent "test intent" usesFeature bar`), true);
    })

    it('App settings can be merged correctly when importing lu files', async () => {
        let luFile = `
        > !# @app.culture = zh-cn
        > !# @app.settings.NormalizeWordForm = true
        > !# @app.settings.UseAllTrainingData = true
        
        [import greeting](./test/fixtures/testcases/collate/1.lu)`;

        const luisObject = await LUISBuilder.fromLUAsync(luFile)

        assert.equal(luisObject.intents[0].name, 'Greeting');
        assert.equal(luisObject.culture, 'zh-cn');
        assert.equal(luisObject.settings.length, 2);
        assert.equal(luisObject.settings[0].name, 'NormalizeWordForm');
        assert.equal(luisObject.settings[0].value, true);
        assert.equal(luisObject.settings[1].name, 'UseAllTrainingData');
        assert.equal(luisObject.settings[1].value, true);
    });

    it('Intent import can work correctly when imported lu files also have further imports', async () => {
        let luFile = `
        # Test
        - [MyIntent](./test/fixtures/testcases/root.en-us.lu#MyIntent)`;

        const luisObject = await LUISBuilder.fromLUAsync(luFile)

        assert.equal(luisObject.intents.length, 1);
        assert.equal(luisObject.intents[0].name, 'Test');
        assert.equal(luisObject.utterances.length, 2);
        assert.equal(luisObject.utterances[0].text, 'test 1');
        assert.equal(luisObject.utterances[1].text, 'test 2');
    });
});