const readPipedStdin = {
    readStdin: async function(){
        return new Promise((resolve, reject) => {
            const { stdin } = process;
            let timeout = setTimeout((reject)=>{reject(new Error('No Input'))}, 1000);
            let input = '';

            stdin.setEncoding('utf8');
            stdin.on('data', chunk => {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                input += chunk;
            });

            stdin.on('end', () => {
                resolve(input);
            });

            stdin.on('error', error => {
                reject(new Error('No input'));
            });
        });
    }
}

module.exports = readPipedStdin;