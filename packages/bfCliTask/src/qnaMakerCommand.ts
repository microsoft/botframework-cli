/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import taskLibrary = require('azure-pipelines-task-lib/task');
import { spawn, exec } from 'child_process';
import { Utils } from './utils';
import { promisify } from 'util';
import fs = require('fs');
import path = require('path');
const executeCommand = promisify(exec);


export class QnAMakerCommand {

    private qnaMakerSubCommand: string;
    private qnaKey: string;
    private kbName: string;
    private kbDTOFileLocation: string;
    private publishNewKB: boolean;
    private kbId: string;
    private feedbackRecordDTOLocation: string;
    private kbHostName: string;
    private kbEndPointKey: string;
    private wordAlterationsDTOFileLocation: string;
    private serviceEndpoint: string;
    private qnaQuestion: string;
    private isAlterationFile: boolean;
    private qnaConvertFilePathInput: string;
    private qnaConvertFilePathOutput: string;
    private qnaTranslateInput: string;
    private qnaTranslateOutputFolder: string;
    private qnaTranslateKey: string;
    private qnaSourceLang: string;
    private qnaTargetLang: string;
    private activeLearning: boolean;
    private keyType: string;
    private utils = new Utils();

    constructor() {
        this.qnaMakerSubCommand = taskLibrary.getInput('qnaMakerSubCommand', false) as string;
        this.qnaKey = taskLibrary.getInput('qnaKey', false) as string;
        this.kbName = taskLibrary.getInput('kbName', false) as string || "";
        this.kbDTOFileLocation = this.utils.validatePath('kbDTOFileLocation');
        this.publishNewKB = taskLibrary.getBoolInput('publishNewKB', false);
        this.kbId = taskLibrary.getInput('kbId', false) as string;
        this.feedbackRecordDTOLocation = taskLibrary.getPathInput('feedbackRecordDTOFileLocation',false) as string;
        this.kbHostName = taskLibrary.getInput('kbHostName',false) as string;
        this.kbEndPointKey = taskLibrary.getInput('kbEndPointKey',false) as string;
        this.wordAlterationsDTOFileLocation = taskLibrary.getInput('wordAlterationsDTOFileLocation',false) as string;
        this.serviceEndpoint = taskLibrary.getInput('serviceEndpoint',false) as string;
        this.qnaQuestion = taskLibrary.getInput('qnaQuestion', false) as string;
        this.isAlterationFile = taskLibrary.getBoolInput('isAlterationFile', false);
        this.qnaConvertFilePathInput = taskLibrary.getPathInput('qnaConvertFilePathInput', false) as string;
        this.qnaConvertFilePathOutput = taskLibrary.getPathInput('qnaConvertFilePathOutput', false) as string;
        this.qnaTranslateInput = taskLibrary.getInput('qnaTranslateInput', false) as string;
        this.qnaTranslateOutputFolder = taskLibrary.getInput('qnaTranslateOutputFolder', false) as string;
        this.qnaTranslateKey = taskLibrary.getInput('qnaTranslateKey', false) as string;
        this.qnaSourceLang = taskLibrary.getInput('qnaSourceLang', false) as string;
        this.qnaTargetLang = taskLibrary.getInput('qnaTargetLang', false) as string;
        this.activeLearning = taskLibrary.getBoolInput('activeLearning', false);
        this.keyType = taskLibrary.getInput('keyType', false) as string;
    }

    public executeSubCommand = () => {
        try {
            switch (this.qnaMakerSubCommand) {
                case 'CreateKB':
                    this.createKnowledgeBase();
                    break;
                case 'DeleteKB':
                    this.deleteKnowledgeBase();
                    break;
                case 'PublishKB':
                    this.publishKnowledgeBase();
                    break;
                case 'ReplaceKB':
                    this.replaceKnowledgeBase();
                    break;
                case 'UpdateKB':
                    this.updateKnowledgeBase();
                    break;
                case 'TrainKB':
                    this.trainKnowledgeBase();
                    break;
                case 'AlterationsReplaceKB':
                    this.replaceAlterations();
                    break;
                case 'QueryKB':
                    this.QueryKnowledgeBase();
                    break;
                case 'QnAConvert':
                    this.ConvertQnaFiles();
                    break;
                case 'QnATranslate':
                    this.TranslateQnAModel();
                    break;
                case 'EndpointSettingsUpdate':
                    this.updateEndpointSettings();
                    break;
                case 'EndpointKeysRefresh':
                    this.refreshEndpointKeys();
                    break;
                default:
                    console.log('No QnA Maker command was selected');
            }
        } catch (error) {
            taskLibrary.setResult(taskLibrary.TaskResult.Failed, error.message, true);
        }

    }

    private publishKnowledgeBase = async (newKbId?: string) => {
        console.log('Publishing QnA knowledgebase');
    
        const command = `bf qnamaker:kb:publish --kbId "${ newKbId? newKbId: this.kbId }" --subscriptionKey "${ this.qnaKey }"`;        

        const { stdout, stderr } = await executeCommand(command);
    
        if (stderr && !stderr.includes("Succeeded")) {
            taskLibrary.setResult(taskLibrary.TaskResult.Failed, stderr, true);            
        } else {
            console.log(`QnA knowledgebase succesfully published \n${stdout}`);
        }
    }
    
    private createKnowledgeBase = async () => {
        console.log('Creating QnA knowledgebase');
    
        let command = `bf qnamaker:kb:create --in "${ this.kbDTOFileLocation }" --subscriptionKey "${ this.qnaKey }"`;

        if (this.kbName) {
            command += ` --name "${ this.kbName }"`;
        }

        const { stdout, stderr } = await executeCommand(command);
    
        if (stderr && !stderr.includes("Succeeded")) {
            taskLibrary.setResult(taskLibrary.TaskResult.Failed, stderr, true);            
        } else {
            console.log(`QnA knowledgebase successfully created \n${stdout}`);
        }
    
        if (this.publishNewKB) {
            let ObjKbId = JSON.parse(stdout.toString());
            this.publishKnowledgeBase(ObjKbId.kbId);
        }
    }
    
    private deleteKnowledgeBase = async () => {
        console.log('Deleting QnA knowledgebase');

        const command = `bf qnamaker:kb:delete --kbId "${ this.kbId }" --subscriptionKey "${ this.qnaKey }" --force`;

        const { stdout, stderr } = await executeCommand(command);
    
        if (stderr && !stderr.includes("Succeeded")) {
            taskLibrary.setResult(taskLibrary.TaskResult.Failed, stderr, true);
        } else {
            console.log(`QnA knolewdgebase successfully deleted \n${stdout}`);
        }
    }

    private replaceKnowledgeBase = async () => {
        console.log('Replacing QnA knowledgebase');

        const command = `bf qnamaker:kb:replace --kbId "${ this.kbId }" --in "${ this.kbDTOFileLocation }" --subscriptionKey "${ this.qnaKey }"`;

        const { stdout, stderr } = await executeCommand(command);
    
        if (stderr && !stderr.includes("Succeeded")) {
            taskLibrary.setResult(taskLibrary.TaskResult.Failed, stderr, true);
        } else {
            console.log(`QnA knowledgebase successfully replaced \n${stdout}`);
        }
    }

    private updateKnowledgeBase = async () => {
        console.log('Updating QnA knowledgebase');

        const command = `bf qnamaker:kb:update --kbId "${ this.kbId }" --in "${ this.kbDTOFileLocation }" --subscriptionKey "${ this.qnaKey }" --wait`;

        const { stdout, stderr } = await executeCommand(command);
    
        if (stderr && !stderr.includes("Succeeded")) {
            taskLibrary.setResult(taskLibrary.TaskResult.Failed, stderr, true);
        } else {
            console.log(`QnA knowledgebase successfully updated \n${stdout}`);
        }
    }

    private trainKnowledgeBase = async () => {
        console.log('Updating QnA knowledgebase');

        const command = `bf qnamaker:train --kbId "${ this.kbId }" --endpointKey "${this.kbEndPointKey}" --hostname "${this.kbHostName}" --in "${this.feedbackRecordDTOLocation}" --subscriptionKey "${ this.qnaKey }"`;
        
        const { stdout, stderr } = await executeCommand(command);
    
        if (stderr && !stderr.includes("Succeeded")) {
            taskLibrary.setResult(taskLibrary.TaskResult.Failed, stderr, true);
        } else {
            console.log(`QnA knowledgebase successfully trained \n${stdout}`);
        }
    }

    private replaceAlterations = async () => {
        console.log('Replacing Alteration in QnA knowledgebase');
        console.log('Alteration file location:' + this.wordAlterationsDTOFileLocation);

        let command = `bf qnamaker:alterations:replace --in "${ this.wordAlterationsDTOFileLocation }" --subscriptionKey "${ this.qnaKey }"`;

        if (this.serviceEndpoint) {
            command += ` --endpoint  "${ this.serviceEndpoint }"`;
        }

        const { stdout, stderr } = await executeCommand(command);
    
        if (stderr && !stderr.includes("Succeeded")) {
            taskLibrary.setResult(taskLibrary.TaskResult.Failed, stderr, true);
        } else {
            console.log(`Alterations successfully replaced \n${stdout}`);
        }
    }

    private QueryKnowledgeBase = async () => {        
        const rootPath = taskLibrary.getVariable('System.DefaultWorkingDirectory') as string;

        this.QnAMakerInitConfiguration().then(async () => {
            console.log('Calling for query to the QnA knowledgebase');

            const command = `bf qnamaker:query --endpointKey "${ this.kbEndPointKey }" --hostname "${ this.kbHostName }" --kbId "${ this.kbId }" --question "${ this.qnaQuestion }"`;            
            const { stdout, stderr } = await executeCommand(command);

            if (stderr && !stderr.includes("Succeeded")) {
                taskLibrary.setResult(taskLibrary.TaskResult.Failed, stderr, true);
            } else {
                var queryResult = JSON.stringify(JSON.parse(stdout));            
                fs.writeFileSync(path.join(rootPath, 'QueryResult.json'), queryResult);

                console.log(`The QnA knowledgebase answered successfully \n${stdout}`);
            }
        });
    }

    private QnAMakerInitConfiguration = async () => {
        console.log('Setting up QnA Maker configuration');
        let child = spawn('bf',['qnamaker:init'], { shell: true });

        for await (const data of child.stderr) {
            if(data.includes('What is your QnAMaker access/subscription key?')){
                child.stdin.write(this.qnaKey);
            }else if(data.includes('What would you like to use as your active knowledgebase ID?')){
                child.stdin.write(this.kbId);
            }else if(data.includes('ok?')){
                child.stdin.write("yes");
                child.stdin.end();
            }
          };
    }
 
    private updateEndpointSettings = async () => {
        console.log('Updating Endpoint settings');

        let command = `bf qnamaker:endpointsettings:update --subscriptionKey "${ this.qnaKey }" --endpoint "${ this.serviceEndpoint }"`;

        if (this.activeLearning) {
            command += ` --activelearning`;
        }

        const { stdout, stderr } = await executeCommand(command);

        if (stderr && !stderr.includes("Succeeded")) {
            taskLibrary.setResult(taskLibrary.TaskResult.Failed, stderr, true);
        } else {
            console.log(`Endpoint settings successfully updated \n${stdout}`);
        }
    }

    private refreshEndpointKeys = async () => {
        const rootPath = taskLibrary.getVariable('System.DefaultWorkingDirectory');
        const RefreshedKeys = `${ rootPath }/RefreshedKeys.json`;
        console.log('Refreshing Endpoint keys');

        let command = `bf qnamaker:endpointkeys:refresh --subscriptionKey "${ this.qnaKey }" --endpoint "${ this.serviceEndpoint }"`;
        command += ` --keyType "${ this.keyType }" > "${ RefreshedKeys }" | cat  "${ RefreshedKeys }"`;
        const { stdout, stderr } = await executeCommand(command);
    
        if (stderr && !stderr.includes("Succeeded")) {
            taskLibrary.setResult(taskLibrary.TaskResult.Failed, stderr, true);
        } else {
            console.log(`Endpoint keys successfully refreshed \n${stdout}`);
        }
    }
    
    private ConvertQnaFiles = async () => {
        console.log('Converting QnA files');

        let command = `bf qnamaker:convert --in "${this.qnaConvertFilePathInput}" --out "${this.qnaConvertFilePathOutput}" --force --recurse`;

        if (this.kbName) {
            command += `--name  ${this.kbName}`;
        }

        if (this.isAlterationFile) {
            command += ` --alterations`;
        }

        const { stdout, stderr } = await executeCommand(command);
    
        if (stderr && !stderr.includes("Succeeded")) {
            taskLibrary.setResult(taskLibrary.TaskResult.Failed, stderr, true);
        } else {
            console.log(`QnA files converted successfully \n${stdout}`); 
        }
    }
    
    private TranslateQnAModel = async () => {
        console.log('Translationg QnA models');

        let command = `bf qnamaker:translate --in "${ this.qnaTranslateInput }" --out "${ this.qnaTranslateOutputFolder }" --translatekey "${ this.qnaTranslateKey }"`;
        command += this.qnaSourceLang? ` --srclang "${ this.qnaSourceLang }"` : '';
        command += ` --tgtlang "${ this.qnaTargetLang }" --force --recurse --translate_comments --translate_link_text`;
        const { stdout, stderr } = await executeCommand(command);
    
        if (stderr && !stderr.includes("Succeeded")) {
            taskLibrary.setResult(taskLibrary.TaskResult.Failed, stderr, true);
        } else {
            console.log(`QnA models translated successfully\n${stdout}`);
        }
    }
}
