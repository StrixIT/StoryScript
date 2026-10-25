import path from 'path';
import {defineConfig, UserConfig} from 'vite';
import {visualizer} from "rollup-plugin-visualizer";
import dts from "vite-plugin-dts";
import {currentGameName} from './currentGameName.js';
import {getBaseViteConfig} from "./baseViteConfig.js";
import {fileURLToPath} from "url";

const isLibraryBuild = process.env.VITE_BUILD_LIB === 'true';

const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
const gamePath = `${__dirname}/src/Games/${currentGameName}`;
const viteConfig = getBaseViteConfig(gamePath) as UserConfig
const libraryConfig = getBaseViteConfig(gamePath) as UserConfig

[viteConfig, libraryConfig].forEach(config => {
    config.plugins.push(visualizer());
    
    const alias = config.resolve!.alias as any;
    alias['storyScript'] = path.resolve(import.meta.dirname, './src');
    alias['storyscript/styles'] = path.resolve(import.meta.dirname, './src/UI/styles/empty.css');
    alias['ui'] = path.resolve(import.meta.dirname, `./src/UI`);

    config.css = {
        preprocessorOptions: {
            scss: {
                logger: {
                    warn() {
                    } // Suppress all warnings to silence bootstrap issues. Try removing this when bootstraps upgrades to 5.4+.
                },
            },
        },
    };
});

const buildOptions = libraryConfig.build!;
buildOptions.sourcemap = true;
buildOptions.minify = false;

buildOptions.rolldownOptions.external = ['vue'];
(buildOptions.rolldownOptions.output as any).globals = {vue: 'Vue'};

buildOptions.lib = {
    entry: path.resolve(import.meta.dirname, 'src/index.ts'),
    name: 'StoryScript',
    fileName: (format) => `storyscript.${format === 'es' ? 'mjs' : 'js'}`
};

// Remove PWA plugins when building a package.
libraryConfig.plugins = libraryConfig.plugins.filter((p: any) => {
    return !Array.isArray(p) || !p[0].name?.startsWith('vite-plugin-pwa');
});

libraryConfig.plugins!.push(dts());

export default defineConfig(isLibraryBuild ? libraryConfig : viteConfig);