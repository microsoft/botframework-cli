const Alterations = require('./alterations')
const mergeLuFiles = require('./../../lu/luMerger').Build

class AlterationsBuilder{
    static async build(luArray, verbose, luis_culture, luSearchFn) {
        let mergedContent = await mergeLuFiles(luArray, verbose, luis_culture, luSearchFn)
        let allParsedQnAAlterations = mergedContent.QnAAlterations.filter(item => item.includeInCollate)

        let finalQnAAlterationsList = new Alterations()
        allParsedQnAAlterations.forEach(function (alterationList) {
            alterationList = alterationList.qnaAlterations;
            if (alterationList.wordAlterations) {
                alterationList.wordAlterations.forEach(function (alteration) {
                    finalQnAAlterationsList.wordAlterations.push(alteration);
                })
            }
        })
        return finalQnAAlterationsList;
    }
}

module.exports = AlterationsBuilder