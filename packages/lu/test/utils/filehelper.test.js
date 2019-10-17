const utils = require('@microsoft/bf-cli-command').utils
const expect = require('chai').expect;   
const fileHelper = require('./../../src/utils/filehelper')
const luObject = require('./../../src/parser/lufile/classes/luObject')
const fs = require('fs-extra')
const path = require('path')

describe('utils/filehelper test', () => {
    it('File helper correctly  builds a luObject list from a file', async function(){
        try{
            let expected = []
            let pathToFile = path.resolve(path.join(__dirname, './../fixtures/file.lu'))
            let content = await utils.readTextFile(pathToFile)
            expected.push(new luObject(pathToFile, content))
            let luObjArray = await fileHelper.getLuObjects('', pathToFile)
            expect(luObjArray).to.deep.equal(expected)
        }catch(err){
            console.log(err)
        }

    })

    it('File helper correctly  builds a luObject list from stdin', async function(){
        try{
            let content = `> Definition for greeting intent
            # Greeting
            - Hi
            - Hello
            > users might say these
            - Good morning 
            - Good evening`
            let luObjArray = await fileHelper.getLuObjects(content, '')
            let expected = []
            expected.push(new luObject('stdin', content))
            expect(luObjArray).to.deep.equal(expected)
        }catch(err){
            console.log(err)
        }
    })
})