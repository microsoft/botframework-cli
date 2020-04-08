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

    constructor() {
        this.qnaMakerCommand = taskLibrary.getBoolInput('qnaMakerCommand', false);
        this.qnaMakerSubCommand = taskLibrary.getInput('qnaMakerSubCommand', false) as string;
        this.qnaKey = taskLibrary.getInput('qnaKey', false) as string;
        this.kbName = taskLibrary.getInput('kbName', false) as string;
        this.kbFileLocation = taskLibrary.getInput('kbFileLocation', false) as string;
        this.publishNewKB = taskLibrary.getBoolInput('publishNewKB', false);
        this.publishKbId = taskLibrary.getInput('publishKbId', false) as string;
        this.deleteKbId = taskLibrary.getInput('deleteKbId', false) as string;
    }

    public executeSubCommand = (): void => {
        switch (this.qnaMakerSubCommand) {
            case 'CreateKB':
                this.createKnowledgeBase();
                break;
            case 'DeleteKB':
                this.deleteKnowledgeBase();
                break;
            default:
                console.log('No QnA Maker command was selected')
        }
    }

    private publishKnowledgeBase = (newKbId?: string): void => {
        console.log('Publishing QnA knowledge base');
    
        let command = `bf qnamaker:kb:publish --kbId ${ newKbId? newKbId: this.publishKbId } --subscriptionKey ${ this.qnaKey }`;
    
        execSync(command);
        console.log('QnA knowledge base succesfully published');
    }
    
    private createKnowledgeBase = (): void => {
        console.log('Creating QnA knowledge base');
    
        let command = `bf qnamaker:kb:create --in ${ this.kbFileLocation } --subscriptionKey ${ this.qnaKey }`;
        if (this.kbName) {
            command += ` --name ${ this.kbName }`;
        }
    
        let newKB = execSync(command);
        console.log('QnA knowledge base successfully created');
    
        if (this.publishNewKB) {
            let ObjKbId = JSON.parse(newKB.toString('utf8'));
            this.publishKnowledgeBase(ObjKbId.kbId);
        }
    }
    
    private deleteKnowledgeBase = (): void => {
        console.log('Deleting QnA knowledge base');
    
        let command = `bf qnamaker:kb:delete --kbId ${ this.deleteKbId } --subscriptionKey ${ this.qnaKey } --force`;
        
        execSync(command);
        console.log('QnA knoledge base succesfully deleted');
    }
}