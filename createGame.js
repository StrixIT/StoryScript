﻿import pkg from 'fs-extra';
const { copySync, readFileSync, writeFileSync } = pkg;

const gameName = process.argv[2];

if (!gameName) {
    console.log('Please specify a game name.');
    process.exit();
}

// Set the game name to the new game.
correctFile('gameName.js', /gameName\s{0,}=\s{0,}[\w\'-]{0,};/g, `gameName = \'${gameName}\';`);

const gameRoot = './src/Games/_GameTemplate/';
const gameDestination = './src/Games/' + gameName;

// Copy the game template.
copySync(gameRoot, gameDestination);

// Correct the run file.
correctFile(`${gameDestination}/run.ts`, 'Run(\'GameTemplate\',', `Run(\'${gameName}\',`);

const testRoot = './src/Tests/Games/_GameTemplate';
const testDestination = './src/Tests/Games/' + gameName;

// Copy the test template.
copySync(testRoot, testDestination);

function correctFile(fileName, toReplace, replacement) {
    let fileData = readFileSync(fileName, 'utf8');
    fileData = fileData.replace(toReplace, replacement);
    writeFileSync(fileName, fileData);
}