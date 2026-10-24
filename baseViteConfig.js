import fs from 'fs';
import {normalizePath} from 'vite';
import checker from 'vite-plugin-checker';
import {viteStaticCopy} from 'vite-plugin-static-copy';
import {visualizer} from "rollup-plugin-visualizer";
import path from 'path';
import vue from '@vitejs/plugin-vue';
import jsonfile from "jsonfile";
import {VitePWA} from 'vite-plugin-pwa'
import {fileURLToPath} from "url";

const {readFileSync} = jsonfile;

const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
const rootFolder = __dirname.includes('/node_modules/') ? `${__dirname.split('/node_modules/')[0]}` : __dirname;

const srcPath = `${rootFolder}/src`;

export const getBaseViteConfig = (gamePath) => {
    const gameInfoPath = `${gamePath}/webroot/gameinfo.json`;

    let gameInfo;

    if (fs.existsSync(gameInfoPath)) {
        gameInfo = readFileSync(gameInfoPath);
    }

    return {
        base: ``,
        publicDir: path.resolve(gamePath, 'webroot'),
        define: {
            'process.env': {}
        },
        resolve: {
            alias: {
                src: srcPath,
                game: gamePath,
                $resources: path.resolve(gamePath, 'resources')
            }
        },
        plugins: [
            {
                name: 'set-game-name-and-description',
                transformIndexHtml(html) {
                    return gameInfo ? html
                        .replace(/%STORYSCRIPT_GAME_NAME%/g, gameInfo.name)
                        .replace(/%STORYSCRIPT_GAME_DESCRIPTION%/g, gameInfo.description) : html;
                }
            },
            vue(),
            checker({
                typescript: true,
                vueTsc: true
            }),
            viteStaticCopy({
                watch: {
                    reloadPageOnChange: true
                },
                silent: true,
                targets: [
                    {
                        src: normalizePath(path.resolve(gamePath, 'resources/**/*.*')),
                        dest: 'resources',
                        // This is relative to the project root. So ./src/Games/{GameName}/resources will be trimmed. We
                        // cannot use 'stripBase: true' because we want to support placing resources in subdirectories.
                        rename: {stripBase: 4}
                    }
                ]
            }),
            {
                name: 'run-postbuild',
                apply: 'build',
                async writeBundle() {
                    const {postBuild} = await import('./scripts/postbuild.js');
                    await postBuild();
                }
            },
            VitePWA({
                registerType: 'autoUpdate',
                devOptions: {
                    enabled: false
                },
                workbox: {
                    globDirectory: 'dist',
                    globPatterns: [
                        'assets/**/*',
                        'resources/**/*',
                        'index.html',
                        'manifest.webmanifest',
                    ],
                }
            }),
            visualizer()
        ],
        server: {
            port: 3000,
            open: true
        },
        preview: {
            port: 8080,
        },
        build: {
            target: 'esnext',
            outDir: "./dist",
            sourcemap: false,
            rolldownOptions: {
                output: {
                    keepNames: true
                }
            }
        }
    };
};