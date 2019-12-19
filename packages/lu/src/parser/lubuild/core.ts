import {LUISConfig, Content, DialogFileContent} from './types'
import { parser } from '../index';
import { LuisRecognizer } from './luisRecognizer';
import { MultiLanguageRecognizer } from './multiLanguageRecognizer';
import { LuisSettings } from './luisSettings';
import { isEqual, differenceWith } from 'lodash'
import * as path from 'path';
const luisUtils = require('@microsoft/bf-luis-cli/lib/utils/index');

export class LuBuildCore {
    public static async CreateOrUpdateApplication(luConfig: LUISConfig)
        : Promise<{recognizers: LuisRecognizer[], multiRecognizer: MultiLanguageRecognizer, luisSettings: LuisSettings}> {
        
        // new luis api client
        const client = luisUtils.getLUISClient(luConfig.AuthoringKey, luConfig.Endpoint);

        // new settings
        let existingLuisSettings = JSON.parse(luConfig.LuisSettingsContent.Content).luis;
        let luisSettings = new LuisSettings(luConfig.LuisSettingsContent.Path, existingLuisSettings);

        // new multi language recognizer
        let existingMultiRecognizers = JSON.parse(luConfig.MultiLangRecognizerContent.Content).recognizers;
        let multiRecognizer = new MultiLanguageRecognizer(luConfig.MultiLangRecognizerContent.Path, existingMultiRecognizers);

        // new luis recognizer
        let recognizers: LuisRecognizer[] = [];

        // list all apps of current key
        let apps = await client.apps.list(undefined, undefined);

        const luContents = luConfig.LuContents;
        for (const content of luContents) {
            let locale = content.Locale || luConfig.Culture;
            let appName: string = '';

            const response = await parser.parseFile(content.Content, false, locale);
            await parser.validateLUISBlob(response.LUISJsonStructure);
            let parsedLUISObj = <any>response.LUISJsonStructure;
            locale = parsedLUISObj.culture && parsedLUISObj.culture !== '' ? parsedLUISObj.culture : locale;
            appName = parsedLUISObj.name && parsedLUISObj.name !== '' ? parsedLUISObj.name : appName;
            parsedLUISObj.luis_schema_version = parsedLUISObj.luis_schema_version && parsedLUISObj.luis_schema_version !== '' ? parsedLUISObj.luis_schema_version : luConfig.LuisSchemaVersion;

            if (appName === '') {
                appName = `${luConfig.BotName}(${luConfig.Suffix})-${content.Name}`;
            }

            let dialogFile = path.join(path.dirname(content.Path), `${content.Name}.dialog`);
            let recognizer = LuisRecognizer.load(content.Path, content.Name, dialogFile);

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
                let appInfo = await client.apps.get(recognizer.getAppId());
                recognizer.versionId = <string>appInfo.activeVersion;
                
                // compare and train model
                let training = await this.updateApplication(parsedLUISObj, luConfig, client, recognizer);
                
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

    private static async createApplication(currentApp: any, config: LUISConfig, client: any, recognizer: LuisRecognizer, name: string, culture: string): Promise<boolean> {
        process.stdout.write(`Creating LUIS.ai application: ${name} version:0.1\n`);
        currentApp.name = name;
        currentApp.desc = currentApp.desc && currentApp.desc !== '' ? currentApp.desc : `Model for ${config.BotName} app, targetting ${config.Suffix}`;
        currentApp.culture = culture;
        currentApp.luis_schema_version = config.LuisSchemaVersion,
        currentApp.versionId = "0.1";
        recognizer.versionId = "0.1";

        let response = await client.apps.importMethod(currentApp);
        recognizer.setAppId(response);

        // train the version
        await client.train.trainVersion(recognizer.getAppId(), currentApp.versionId);

        return true;
    }

    private static async updateApplication(currentApp: any, config: LUISConfig, client: any, recognizer: LuisRecognizer): Promise<boolean> {
        // get existing app
        const response = await client.versions.exportMethod(recognizer.getAppId(), recognizer.versionId);
        const existingApp = response;
        currentApp.desc = currentApp.desc && currentApp.desc !== '' && currentApp.desc !== existingApp.desc ? currentApp.desc : existingApp.desc;
        currentApp.culture = currentApp.culture && currentApp.culture !== '' && currentApp.culture !== existingApp.culture ? currentApp.culture : existingApp.culture;
        currentApp.versionId = currentApp.versionId && currentApp.versionId !== '' && currentApp.versionId !== existingApp.versionId ? currentApp.versionId : existingApp.versionId;
        currentApp.luis_schema_version = currentApp.luis_schema_version && currentApp.luis_schema_version !== '' && currentApp.luis_schema_version !== config.LuisSchemaVersion ? currentApp.luis_schema_version : config.LuisSchemaVersion;

        // convert utterance text from lu file to lower case
        // as utterances from luis api are all converted to lower case automatically
        (currentApp.utterances || []).forEach((u: any) => {
            u.text = u.text.toLowerCase();
        });

        // convert list entities to remove synonyms word in list which is same with canonicalForm
        (currentApp.closedLists || []).forEach((c: any) => {
            (c.subLists || []).forEach((s: any) => {
                if (s.list) {
                    const foundIndex = s.list.indexOf(s.canonicalForm);
                    if (foundIndex > -1 ) {
                        s.list.splice(foundIndex, 1);
                    }
                }
            });
        });

        (currentApp.entities || []).forEach((e: any) => {
            if (e.children === undefined) {
                e.children = [];
            }
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
            await client.versions.importMethod(recognizer.getAppId(), currentApp, options);

            // train the version
            process.stdout.write(`${recognizer.getLuPath()} training version=${newVersionId}\n`);
            await client.train.trainVersion(recognizer.getAppId(), newVersionId);

            return true;
        } else {
            process.stdout.write(`${recognizer.getLuPath()} no changes\n`);
            return false;
        }
    }

    private static async publishApplication(config: LUISConfig, client: any, recognizer: LuisRecognizer): Promise<void> {    
        process.stdout.write(`${recognizer.getLuPath()} waiting for training for version=${recognizer.versionId}...`);
        let done = true;
        do {
            await process.stdout.write('.');
            let trainingStatus = await client.train.getStatus(recognizer.getAppId(), recognizer.versionId);
    
            done = true;
            for (let status of trainingStatus) {
                if (status.details) {
                    if (status.details.status === 'InProgress' || status.details.status === 'Queued') {
                        done = false;
                        break;
                    }
                }
            }
        } while (!done);
        process.stdout.write('done\n');
    
        // publish the version
        process.stdout.write(`${recognizer.getLuPath()} publishing version=${recognizer.versionId}\n`);
        await client.apps.publish(recognizer.getAppId(),
            {
                "versionId": recognizer.versionId,
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

    private static isApplicationEqual(appA: any, appB: any): boolean {
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
            if (appA.intents && !appA.intents.some((x: any) => x.name === 'None')) {
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