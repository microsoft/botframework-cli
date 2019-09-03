const ReadPipedStdin = {
  read: async () => {
    return new Promise(async (resolve, reject) => {
      const timer = setTimeout(async () => {
        clearTimeout(timer)
        if (input) return resolve(input)
        reject(new Error('No Input'))
      }, 1000)

      let input = ''
      const {stdin} = process
      stdin.setEncoding('utf8')

      stdin.on('data', chunk => {
        input += chunk
      })

      stdin.on('end', () => {
        clearTimeout(timer)
        resolve(input)
      })

      stdin.on('error', err => {
        clearTimeout(timer)
        reject(new Error(`No Input ${err}`))
      })

    })
  }
}

export default ReadPipedStdin
