import fs from "fs";
import {fileURLToPath} from "url";
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
__dirname = __dirname.includes('/node_modules/') ? `${__dirname.split('/node_modules/')[0]}` : __dirname;

export const rootFolder = __dirname;

let _gameName;
const gameNamePath = `${rootFolder}/currentGameName.txt`;

if (fs.existsSync(gameNamePath)) {
    _gameName = fs.readFileSync(gameNamePath, 'utf8');
}

export const gameName = _gameName ?? '';