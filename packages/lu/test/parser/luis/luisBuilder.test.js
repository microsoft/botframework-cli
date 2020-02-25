const LUISBuilder = require('./../../../src/parser/luis/luisBuilder')
const Luis = require('./../../../src/parser/luis/luis')
const LU = require('./../../../src/parser/lu/lu')
var chai = require('chai');
var assert = chai.assert;

describe('LUISBuilder', function() {
    it('Build luis app from LU content', async () => {
        let luFile = `
        @ ml test
        # test
        - this is a {@test = one}
        `;
        const luisObject = await LUISBuilder.buildFromLUContent(luFile)
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
        const luisObject = await LUISBuilder.buildFromLU(luObject)

        assert.equal(luisObject.entities.length, 1);
        assert.equal(luisObject.entities[0].name, 'test');
        assert.equal(luisObject.utterances.length, 1);
        assert.equal(luisObject.utterances[0].entities.length, 1);
        assert.equal(luisObject.utterances[0].entities[0].entity, 'test');   
    });

    it('Build luis app from LU Object List and collate them', async () => {
        let testLU1 = `$userName:simple role=firstName`;
        let testLU2 = `$userName:simple role=lastName`;
        const luObject1 = new LU(testLU1, '1')
        const luObject2 = new LU(testLU2, '2')
        const luisObject = await LUISBuilder.buildFromLUList([luObject1, luObject2])
        assert.equal(luisObject.entities.length, 1);
        assert.equal(luisObject.entities[0].roles.length, 2);
        assert.deepEqual(luisObject.entities[0].roles, ['firstName', 'lastName']);
    });
});