import pkg from 'fs-extra';
import fs from "fs";
const { copy, readFile, writeFile } = pkg;

const gameName = process.argv[2];

if (!gameName) {
    console.log('Please specify a game name.');
    process.exit();
}

// Set the game name to the new game.
await correctFile('currentGameName.js', /gameName\s{0,}=\s{0,}[\w\'-]{0,};/g, `gameName = \'${gameName}\';`);

const gameRoot = './src/Games/_GameTemplate/';
const gameDestination = './src/Games/' + gameName;

// Copy the code snippets so VS Code can use them.
await copy('./CodeSnippets/StoryScriptSnippets.code-snippets', './.vscode/StoryScriptSnippets.code-snippets');

// Copy the game template.
await copy(gameRoot, gameDestination);

// Correct the run file.
await correctFile(`${gameDestination}/run.ts`, 'Run(\'GameTemplate\',', `Run(\'${gameName}\',`);

const testRoot = './src/Tests/Games/_GameTemplate';
const testDestination = './src/Tests/Games/' + gameName;

// Copy the test template.
await copy(testRoot, testDestination);

// Add the components and the resources folders to make sure they are present.
const componentsPath = `${gameDestination}/ui/components`;
const resourcesPath = `${gameDestination}/resources`;

if (!fs.existsSync(componentsPath)) {
    fs.mkdirSync(componentsPath);
}

if (!fs.existsSync(resourcesPath)) {
    fs.mkdirSync(resourcesPath);
}

async function correctFile(fileName, toReplace, replacement) {
    let fileData = await readFile(fileName, 'utf8');
    fileData = fileData.replace(toReplace, replacement);
    await writeFile(fileName, fileData);
}