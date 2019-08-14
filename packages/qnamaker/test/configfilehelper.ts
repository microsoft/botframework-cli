const fs = require('fs-extra')
const path = require('path')
const nock = require('nock')
const os = require('os')
const pkg = require('../package.json')

const windowsHomedriveHome = () => process.env.HOMEDRIVE && process.env.HOMEPATH && path.join(process.env.HOMEDRIVE, process.env.HOMEPATH)
const windowsUserprofileHome = () => process.env.USERPROFILE
const windowsHome = () => windowsHomedriveHome() || windowsUserprofileHome()

const platform: string = os.platform()
const isWindows: boolean = platform === 'win32'
const home: string = process.env.HOME || (isWindows && windowsHome()) || os.homedir() || os.tmpdir()

const getConfigDir = (isWindows: boolean, home: string, pname: string) => {
const base: string = process.env[`XDG_CONFIG_HOME`]
|| (isWindows && process.env.LOCALAPPDATA)
|| path.join(home, '.config')
  return path.join(base, pname)
}

const pathToConfigJson: string  = getConfigDir(isWindows, home, pkg.name)
const configFile = path.join(pathToConfigJson, 'config.json')

export async function initTestConfigFile() {
  const config = {
    qnamaker: {
      subscriptionKey: "222222cccccctttttth223kk3k33",
      hostname: "https://somehost.net",
      endpointKey: "xxxxxxxxxxxxxxxxxxx",
      kbId: "xxxxxxxxxxxxxxxxxxxxxxx"
    }
  }
  
  await fs.mkdirp(pathToConfigJson)
  await fs.writeFile(configFile, JSON.stringify(config, null, 2))
}

export async function deleteTestConfigFile() {
  await fs.remove(pathToConfigJson)
}

export function getConfigFile() {
  return configFile
}

