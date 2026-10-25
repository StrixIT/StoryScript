#!/usr/bin/env node

import path from 'path';
import fs from 'fs-extra';
import {fileURLToPath} from 'url';
import {spawn} from 'child_process';
import {setJsonFileProperty} from "./helpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const command = process.argv[2];
const args = process.argv.slice(3);
const projectRoot = process.cwd();

const packageDir = path.resolve(__dirname, '..');

async function main() {
    if (command === 'setup') {
        await setup();
    } else if (command === 'game') {
        await createGame(args[0]);
    } else if (command === 'start') {
        await executeTask('vite');
    } else if (command === 'start:electron') {
        await electron(true);
    } else if (command === 'test') {
        await runTests();
    } else if (command === 'publish') {
        await executeTask('vite', ['build']);
    } else if (command === 'preview') {
        await executeTask('vite', ['preview']);
    } else if (command === 'publish') {
        await executeTask('vite', ['build']);
    } else if (command === 'publish:electron') {
        await electron(false);
    } else if (/^(location)|(feature)|(map)|(item)|(key)|(enemy)|(person)|(quest)|(action)$/i.test(command)) {
        await createAsset(command, args[0]);
    } else {
        console.log('Usage: storyscript <command>');
        console.log('\nCommands:');
        console.log('  setup            Setup StoryScript. Run automatically on npm install.');
        console.log('  game     [name]  Create a new StoryScript game.');
        console.log('  location [name]  Create a new StoryScript Location.');
        console.log('  feature  [name]  Create a new StoryScript stand-alone Feature.');
        console.log('  map      [name]  Create a new StoryScript Map.');
        console.log('  item     [name]  Create a new StoryScript Item.');
        console.log('  key      [name]  Create a new StoryScript Key.');
        console.log('  enemy    [name]  Create a new StoryScript Enemy.');
        console.log('  person   [name]  Create a new StoryScript Person.');
        console.log('  quest    [name]  Create a new StoryScript Quest.');
        console.log('  action   [name]  Create a new StoryScript stand-alone Action.');
        console.log('  start            Start running your game in development mode.');
        console.log('  test             Run the tests for your game. This will setup testing if you don\'t have any tests yet.');
        console.log('  publish          Build your game for deployment as a web app.');
        console.log('  preview          preview your published web app game.');
        console.log('  start:electron   Start running your game in electron.');
        console.log('  publish:electron Build your game for deployment as an electron executable. This will setup electron if you don\'t have it yet.');
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});

async function setup() {
    console.log('🚀 Setting up StoryScript...');
    console.log(`📁 Target: ${projectRoot}`);

    fs.moveSync(path.join(packageDir, 'baseViteConfig.js'), path.join(packageDir, 'dist/baseViteConfig.js'));
    fs.moveSync(path.join(packageDir, 'scripts/postbuild.js'), path.join(packageDir, 'dist/scripts/postbuild.js'));
    fs.copySync(path.join(packageDir, 'scripts/helpers.js'), path.join(packageDir, 'dist/scripts/helpers.js'));

    const filesToCopy = [
        ['CodeSnippets/StoryScriptSnippets.code-snippets', '.vscode/StoryScriptSnippets.code-snippets', true],
        ['clientFiles/tsconfig.json', 'tsconfig.json', true],
        ['clientFiles/vite.config.ts', 'vite.config.ts', true],
        ['clientFiles/gitignore', '.gitignore', false],
        ['clientFiles/currentGameName.js', 'currentGameName.js', false],
        ['src/UI/Components', true],
        ['src/UI/main.ts', true],
        ['index.html', true],
        ['typeExtensions.d.ts', true],
        ['shims-vue.d.ts', true],
        ['vite-env.d.ts', true],
        ['.env', false]
    ];

    try {
        for (const file of filesToCopy) {
            copyFile(file);
        }

        setJsonFileProperty(path.join(projectRoot, 'package.json'), 'type', 'module');

        console.log('✅ Setup complete!');
        console.log('\nNext steps:');
        console.log('  npx storyscript game your-game-name');
        console.log('  npx storyscript start');
    } catch (err) {
        console.error('❌ Setup failed:', err.message);
        process.exit(1);
    }
}

async function runTests() {
    const scriptPath = path.join(__dirname, 'setupTesting.js');
    copyFile(['clientFiles/vitest.config.ts', 'vitest.config.ts', false]);
    await executeTask('node', [scriptPath]);
    await executeTask('npm', ['install', 'jsdom@latest', '@vitest/ui@latest', '@vitest/coverage-v8@latest', '--save-dev']);
    await executeTask('vitest', ['--ui'], false);
}

async function electron(preview) {
    copyFile(['electron.cjs', false]);
    
    const gameName = await getGameName();
    
    setJsonFileProperty(path.join(projectRoot, 'package.json'), 'name', gameName);
    setJsonFileProperty(path.join(projectRoot, 'package.json'), 'version', '1.0.0');
    setJsonFileProperty(path.join(projectRoot, 'package.json'), 'main', './electron.cjs');
    setJsonFileProperty(path.join(projectRoot, 'package.json'), 'build', {
        "appId": "storyscript.id",
        "files": [
            "./electron.cjs",
            "dist/**/*"
        ],
        "win": {
            "target": "portable",
            "icon": "dist/icon.ico"
        }
    });
    
    await executeTask('npm', ['install', 'electron@latest', 'electron-builder@latest', '--save-dev']);
    await executeTask('vite', ['build']);
    
    if (preview) {
        await executeTask('electron', ['.'], false);
    } else {
        await executeTask('electron-builder', [], false);
    }
}

async function createGame(gameName) {
    if (!gameName) {
        console.error('Error: Game name is required');
        console.error('Usage: npx storyscript create-game <gameName>');
        process.exit(1);
    }

    const scriptPath = path.join(__dirname, 'createGame.js');
    await executeTask('node', [scriptPath, gameName]);
}

async function createAsset(commandName, assetName) {
    if (!assetName) {
        console.error('Error: Asset name is required');
        console.error(`Usage: npx storyscript ${commandName} <assetName>`);
        process.exit(1);
    }

    const scriptPath = path.join(__dirname, 'createAsset.js');

    await executeTask('node', [scriptPath, commandName, assetName]);
}

async function getGameName() {
    const nameModule = await import(path.resolve(projectRoot, 'currentGameName.js'));
    return nameModule.currentGameName;
}

async function executeTask(command, args, waitForCompletion){
    if (waitForCompletion === undefined || waitForCompletion) {
        return new Promise((resolve, reject) => {
            const child = spawn(command, args, {
                stdio: 'inherit'
            });

            child.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Command ${command} failed with code ${code}`));
                }
            });

            child.on('error', (err) => {
                reject(err);
            });
        });
    }

    spawn(command, args, {
        stdio: 'inherit'
    });
}

function copyFile(file) {
    const srcFile = file[0];
    const destFile = file.length < 3 ? file[0] : file[1];
    const overWrite = file.length < 3 ? file[1] : file[2];

    const src = path.join(packageDir, srcFile);
    const dest = path.join(projectRoot, destFile);

    const stat = fs.statSync(src);

    if (stat.isDirectory()) {
        fs.cpSync(src, dest, {recursive: true});
        return;
    }

    if (!fs.existsSync(src)) {
        console.warn(`⚠️  ${srcFile} not found in template`);
        return;
    }

    if (fs.existsSync(dest)) {
        if (fs.existsSync(dest) && !overWrite) {
            return;
        }
    }

    fs.copySync(src, dest);
}