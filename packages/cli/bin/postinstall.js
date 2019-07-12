const path = require('path')
const fs = require('fs-extra');

const resetTelemetry = async defaultVal => {
  const pathToJson = path.resolve(__dirname, '../package.json')
  const userConfig = await fs.readJSON(pathToJson)
  userConfig.telemetry = defaultVal
  await fs.writeFile(pathToJson, JSON.stringify(userConfig, null, 2))
}

resetTelemetry(null)
