import pkg from 'fs-extra';
import fs from "fs";
import {fileURLToPath} from "url";
import path from "path";
import {rootFolder, updatePackageJson} from "./helpers.js";

const {copy, writeFile} = pkg;

const __filename = fileURLToPath(import.meta.url);
let __dirname = path.resolve(path.dirname(__filename), '../');
const gameName = process.argv[2];

if (!gameName) {
    console.log('Please specify a game name.');
    process.exit();
}

// Set the game name to the new game.
await writeFile(path.resolve(rootFolder, 'currentGameName.js'), `export const currentGameName = '${gameName}';`);

const gameRoot = `${__dirname}/src/Games/_GameTemplate/`;
const gameDestination = `${rootFolder}/src/Games/${gameName}`;

// Copy the game template.
await copy(gameRoot, gameDestination);

// Add the game name to the game info.
updatePackageJson(path.join(gameDestination, 'webroot', 'gameinfo.json'), 'name', gameName);

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