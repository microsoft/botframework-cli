const assert = require('assert');
const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const Operations = require('./api/operations');
const Delay = require('await-delay');
const {cli} = require('cli-ux')

const config = {
    buildConfig: function(flags, serviceIn, config) {
        flags.kbId = (flags.kbId || serviceIn.kbId || config.kbId)
        flags.subscriptionKey = (flags.subscriptionKey || serviceIn.subscriptionKey || config.subscriptionKey)
        flags.endpointKey = (flags.endpointKey || serviceIn.endpointKey || config.endpointKey)
        flags.hostname = (flags.hostname || serviceIn.hostname || config.hostname)
    },

    composeConfig: async function (args, configfile) {
        const {QNAMAKER_SUBSCRIPTION_KEY, QNAMAKER_HOSTNAME, QNAMAKER_ENDPOINTKEY, QNAMAKER_KBID} = process.env;
        const {subscriptionKey, hostname, endpointKey, kbId} = args;

        let qnamakerrcJson = {};
        let config = {}

        try {
            if (fs.existsSync(path.join(configfile, 'config.json'))) {
                config = await fs.readJSON(path.join(configfile, 'config.json'))
                qnamakerrcJson = config.qnamaker === undefined ? {} : config.qnamaker
            } 
        } catch (e) {
            // Do nothing
        } finally {
            config.subscriptionKey = (subscriptionKey || qnamakerrcJson.subscriptionKey || QNAMAKER_SUBSCRIPTION_KEY)
            config.hostname = (hostname || qnamakerrcJson.hostname || QNAMAKER_HOSTNAME)
            config.endpointKey = (endpointKey || qnamakerrcJson.endpointKey || QNAMAKER_ENDPOINTKEY)
            config.kbId = (kbId || qnamakerrcJson.kbId || QNAMAKER_KBID)

        }
        return config;
    },

    validateConfig: function(config) {
        // appId and versionId are not validated here since
        // not all operations require these to be present.
        // Validation of specific params are done in the
        // ServiceBase.js
        const {subscriptionKey} = config;
        const messageTail = `is missing from the configuration.\n\nDid you run ${chalk.cyan.bold('qnamaker init')} yet?`;
        assert(typeof subscriptionKey === 'string', `The subscriptionKey ${messageTail}`);
    },

    waitForOperationSucceeded: async function(config, result) {
        while (true) {
            let opResult = await new Operations().getOperationDetails({
                subscriptionKey: config.subscriptionKey,
                operationId: result.operationId
            });

            if (opResult.error)
                throw new Error(JSON.stringify(opResult.error, null, 4));

            result = await opResult.json();
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