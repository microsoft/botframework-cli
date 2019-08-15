const fs = require('fs-extra')
const path = require('path')

export async function getConfigFile(configDir: string): Promise<any> {
  let userConfig: Config = {}
  if (fs.existsSync(path.join(configDir, 'config.json'))) {
    userConfig = await fs.readJSON(path.join(configDir, 'config.json'))
  } else {
    userConfig = {}
  }
  return userConfig
}

export async function writeConfigFile(configDir: string, userConfig: any) {
  await fs.mkdirp(configDir)
  await fs.writeFileSync(path.join(configDir, 'config.json'), JSON.stringify(userConfig, null, 2))
}

export interface Config {
  [key: string]: any
}
