import {LUISConfig, Content, DialogFileContent} from './types'
import { parser } from '../index';
import { LuisAuthoring } from 'luis-apis';
import { LuisRecognizer } from './luisRecognizer';
import { MultiLanguageRecognizer } from './multiLanguageRecognizer';
import { LuisSettings } from './luisSettings';
import { AppsGetResponse, AzureClouds, AzureRegions, LuisApp } from 'luis-apis/typings/lib/models';
import { isEqual, differenceWith } from 'lodash'
import * as msRest from '@azure/ms-rest-js';
import * as path from 'path';

export class LuBuildCore {
    public static async CreateOrUpdateApplication(luConfig: LUISConfig)
        : Promise<{recognizers: LuisRecognizer[], multiRecognizer: MultiLanguageRecognizer, luisSettings: LuisSettings}> {
        let credentials = new msRest.ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": luConfig.AuthoringKey } });
        const client = new LuisAuthoring(<any>credentials, {});
        const luContents = luConfig.LuContents;

        let apps = await client.apps.list(<AzureRegions>luConfig.Region, <AzureClouds>"com");

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
                appName = `${luConfig.BotName}(${luConfig.Suffix})-${content.Name}`;
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

            if (recognizer.getAppId() !== '') {
                let appInfo = await client.apps.get(<AzureRegions>luConfig.Region, <AzureClouds>"com", recognizer.getAppId());
                recognizer.versionId = <string>appInfo.activeVersion;
                
                // compare and train model
                let training = await this.updateApplication(parsedLUISObj, luConfig, client, recognizer, appInfo);
                
                // publish model
                if (training) {
                    await this.publishApplication(luConfig, client, recognizer);
                }

            } else {
                // create the application with version 0.1
                await this.createApplication(parsedLUISObj, luConfig, client, recognizer, appName, locale);

                await this.publishApplication(luConfig, client, recognizer);
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
        process.stdout.write(`Creating LUIS.ai application: ${name} version:0.1\n`);
        currentApp.name = name;
        currentApp.desc = currentApp.desc && currentApp.desc !== '' ? currentApp.desc : `Model for ${config.BotName} app, targetting ${config.Suffix}`;
        currentApp.culture = culture;
        currentApp.versionId = "0.1";
        recognizer.versionId = "0.1";

        let response = await client.apps.importMethod(<AzureRegions>config.Region, <AzureClouds>"com", currentApp);

        recognizer.setAppId(response.body);

        // train the version
        await client.train.trainVersion(<AzureRegions>config.Region, <AzureClouds>"com", recognizer.getAppId(), currentApp.versionId);

        return true;
    }

    private static async updateApplication(currentApp: LuisApp, config: LUISConfig, client: LuisAuthoring, recognizer: LuisRecognizer, appInfo: AppsGetResponse): Promise<boolean> {
        // get existing app
        const response = await client.versions.exportMethod(<AzureRegions>config.Region, <AzureClouds>"com", recognizer.getAppId(), recognizer.versionId);
        const existingApp: LuisApp = response._response.parsedBody;
        currentApp.desc = currentApp.desc && currentApp.desc !== '' && currentApp.desc !== existingApp.desc ? currentApp.desc : existingApp.desc;
        currentApp.culture = currentApp.culture && currentApp.culture !== '' && currentApp.culture !== existingApp.culture ? currentApp.culture : existingApp.culture;
        currentApp.versionId = currentApp.versionId && currentApp.versionId !== '' && currentApp.versionId !== existingApp.versionId ? currentApp.versionId : existingApp.versionId;
        
        // convert utterance text from lu file to lower case
        // as utterances from luis api are all converted to lower case automatically
        (currentApp.utterances || []).forEach((u: any) => {
            u.text = u.text.toLowerCase();
        });

        currentApp.name = existingApp.name;

        if (!this.isApplicationEqual(currentApp, existingApp)) {
            let newVersionId: string;
            if (currentApp.versionId && currentApp.versionId !== existingApp.versionId) {
                newVersionId = currentApp.versionId;
            } else {
                newVersionId = this.updateVersion(<string>existingApp.versionId);
            }

            currentApp.versionId = newVersionId;
            recognizer.versionId = newVersionId;

            const options: any = {};
            options.versionId = newVersionId;
            process.stdout.write(`${recognizer.getLuPath()} creating version=${newVersionId}\n`);
            await client.versions.importMethod(<AzureRegions>config.Region, <AzureClouds>"com", recognizer.getAppId(), currentApp, options);

            // train the version
            process.stdout.write(`${recognizer.getLuPath()} training version=${newVersionId}\n`);
            await client.train.trainVersion(<AzureRegions>config.Region, <AzureClouds>"com", recognizer.getAppId(), newVersionId);

            return true;
        } else {
            process.stdout.write(`${recognizer.getLuPath()} no changes\n`);
            return false;
        }
    }

    private static async publishApplication(config: LUISConfig, client: LuisAuthoring, recognizer: LuisRecognizer): Promise<void> {    
        process.stdout.write(`${recognizer.getLuPath()} waiting for training for version=${recognizer.versionId}...`);
        let done = true;
        do {
            await process.stdout.write('.');
            let trainingStatus = await client.train.getStatus(<AzureRegions>config.Region, <AzureClouds>"com", recognizer.getAppId(), <string>recognizer.versionId);
    
            done = true;
            for (let status of trainingStatus) {
                if (status.details) {
                    if (status.details.status === 'InProgress') {
                        done = false;
                        break;
                    }
                }
            }
        } while (!done);
        process.stdout.write('done\n');
    
        // publish the version
        process.stdout.write(`${recognizer.getLuPath()} publishing version=${recognizer.versionId}\n`);
        await client.apps.publish(<AzureRegions>config.Region, <AzureClouds>"com", recognizer.getAppId(),
            {
                "versionId": <string>recognizer.versionId,
                "isStaging": false
            });
    
        process.stdout.write(`${recognizer.getLuPath()} finished\n`);
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

                    return strVersion + '-' + newVersionId.toFixed(1);
                }
            } else {
                return versionId + '-0.1';
            }
        } else {
            return (numberVersionId + 0.1).toFixed(1);
        }
    }

    private static isApplicationEqual(appA: LuisApp, appB: LuisApp): boolean {
        let equal = true;
        equal = equal && isEqual(appA.desc, appB.desc);
        equal = equal && isEqual(appA.versionId, appB.versionId);
        equal = equal && isEqual(appA.culture, appB.culture);
        equal = equal && this.isArrayEqual(appA.closedLists, appB.closedLists);
        equal = equal && this.isArrayEqual(appA.composites, appB.composites);
        equal = equal && this.isArrayEqual(appA.entities, appB.entities);
        equal = equal && this.isArrayEqual(appA.modelFeatures, appB.modelFeatures);
        equal = equal && this.isArrayEqual(appA.patternAnyEntities, appB.patternAnyEntities);
        equal = equal && this.isArrayEqual(appA.patterns, appB.patterns);
        equal = equal && this.isArrayEqual(appA.prebuiltEntities, appB.prebuiltEntities);
        equal = equal && this.isArrayEqual(appA.regexEntities, appB.regexEntities);
        equal = equal && this.isArrayEqual(appA.regexFeatures, appB.regexFeatures);
        equal = equal && this.isArrayEqual(appA.utterances, appB.utterances);

        // handle exception for none intent which is default added in luis portal
        if (equal) {
            if (appA.intents && !appA.intents.some(x => x.name === 'None')) {
                const appBWithoutNoneIntent = (<any[]>appB.intents).filter(x => x.name !== 'None');
                equal = equal && this.isArrayEqual(appA.intents, appBWithoutNoneIntent);
            } else {
                equal = equal && this.isArrayEqual(appA.intents, appB.intents);
            }
        }

        return equal;
    }

    // compare object arrays
    private static isArrayEqual(x: any, y: any) {
        let xObj = [];
        let yObj = [];

        if (x && x.length > 0) {
            xObj = JSON.parse(JSON.stringify(x));
        }

        if (y && y.length > 0) {
            yObj = JSON.parse(JSON.stringify(y));
        }

        return differenceWith(xObj, yObj, isEqual).length === 0;
      };
};