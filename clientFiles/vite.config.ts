import {getBaseViteConfig} from "storyscript/vite-config";
import {defineConfig} from "vite";
import {fileURLToPath} from "url";
import path from "path";
import {currentGameName} from "./currentGameName.js";

const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
const gamePath = `${__dirname}/src/Games/${currentGameName}`;

const config = getBaseViteConfig(gamePath);
config.resolve.alias['storyScript'] = `${__dirname}/node_modules/storyscript`;

export default defineConfig(config);