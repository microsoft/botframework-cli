const path = require('path')
const fs = require('fs-extra')

 const updateUrls = async () => {
  try {
    let plugins = ['config', 'chatdown', 'dialog', 'lu', 'qnamaker', 'cli']
    for (let i = 0; i < plugins.length; i++) {
        await compareCleanUrls(plugins[i])
    }
  /* tslint:disable:no-unused */
  } catch (err) {
      // swallow the exception; we don't want to crash the app
      // on a failed attempt to set telemetry
  }
}

const compareCleanUrls = async function(plugin) {
    let readmePath = path.join(__dirname, `./../packages/${plugin}/README.md`)
    let fileContent = await fs.readFile(readmePath)
    fileContent = fileContent.toString().replace(/\/blob\/v1\.0\.0/g, "")
    await fs.writeFile(readmePath, fileContent)
}

const run = async () => {
  await updateUrls()
  process.exit(0)
}

run()