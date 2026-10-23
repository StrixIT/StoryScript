import pkg from 'fs-extra';
import fs from "fs";
import {fileURLToPath} from "url";
import path from "path";
import {rootFolder} from "../helpers.js";

const { copy, readFile, writeFile } = pkg;

const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
const gameName = process.argv[2];

if (!gameName) {
    console.log('Please specify a game name.');
    process.exit();
}

// Set the game name to the new game.
await writeFile(`${rootFolder}/currentGameName.txt`, gameName);

const gameRoot = `${__dirname}/src/Games/_GameTemplate/`;
const gameDestination = `${rootFolder}/src/Games/${gameName}`;

// Copy the game template.
await copy(gameRoot, gameDestination);

// Correct the run file.
await correctFile(`${gameDestination}/run.ts`, 'Run(\'GameTemplate\',', `Run(\'${gameName}\',`);

const testRoot = `${__dirname}/src/Tests/Games/_GameTemplate`;
const testDestination = `${rootFolder}/src/Tests/Games/${gameName}`;

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