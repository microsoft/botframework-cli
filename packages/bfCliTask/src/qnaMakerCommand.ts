/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import taskLibrary = require('azure-pipelines-task-lib/task');
import { execSync } from 'child_process';

export class QnAMakerCommand {

    public qnaMakerCommand: boolean;
    public qnaMakerSubCommand: string;
    public qnaKey: string;
    public kbName: string;
    public kbFileLocation: string;
    public publishNewKB: boolean;
    public publishKbId: string;
    public deleteKbId: string;
    public replaceKbId: string;
    public kbReplaceFileLocation: string;

    constructor() {
        this.qnaMakerCommand = taskLibrary.getBoolInput('qnaMakerCommand', false);
        this.qnaMakerSubCommand = taskLibrary.getInput('qnaMakerSubCommand', false) as string;
        this.qnaKey = taskLibrary.getInput('qnaKey', false) as string;
        this.kbName = taskLibrary.getInput('kbName', false) as string;
        this.kbFileLocation = taskLibrary.getInput('kbFileLocation', false) as string;
        this.publishNewKB = taskLibrary.getBoolInput('publishNewKB', false);
        this.publishKbId = taskLibrary.getInput('publishKbId', false) as string;
        this.deleteKbId = taskLibrary.getInput('deleteKbId', false) as string;
        this.replaceKbId = taskLibrary.getInput('replaceKbId', false) as string;
        this.kbReplaceFileLocation = taskLibrary.getInput('kbReplaceFileLocation', false) as string;
    }

    public executeSubCommand = (): void => {
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
            default:
                console.log('No QnA Maker command was selected')
        }
    }

    private publishKnowledgeBase = (newKbId?: string): void => {
        console.log('Publishing QnA knowledgebase');
    
        let command = `bf qnamaker:kb:publish --kbId ${ newKbId? newKbId: this.publishKbId } --subscriptionKey ${ this.qnaKey }`;
    
        execSync(command);
        console.log('QnA knowledgebase succesfully published');
    }
    
    private createKnowledgeBase = (): void => {
        console.log('Creating QnA knowledgebase');
    
        let command = `bf qnamaker:kb:create --in ${ this.kbFileLocation } --subscriptionKey ${ this.qnaKey }`;
        if (this.kbName) {
            command += ` --name ${ this.kbName }`;
        }
    
        let newKB = execSync(command);
        console.log('QnA knowledgebase successfully created');
    
        if (this.publishNewKB) {
            let ObjKbId = JSON.parse(newKB.toString('utf8'));
            this.publishKnowledgeBase(ObjKbId.kbId);
        }
    }
    
    private deleteKnowledgeBase = (): void => {
        console.log('Deleting QnA knowledgebase');

        let command = `bf qnamaker:kb:delete --kbId ${ this.deleteKbId } --subscriptionKey ${ this.qnaKey } --force`;

        execSync(command);
        console.log('QnA knolewdgebase succesfully deleted');
    }

    private replaceKnowledgeBase = (): void => {
        console.log('Replacing QnA knowledgebase');

        let command = `bf qnamaker:kb:replace --kbId ${ this.replaceKbId } --in ${ this.kbReplaceFileLocation } --subscriptionKey ${ this.qnaKey }`;

        execSync(command);
        console.log('QnA knowledgebase succesfully replaced');
    }
}