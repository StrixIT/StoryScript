import {getBaseViteConfig} from "storyscript/vite-config";
import {defineConfig} from "vite";
import {fileURLToPath} from "url";
import path from "path";

const config = getBaseViteConfig();
const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

config.resolve.alias['storyScript'] = `${__dirname}/node_modules/storyscript`;

export default defineConfig(config);