import {fileURLToPath} from "url";
import path from 'path';
import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
__dirname = __dirname.includes('/node_modules/') ? `${__dirname.split('/node_modules/')[0]}` : __dirname;

export const rootFolder = __dirname;

export function updatePackageJson(filePath, property, newValue) {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const jsonObject = JSON.parse(rawData);
    jsonObject[property] = newValue;
    fs.writeFileSync(filePath, JSON.stringify(jsonObject, null, 2), 'utf8');
}