const ReadPipedStdin = {
  read: async () => {
    return new Promise<string>(async (resolve, reject) => {
      let input = ''
      const {stdin} = process
      stdin.setEncoding('utf8')

      if (stdin.isTTY) {
        return reject()
      }

      const timer = setTimeout(async () => {
        clearTimeout(timer)
        if (input) return resolve(input)
        reject(new Error('No input'))
      }, 1000)

      stdin.on('data', chunk => {
        clearTimeout(timer)
        input += chunk
      })

      stdin.on('end', () => {
        clearTimeout(timer)
        resolve(input)
      })

      stdin.on('error', err => {
        clearTimeout(timer)
        reject(new Error(`No input ${err}`))
      })

    })
  }
}

export default ReadPipedStdin
