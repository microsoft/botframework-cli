const ReadPipedStdin = {
    read: async () => {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                clearTimeout(timer);
                reject(new Error('No Input'));
            }, 1000);
    
            const readData = new Promise((resolve, reject) => {
                const { stdin } = process;
                stdin.setEncoding('utf8');
                let input = '';
                stdin.on('data', chunk => {
                    input += chunk;
                });
    
                stdin.on('end', () => {
                    resolve(input);
                });
    
                stdin.on('error', error => {
                    reject(new Error('No Input'));
                });
    
            }).then(res => {
                clearTimeout(timer);
                resolve(res);
            }).catch(err => {
                clearTimeout(timer);
                reject(err);
            });
        })
    }
}

export default ReadPipedStdin;