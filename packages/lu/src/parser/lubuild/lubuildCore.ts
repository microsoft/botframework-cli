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
        let luisSettings = new LuisSettings(luConfig.LuisSettingsPath);

        // new multi language recognizer
        let multiRecognizer = new MultiLanguageRecognizer(luConfig.MultiLangRecognizerDialogPath);

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
                if (app.name == appName) {
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
            let newApp: boolean = false;
            try {
                appInfo = await client.apps.get(<AzureRegions>luConfig.AuthoringRegion, <AzureClouds>"com", recognizer.getAppId());

            } catch (err) {
                // create the application
                await this.createApplication(appName, client, luConfig, locale, recognizer);

                appInfo = await client.apps.get(<AzureRegions>luConfig.AuthoringRegion, <AzureClouds>"com", recognizer.getAppId());
                newApp = true;
            }

            if (appInfo.activeVersion) {
                recognizer.versionId = appInfo.activeVersion;
            }

            // update model
            let training = await this.updateModel(content, luConfig, client, recognizer, appInfo, newApp);
            if (training) {
                await this.publishModel(luConfig, client, recognizer);
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

    private static async createApplication(name: string, client: LuisAuthoring, config: LUISConfig, culture: string, recognizer: LuisRecognizer): Promise<AppsAddResponse> {
        console.log(`creating LUIS.ai application: ${name} version:0.1`);
        let response = await client.apps.add(<AzureRegions>config.AuthoringRegion, <AzureClouds>"com", {
            "name": name,
            "description": `Model for ${config.BotName} app, targetting ${config.EnvironmentName}`,
            "culture": culture,
            "usageScenario": "",
            "domain": "",
            "initialVersionId": "0.1"
        }, {});
        recognizer.setAppId(response.body);
        await delay(500);
        return response;
    }

    private static async updateModel(currentApp: LuisApp, config: LUISConfig, client: LuisAuthoring, recognizer: LuisRecognizer, appInfo: AppsGetResponse, newApp: boolean): Promise<boolean> {      
        // if new created app, then update
        if (newApp) {
            currentApp.name = appInfo.name;
            currentApp.desc = appInfo.description;
            currentApp.culture = appInfo.culture;
            currentApp.versionId = <string>appInfo.activeVersion;
    
            // import new version
            await client.versions.importMethod(<AzureRegions>config.AuthoringRegion, <AzureClouds>"com", <string>appInfo.id, currentApp, { versionId: currentApp.versionId });
            // console.log(JSON.stringify(importResult.body));
            await delay(500);
    
            // train the version
            await client.train.trainVersion(<AzureRegions>config.AuthoringRegion, <AzureClouds>"com", <string>appInfo.id, currentApp.versionId);
    
            await delay(500);
            return true;
        } else {
            // get existing app
            const response = await client.versions.exportMethod(<AzureRegions>config.AuthoringRegion, <AzureClouds>"com", <string>appInfo.id, <string>appInfo.activeVersion);
            const existingApp: LuisApp = response.parsedBody;

            if (isEqual(currentApp, existingApp)) {
                let newVersionId: string;
                if (currentApp.versionId && currentApp.versionId != '') {
                    newVersionId = currentApp.versionId;
                } else {
                    newVersionId = this.updateVersion(<string>appInfo.activeVersion).toString();
                }

                currentApp.versionId = newVersionId;
                recognizer.versionId = newVersionId;

                await client.versions.importMethod(<AzureRegions>config.AuthoringRegion, <AzureClouds>"com", <string>appInfo.id, currentApp, { versionId: newVersionId });
                // console.log(JSON.stringify(importResult.body));
                await delay(500);

                // train the version
                await client.train.trainVersion(<AzureRegions>config.AuthoringRegion, <AzureClouds>"com", <string>appInfo.id, newVersionId);

                await delay(500);
                return true;
            } else {
                console.log(`Luis application ${appInfo.name} has no changes`);
                return false;
            }
        }
    }

    private static async publishModel(config: LUISConfig, client: LuisAuthoring, recognizer: LuisRecognizer): Promise<void> {    
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
};