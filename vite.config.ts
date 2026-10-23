import path from 'path';
import {defineConfig, UserConfig} from 'vite';
import dts from "vite-plugin-dts";
import {getBaseViteConfig} from "./baseViteConfig";

const isLibraryBuild = process.env.VITE_BUILD_LIB === 'true';

console.log(isLibraryBuild);

const viteConfig = getBaseViteConfig() as UserConfig
const libraryConfig = getBaseViteConfig() as UserConfig

[viteConfig, libraryConfig].forEach(config => {
    const alias = config.resolve!.alias as any;
    alias['storyScript'] = path.resolve(import.meta.dirname, './src');
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

const rolldownOptions = libraryConfig.build!.rolldownOptions!;
rolldownOptions.external = ['vue'];
(rolldownOptions.output as any).globals = { vue: 'Vue' };

libraryConfig.build!.lib = {
    entry: path.resolve(import.meta.dirname, 'src/index.ts'),
    name: 'StoryScript',
    fileName: (format) => `storyscript.${format === 'es' ? 'mjs' : 'js'}`
};

libraryConfig.plugins!.push(dts());

export default defineConfig(isLibraryBuild ? libraryConfig : viteConfig);