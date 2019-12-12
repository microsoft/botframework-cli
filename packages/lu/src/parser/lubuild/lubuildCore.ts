import {LUISConfig, Content, DialogFileContent} from './lubuildClasses'
import { parser } from './../index';
import * as msRest from '@azure/ms-rest-js';
import * as path from 'path';
import { LuisAuthoring } from 'luis-apis';
import { LuisRecognizer } from './LuisRecognizer';
import { MultiLanguageRecognizer } from './MultiLanguageRecognizer';
import { LuisSettings } from './LuisSettings';
import { AppsAddResponse, AppsGetResponse, AzureClouds, AzureRegions, LuisApp } from 'luis-apis/typings/lib/models';
import { isEqual } from 'lodash'
const delay = require('await-delay');

export class LuBuildCore {
    public static async CreateOrUpdateApplication(luConfig: LUISConfig)
        : Promise<{recognizers: LuisRecognizer[], multiRecognizer: MultiLanguageRecognizer, luisSettings: LuisSettings}> {
        let credentials = new msRest.ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": luConfig.AuthoringKey } });
        const client = new LuisAuthoring(<any>credentials, {});
        const luContents = luConfig.LuContents;

        let apps = await client.apps.list(<AzureRegions>luConfig.AuthoringRegion, <AzureClouds>"com");

        // new settings
        let existingLuisSettings = JSON.parse(luConfig.LuisSettingsContent.Content).luis;
        let luisSettings = new LuisSettings(luConfig.LuisSettingsContent.Path, existingLuisSettings);

        // new multi language recognizer
        let existingMultiRecognizers = JSON.parse(luConfig.MultiLangRecognizerContent.Content).recognizers;
        let multiRecognizer = new MultiLanguageRecognizer(luConfig.MultiLangRecognizerContent.Path, existingMultiRecognizers);

        // new luis recognizer
        let recognizers: LuisRecognizer[] = [];

        for (const content of luContents) {
            let locale = content.Locale || luConfig.Culture;
            let appName: string = '';

            const response = await parser.parseFile(content.Content, false, locale);
            await parser.validateLUISBlob(response.LUISJsonStructure);
            let parsedLUISObj = <LuisApp>response.LUISJsonStructure;
            locale = parsedLUISObj.culture && parsedLUISObj.culture !== '' ? parsedLUISObj.culture : locale;
            appName = parsedLUISObj.name && parsedLUISObj.name !== '' ? parsedLUISObj.name : appName;

            if (appName === '') {
                appName = `${luConfig.BotName}(${luConfig.EnvironmentName})-${content.Name}`;
            }

            let dialogFile = path.join(path.dirname(content.Path), `${content.Name}.dialog`);
            let recognizer = await LuisRecognizer.load(content.Path, content.Name, dialogFile);

            for (let app of apps) {
                if (app.name === appName) {
                    recognizer.setAppId(<string>app.id);
                    break;
                }
            }

            // add to multiLanguageRecognizer
            multiRecognizer.recognizers[locale] = path.basename(dialogFile, '.dialog');
            if (locale.toLowerCase() === luConfig.FallBackLocale.toLowerCase()) {
                multiRecognizer.recognizers[''] = path.basename(dialogFile, '.dialog');
            }

            let appInfo: AppsGetResponse;
            try {
                appInfo = await client.apps.get(<AzureRegions>luConfig.AuthoringRegion, <AzureClouds>"com", recognizer.getAppId());
                recognizer.versionId = <string>appInfo.activeVersion;
                
                // compare and train model
                let training = await this.updateApplication(parsedLUISObj, luConfig, client, recognizer, appInfo);
                
                // publish model
                if (training) {
                    await this.publishApplication(luConfig, client, recognizer);
                }

            } catch (err) {
                // create the application with version 0.1
                await this.createApplication(parsedLUISObj, luConfig, client, recognizer, appName, locale);

                this.publishApplication(luConfig, client, recognizer);
            }
          
            luisSettings.luis[content.Name.split('.').join('_')] = recognizer.getAppId();
            recognizers.push(recognizer);
        }

        return { recognizers, multiRecognizer, luisSettings };
    }

    public static GenerateDeclarativeAssets(luisRecognizers: Array<LuisRecognizer>, multiRecognizer: MultiLanguageRecognizer, luisSettings: LuisSettings)
        : DialogFileContent {
        let contents = new Array<Content>();
        for (const recognizer of luisRecognizers) {
            let content = new Content(
                path.basename(recognizer.getDialogPath()),
                recognizer.getDialogPath(),
                recognizer.save());
            
            contents.push(content);
        }

        const multiLangContent = new Content(
            path.basename(multiRecognizer.getDialogPath()),
            multiRecognizer.getDialogPath(),
            multiRecognizer.save());

        contents.push(multiLangContent);

        const luisSettingsContent = new Content(
            path.basename(luisSettings.getSettingsPath()),
            luisSettings.getSettingsPath(),
            luisSettings.save());

        contents.push(luisSettingsContent);

        let dialogFileContent = new DialogFileContent(contents);

        return dialogFileContent;
    }

    private static async createApplication(currentApp: LuisApp, config: LUISConfig, client: LuisAuthoring, recognizer: LuisRecognizer, name: string, culture: string): Promise<boolean> {
        console.log(`creating LUIS.ai application: ${name} version:0.1`);
        currentApp.name = name;
        currentApp.desc = currentApp.desc && currentApp.desc !== '' ? currentApp.desc : `Model for ${config.BotName} app, targetting ${config.EnvironmentName}`;
        currentApp.culture = culture;
        currentApp.versionId = "0.1";
        recognizer.versionId = "0.1";

        let response = await client.apps.importMethod(<AzureRegions>config.AuthoringRegion, <AzureClouds>"com", currentApp, { appName: name });

        recognizer.setAppId(response.body);

        await delay(500);

        // train the version
        await client.train.trainVersion(<AzureRegions>config.AuthoringRegion, <AzureClouds>"com", recognizer.getAppId(), currentApp.versionId);

        await delay(500);
        return true;
    }

    private static async updateApplication(currentApp: LuisApp, config: LUISConfig, client: LuisAuthoring, recognizer: LuisRecognizer, appInfo: AppsGetResponse): Promise<boolean> {
        // get existing app
        const response = await client.versions.exportMethod(<AzureRegions>config.AuthoringRegion, <AzureClouds>"com", recognizer.getAppId(), recognizer.versionId);
        const existingApp: LuisApp = response._response.parsedBody;
        currentApp.desc = currentApp.desc && currentApp.desc !== '' && currentApp.desc !== existingApp.desc ? currentApp.desc : existingApp.desc;
        currentApp.culture = currentApp.culture && currentApp.culture !== '' && currentApp.culture !== existingApp.culture ? currentApp.culture : existingApp.culture;
        currentApp.versionId = currentApp.versionId && currentApp.versionId !== '' && currentApp.versionId !== existingApp.versionId ? currentApp.versionId : existingApp.versionId;

        if (!this.isApplicationEqual(currentApp, existingApp)) {
            let newVersionId: string;
            if (currentApp.versionId && currentApp.versionId != '') {
                newVersionId = currentApp.versionId;
            } else {
                newVersionId = this.updateVersion(<string>appInfo.activeVersion).toString();
            }

            currentApp.versionId = newVersionId;
            recognizer.versionId = newVersionId;

            await client.versions.importMethod(<AzureRegions>config.AuthoringRegion, <AzureClouds>"com", recognizer.getAppId(), currentApp, { versionId: newVersionId });
            // console.log(JSON.stringify(importResult.body));
            await delay(500);

            // train the version
            await client.train.trainVersion(<AzureRegions>config.AuthoringRegion, <AzureClouds>"com", recognizer.getAppId(), newVersionId);

            await delay(500);
            return true;
        } else {
            console.log(`Luis application ${appInfo.name} has no changes`);
            return false;
        }
    }

    private static async publishApplication(config: LUISConfig, client: LuisAuthoring, recognizer: LuisRecognizer): Promise<void> {    
        process.stdout.write(`${recognizer.getLuPath()} waiting for training for version=${recognizer.versionId}...`);
        let done = true;
        do {
            await delay(5000);
            await process.stdout.write('.');
            let trainingStatus = await client.train.getStatus(<AzureRegions>config.AuthoringRegion, <AzureClouds>"com", recognizer.getAppId(), <string>recognizer.versionId);
    
            done = true;
            for (let status of trainingStatus) {
                if (status.details) {
                    if (status.details.status == 'InProgress') {
                        done = false;
                        break;
                    }
                }
            }
        } while (!done);
        process.stdout.write('done\n');
    
        // publish the version
        console.log(`${recognizer.getLuPath()} publishing version=${recognizer.versionId}`);
        await client.apps.publish(<AzureRegions>config.AuthoringRegion, <AzureClouds>"com", recognizer.getAppId(),
            {
                "versionId": <string>recognizer.versionId,
                "isStaging": false
            });
    
        console.log(`${recognizer.getLuPath()} finished`);
    }

    private static updateVersion(versionId: string) {
        let numberVersionId = parseFloat(versionId);
        if (isNaN(numberVersionId)) {
            const index = versionId.lastIndexOf('-');
            if (index > 0) {
                const strVersion = versionId.substring(0, index);
                const numberVersion = versionId.substring(index + 1);
                numberVersionId = parseFloat(numberVersion);
                if (isNaN(numberVersionId)) {
                    return versionId;
                } else {
                    const newVersionId = numberVersionId + 0.1;

                    return strVersion + '-' + newVersionId;
                }
            } else {
                return versionId + '-0.1';
            }
        } else {
            return numberVersionId + 0.1;
        }
    }

    private static isApplicationEqual(appA: LuisApp, appB: LuisApp): boolean {
        let equal = true;
        equal = equal && isEqual(appA.desc, appB.desc);
        equal = equal && isEqual(appA.versionId, appB.versionId);
        equal = equal && isEqual(appA.culture, appB.culture);
        equal = equal && isEqual(JSON.stringify(appA.closedLists), JSON.stringify(appB.closedLists));
        equal = equal && isEqual(JSON.stringify(appA.composites), JSON.stringify(appB.composites));
        equal = equal && isEqual(JSON.stringify(appA.entities), JSON.stringify(appB.entities));
        equal = equal && isEqual(JSON.stringify(appA.modelFeatures), JSON.stringify(appB.modelFeatures));
        equal = equal && isEqual(JSON.stringify(appA.patternAnyEntities), JSON.stringify(appB.patternAnyEntities));
        equal = equal && isEqual(JSON.stringify(appA.patterns), JSON.stringify(appB.patterns));
        equal = equal && isEqual(JSON.stringify(appA.prebuiltEntities), JSON.stringify(appB.prebuiltEntities));
        equal = equal && isEqual(JSON.stringify(appA.regexEntities), JSON.stringify(appB.regexEntities));
        equal = equal && isEqual(JSON.stringify(appA.regexFeatures), JSON.stringify(appB.regexFeatures));
        equal = equal && isEqual(JSON.stringify(appA.utterances), JSON.stringify(appB.utterances));

        // handle exception for none intent which is default added in luis portal
        if (equal) {
            if (appA.intents && !appA.intents.some(x => x.name === 'None')) {
                const appBWithoutNoneIntent = (<any[]>appB.intents).filter(x => x.name !== 'None');
                equal = equal && isEqual(JSON.stringify(appA.intents), JSON.stringify(appBWithoutNoneIntent));
            } else {
                equal = equal && isEqual(JSON.stringify(appA.intents), JSON.stringify(appB.intents));
            }
        }

        return equal;
    }
};