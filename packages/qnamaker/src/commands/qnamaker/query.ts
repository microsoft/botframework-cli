import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const qnamaker = require('./../../../utils/index')
const queryQuestionJSON = require('./../../../utils/payloads/queryquestion')
import {getFileInput, Inputs, processInputs} from '../../utils/qnamakerbase'

export default class QnamakerQuery extends Command {
  static description = 'Generate Answer for fetching the answer from Kb for a query'

  static flags: flags.Input<any> = {
    question: flags.string({description: 'Query to get a prediction for.', required: true}),
    top: flags.integer({description: 'Specifies the number of matching results'}),
    test: flags.boolean({description: 'Query against the test index.', default: false}),
    scorethreshold: flags.integer({description: 'Specifies the confidence score threshold for the returned answer.'}),
    strictfilters: flags.string({description: 'Path to json file {"strictfilters": MetadataDTO[]}'}),
    hostname: flags.string({description: 'Specifies the url for your private QnA service. Overrides the value present in config.'}),
    endpointKey: flags.string({description: 'Specifies the endpoint key for your private QnA service (From qnamaker.ai portal user settings page). Overrides the value present in config.'}),
    kbId: flags.string({description: 'Specifies the active qnamaker knowledgebase id. Overrides the value present in the config'}),
    help: flags.help({char: 'h', description: 'qnamaker:query command help'}),
  }

  async run() {
    const {flags} = this.parse(QnamakerQuery)
    let input: Inputs = await processInputs(flags, queryQuestionJSON, this.config.configDir)
    input.requestBody = {
      question: flags.question,
      isTest: flags.test
    }

    if (flags.top) {
      input.requestBody.top = flags.top
    }

    if (flags.scorethreshold) {
      input.requestBody.scoreThreshold = flags.scorethreshold
    }

    if (flags.strictfilters) {
      try {
        let sf = await getFileInput(flags.strictfilters)
        input.requestBody.strictFilters = sf.strictfilters
      } catch (error) {
        throw new CLIError(error.message)
      }
    }

    const result = await qnamaker(input.config, input.serviceManifest, flags, input.requestBody)
    if (result.error) {
      throw new CLIError(JSON.stringify(result.error, null, 4))
    }

    this.log(JSON.stringify(result, null, 2))
  }
}
