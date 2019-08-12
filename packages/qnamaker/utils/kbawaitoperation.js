const Operations = require('./api/operations')
const Delay = require('await-delay')
const {cli} = require('cli-ux')

const kbops = {
    waitForOperationSucceeded: async function(config, result) {
        let count = 0;
        while (true) {
            let opResult = await new Operations().getOperationDetails({
                subscriptionKey: config.subscriptionKey,
                operationId: result.operationId
            });

            if (opResult.error)
                throw new Error(JSON.stringify(opResult.error, null, 4));

            result = await opResult.json();
            process.stderr.write(`'\r${result.operationState}`);
            count++;

            await cli.action.start(result.operationState)
            for (let x = 0; x < count; x++)
                process.stderr.write(`.`);
            process.stderr.write('              ');

            if (result.operationState === 'Failed')
                throw new Error(JSON.stringify(result, null, 4));

            if (result.operationState === 'Succeeded')
                break;
            await Delay(1000);
        }
        process.stderr.write('done\n');
        return result;
    }
}

module.exports = kbops