import {rootFolder} from "./helpers.js";
import {fileURLToPath} from "url";
import path from "path";
import pkg from "fs-extra";
import fs from "fs";

const {copy} = pkg;
const __filename = fileURLToPath(import.meta.url);
let __dirname = path.resolve(path.dirname(__filename), '../');

const testRoot = path.resolve(__dirname, 'src', 'Tests', 'Games', '_GameTemplate');
const nameModule = await import(path.resolve(rootFolder, 'currentGameName.js'));
const testDestination = path.resolve(rootFolder, 'src', 'Tests', 'Games', nameModule.currentGameName);

if (!fs.existsSync(testDestination)) {
    await copy(testRoot, testDestination);
}