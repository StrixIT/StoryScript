const fs = require('fs-extra')

var gameName = process.argv[2];

if (!gameName) {
    console.log('Please specify a game name.');
    return;
}

var templateRoot = './src/Games/_GameTemplate/';
var destination = './src/Games/' + gameName;

var gameNameData = fs.readFileSync('gameName.js', 'utf8');
gameNameData = gameNameData.replace(/gameName\s{0,}=\s{0,}[\w\']{0,};/g, 'gameName = \'' + gameName + '\';');
fs.writeFileSync('gameName.js', gameNameData);

fs.copySync(templateRoot, destination);

const runFile = `${destination}/run.ts`;
var runData = fs.readFileSync(runFile, 'utf8');
runData = runData.replace('Run(\'GameTemplate\',', 'Run(\'' + gameName + '\',');
fs.writeFileSync(runFile, runData);