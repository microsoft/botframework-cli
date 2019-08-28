const ReadPipedStdin = {
  read: async () => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        clearTimeout(timer)
        reject(new Error('No Input'))
      }, 1000)

      const readData: any = new Promise((resolve, reject) => {
        const {stdin} = process
        stdin.setEncoding('utf8')
        let input = ''
        stdin.on('data', chunk => {
          input += chunk
        })

        stdin.on('end', () => {
          resolve(input)
        })

        stdin.on('error', () => {
          reject(new Error('No Input'))
        })

      })

      Promise.race([readData]).then((res: any) => {
        clearTimeout(timer)
        resolve(res)
      }).catch((err: any) => {
        clearTimeout(timer)
        reject(err)
      })
    })
  }
}

export default ReadPipedStdin