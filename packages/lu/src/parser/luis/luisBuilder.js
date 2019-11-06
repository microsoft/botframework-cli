const mergeLuFiles = require('./../lu/luMerger').Build
const Luis = require('./luis')

class LuisBuilder {
    static async build(luArray, verbose, luis_culture, luSearchFn) {
        let mergedContent = await mergeLuFiles(luArray, verbose, luis_culture, luSearchFn)
        let parsedLUISList = mergedContent.LUISContent.filter(item => item.includeInCollate)
        let result = new Luis();
        if (parsedLUISList.length === 0) return result
        let luisList = []
        parsedLUISList.forEach(i => {
            luisList.push(i.LUISJsonStructure)
        });
        result.collate(luisList)
        return result
    }
}

module.exports = LuisBuilder

