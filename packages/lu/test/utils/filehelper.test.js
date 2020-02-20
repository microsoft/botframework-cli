import {readTextFile} from './../../src/utils/textfilereader'
const expect = require('chai').expect;   
const fileHelper = require('./../../src/utils/filehelper')
const luObject = require('./../../src/parser/lu/lu')
const path = require('path')

describe('utils/filehelper test', () => {
    it('File helper correctly  builds a luObject list from a file', async function(){
            let expected = []
            let pathToFile = path.resolve(path.join(__dirname, './../fixtures/file.lu'))
            let content = await readTextFile(pathToFile)
            expected.push(new luObject(content, pathToFile))
            let luObjArray = await fileHelper.getLuObjects('', pathToFile)
            expect(luObjArray).to.deep.equal(expected)
    })

    it('File helper correctly  builds a luObject list from stdin', async function(){
            let content = `> Definition for greeting intent
            # Greeting
            - Hi
            - Hello
            > users might say these
            - Good morning 
            - Good evening`
            let luObjArray = await fileHelper.getLuObjects(content, '')
            let expected = []
            expected.push(new luObject(content, 'stdin'))
            expect(luObjArray).to.deep.equal(expected)
    })

    it('File helper correctly build a triggerIntent to dialog mapping dict', async function(){
        try{
            let pathToFile = path.resolve(__dirname, './../fixtures/testcases/interuption/intent_to_lu.json')
            let configObject = await fileHelper.getConfigObject(pathToFile)
            let configObjKeys = Object.keys(configObject)
            expect(configObjKeys.length).to.deep.equals(3)
            expect(configObject[configObjKeys[1]][path.resolve(path.dirname(pathToFile), './dia4/dia4.lu')]).to.deep.equals('dia4_trigger')
            expect(configObject[configObjKeys[2]][path.resolve(path.dirname(pathToFile), './dia2/dia2.fr-fr.lu')]).to.deep.equals('dia2_trigger')

            pathToFile = path.resolve(__dirname, './../fixtures/testcases/interuption2')
            configObject = await fileHelper.getConfigObject(pathToFile)
            configObjKeys = Object.keys(configObject)
            expect(configObjKeys.length).to.deep.equals(2)
            expect(configObject[configObjKeys[0]][path.resolve(pathToFile, './dia1/dia1.lu')]).to.deep.equals('dia1_trigger')
            expect(configObject[configObjKeys[1]][path.resolve(pathToFile, './dia3/dia3.lu')]).to.deep.equals('dia3_trigger')
        }catch(err){
            console.log(err)
        }
    })
})