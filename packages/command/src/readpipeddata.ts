/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const ReadPipedStdin = {
  read: async () => {
    return new Promise<string>(async (resolve, reject) => {
      let input = ''
      const {stdin} = process
      stdin.setEncoding('utf8')

      if (stdin.isTTY) {
        return reject()
      }

      function buffer(chunk: string) {
        clearTimeout(timer);
        input += chunk;
      }

      function complete(err: Error) {
        clearTimeout(timer)
        stdin.removeListener('data', buffer); 
        stdin.removeListener('end', complete); // It's safe to call removeListener even if it's already been removed
        stdin.removeListener('error', complete);
        if(err) {
          return reject(err);
        } else if(!input) {
          return reject(new Error('No input'));
        }
        resolve(input);
      }

      const timer = setTimeout(complete, 1000)

      stdin.on('data', buffer);
      stdin.once('end', complete);
      stdin.once('error', complete);
    })
  }
}

export default ReadPipedStdin
