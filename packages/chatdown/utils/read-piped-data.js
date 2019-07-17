const readPipedStdin = {
    readStdin: async function(){
        return new Promise(function(resolve, reject){
            let timer = setTimeout(() => {
                clearTimeout(timer);
                reject(new Error('No Input'));
            }, 1000);
    
            let readData = new Promise((resolve, reject) => {
                const { stdin } = process;
                stdin.setEncoding('utf8');
                let input = ''
                stdin.on('data', chunk => {
                    input += chunk;
                });
    
                stdin.on('end', () => {
                    resolve(input);
                });
    
                stdin.on('error', error => {
                    reject(new Error('No Input'));
                });
    
            }).then(function(res){
                clearTimeout(timer);
                resolve(res);
            }).catch(function(err){
                clearTimeout(timer);
                reject(err);
            });
        })
    }
}

module.exports = readPipedStdin;