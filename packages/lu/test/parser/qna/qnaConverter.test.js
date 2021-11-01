const QnA = require('./../../../src/parser/qna/qnamaker/qnaConverter')
var chai = require('chai').expect;

describe('QnAMakerConverter', function() {
    it('New lines are escaped properly in prompt display text', async () => {
        const qnajson = {
            "qnaDocuments": [
                {
                    "id": 1,
                    "answer": "**Setting Up Sync Folders**\n\nYou decide which folders to synchronise to your computer from your web browser via [https://lion.app.box.com](https://lion.app.box.com/)",
                    "source": "https://some.url",
                    "questions": [
                        "Using Box Sync"
                    ],
                    "metadata": [
                        {
                            "name": "category1",
                            "value": "it"
                        },
                        {
                            "name": "category2",
                            "value": "collaborations"
                        },
                        {
                            "name": "category3",
                            "value": "lion box"
                        }
                    ],
                    "alternateQuestionClusters": [],
                    "context": {
                        "isContextOnly": false,
                        "prompts": [
                            {
                                "displayOrder": 1,
                                "qnaId": 782,
                                "displayText": "What \n Should You Sync"
                            },
                            {
                                "displayOrder": 2,
                                "qnaId": 783,
                                "displayText": "Files that Cannot Sync\n"
                            },
                            {
                                "displayOrder": 3,
                                "qnaId": 784,
                                "displayText": "Box Sync Status"
                            }
                        ]
                    },
                    "lastUpdatedTimestamp": "2021-09-17T08:28:19.46+00:00",
                    "isDocumentText": false,
                    "extractionConfidence": -1
                }
            ]
        }
        const markdown = QnA(qnajson)
        chai(markdown).to.contain("Files that Cannot Sync\\n");
    });
});