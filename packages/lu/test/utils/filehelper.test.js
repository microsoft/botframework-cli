import {readTextFile} from './../../src/utils/textfilereader'
const expect = require('chai').expect;   
const fileHelper = require('./../../src/utils/filehelper')
const luObject = require('./../../src/parser/lu/lu')
const luOptions = require('./../../src/parser/lu/luOptions')
const path = require('path')

describe('utils/filehelper test', () => {
    it('File helper correctly  builds a luObject list from a file', async function(){
            let expected = []
            let pathToFile = path.resolve(path.join(__dirname, './../fixtures/file.lu'))
            let content = await readTextFile(pathToFile)
            expected.push(new luObject(content, new luOptions(pathToFile)))
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
            expected.push(new luObject(content, new luOptions('stdin')))
            expect(luObjArray).to.deep.equal(expected)
    })
})