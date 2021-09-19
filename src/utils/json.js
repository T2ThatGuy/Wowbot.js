const fs = require('fs').promises;

async function readConfig () {

    const data = await readJSON('./src/database/config.json');
    return data;

}

async function writeConfig (data) {
    
    await writeJSON( './src/database/config.json', data );
    
}

async function readJSON (filePath) {

    const data = JSON.parse( await fs.readFile(filePath) );
    return data;

}

async function writeJSON (filePath, data) {

	await fs.writeFile( filePath, JSON.stringify(data, null, 2) );

}

module.exports = { readConfig, writeConfig, writeJSON, readJSON }