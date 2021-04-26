const assert = require('assert');
const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const Operations = require('./api/operations');
const Delay = require('delay');
const {cli} = require('cli-ux')

const config = {
    buildConfig: function(flags, config) {
        flags.kbId = (flags.kbId || config.kbId),
        flags.subscriptionKey = (flags.subscriptionKey || config.subscriptionKey),
        flags.endpointKey = (flags.endpointKey || config.endpointKey),
        flags.hostname = (flags.hostname || config.hostname)
    },

    composeConfig: async function (args, configfile) {
        const {QNAMAKER_SUBSCRIPTION_KEY, QNAMAKER_HOSTNAME, QNAMAKER_ENDPOINTKEY, QNAMAKER_KBID} = process.env;
        const {subscriptionKey, hostname, endpointKey, kbId} = args;

        let qnamakerrcJson = {};
        let config = {}

        try {
            if (fs.existsSync(path.join(configfile, 'config.json'))) {
                qnamakerrcJson = await fs.readJSON(path.join(configfile, 'config.json'))
            } 
        } catch (e) {
            // Do nothing
        } finally {
            config.subscriptionKey = (subscriptionKey || qnamakerrcJson.qnamaker__subscriptionKey || QNAMAKER_SUBSCRIPTION_KEY)
            config.hostname = (hostname || qnamakerrcJson.qnamaker__hostname || QNAMAKER_HOSTNAME)
            config.endpointKey = (endpointKey || qnamakerrcJson.qnamaker__endpointKey || QNAMAKER_ENDPOINTKEY)
            config.kbId = (kbId || qnamakerrcJson.qnamaker__kbId || QNAMAKER_KBID)

        }
        return config;
    },

    validateConfig: function(config) {
        // appId and versionId are not validated here since
        // not all operations require these to be present.
        // Validation of specific params are done in the
        // ServiceBase.js
        const {subscriptionKey} = config;
        const messageTail = `is missing from the configuration.\n\nDid you run ${chalk.cyan.bold('bf qnamaker:init')} yet?`;
        assert(typeof subscriptionKey === 'string', `The subscriptionKey ${messageTail}`);
    },

    waitForOperationSucceeded: async function(config, result) {
        while (true) {
            let opResult = await new Operations().getOperationDetails({
                subscriptionKey: config.subscriptionKey,
                operationId: result.operationId,
                endpoint: config.endpoint
            });
            
            if (opResult.error)
                throw new Error(JSON.stringify(opResult.data.error, null, 4));

            result = opResult.data;
            cli.action.start(result.operationState)

            if (result.operationState === 'Failed'){
                cli.action.stop()
                throw new Error(JSON.stringify(result, null, 4));
            }

            if (result.operationState === 'Succeeded')
                break;
            await Delay(1000);
        }
        cli.action.stop()
        return result;
    }
}

module.exports = config;