// @ts-check
// Ensure using node 12 because of recursive mkdir


const fs = require('fs');
const path = require('path');

async function main() {
    const content = `
registry=https://fuselabs.pkgs.visualstudio.com/_packaging/FuseNPM/npm/registry/
always-auth=true`

    const pathToFile = path.join(__dirname, "../config/rush/.npmrc");
    const data = fs.readFileSync(pathToFile, 'utf8');
    console.log(data);
    fs.writeFileSync(pathToFile, content)
    const dataAfter = fs.readFileSync(pathToFile, 'utf8');
    console.log(dataAfter);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
}).then(() => {
    process.exit(0);
});
