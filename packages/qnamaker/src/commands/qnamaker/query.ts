import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const qnamaker = require('./../../../utils/index')
const queryQuestionJSON = require('./../../../utils/payloads/queryquestion')
import {Inputs, processInputs} from '../../utils/qnamakerbase'

export default class QnamakerQuery extends Command {
  static description = 'Query model for fetching the answer from Kb for a query'

  static flags: flags.Input<any> = {
    question: flags.string({description: 'Query to get a prediction for.', required: true}),
    top: flags.integer({description: 'Query to get a prediction for.'}),
    isTest: flags.boolean({description: 'Query against the test index.', default: false}),
    scoreThreshold: flags.integer({description: 'Query to get a prediction for.'}),
    hostname: flags.string({description: 'Specifies the url for your private QnA service. Overrides the value present in config.'}),
    endpointKey: flags.string({description: 'Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal user settings page). Overrides the value present in config.'}),
    kbId: flags.string({description: 'Specifies the active qnamaker knowledgebase id. Overrides the value present in the config'}),
    help: flags.help({char: 'h', description: 'qnamaker:query command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerQuery)
    let input: Inputs = await processInputs(flags, queryQuestionJSON, this.config.configDir)
    input.requestBody = {
      question: flags.question,
      top: flags.top,
      isTest: flags.isTest,
      scoreThreshold: flags.scoreThreshold
    }
    const result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)
    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    }

    if (typeof result === 'string') {
      this.log(result)
    } else {
      this.log(JSON.stringify(result, null, 2))
    }
  }
}
