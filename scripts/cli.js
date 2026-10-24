#!/usr/bin/env node

import path from 'path';
import fs from 'fs-extra';
import {fileURLToPath} from 'url';
import {spawn} from 'child_process';
import {updatePackageJson} from "./helpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const command = process.argv[2];
const args = process.argv.slice(3);
const projectRoot = process.cwd();

// Package directory is node_modules/storyscript
const packageDir = path.resolve(__dirname, '..');

async function main() {
    if (command === 'setup') {
        await setup();
    } else if (command === 'create-game') {
        await createGame(args[0]);
    } else if (command === 'start') {
        await executeTask('vite');
    } else if (command === 'test') {
        await executeTask('vite', ['vitest', '--ui']);
    } else if (command === 'publish') {
        await executeTask('vite', ['build']);
    } else if (command === 'preview') {
        await executeTask('vite', ['preview']);
    } else if (/^(location)|(feature)|(map)|(item)|(key)|(enemy)|(person)|(quest)|(action)$/i.test(command)) {
        await createAsset(command, args[0]);
    } else {
        console.log('Usage: storyscript <command>');
        console.log('\nCommands:');
        console.log('  setup        Setup StoryScript. Run automatically on npm install.');
        console.log('  create-game  Create a new StoryScript game');
        console.log('  start        Start running your game in development mode.');
        console.log('  test         Run the tests for your games.');
        console.log('  publish      Build your game for deployment');
        console.log('  preview      preview your game ready for deployment');
        console.log('  location     Create a new StoryScript Location');
        console.log('  feature      Create a new StoryScript stand-alone Feature');
        console.log('  map          Create a new StoryScript Map');
        console.log('  item         Create a new StoryScript Item');
        console.log('  key          Create a new StoryScript Key');
        console.log('  enemy        Create a new StoryScript Enemy');
        console.log('  person       Create a new StoryScript Person');
        console.log('  quest        Create a new StoryScript Quest');
        console.log('  action       Create a new StoryScript stand-alone Action');
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});

async function setup() {
    console.log('🚀 Setting up storyscript...');
    console.log(`📁 Target: ${projectRoot}`);

    fs.moveSync(path.join(packageDir, 'baseViteConfig.js'), path.join(packageDir, 'dist/baseViteConfig.js'));
    fs.moveSync(path.join(packageDir, 'scripts/postbuild.js'), path.join(packageDir, 'dist/scripts/postbuild.js'));
    fs.copySync(path.join(packageDir, 'scripts/helpers.js'), path.join(packageDir, 'dist/scripts/helpers.js'));

    const filesToCopy = [
        ['CodeSnippets/StoryScriptSnippets.code-snippets', '.vscode/StoryScriptSnippets.code-snippets', true],
        ['clientFiles/tsconfig.json', 'tsconfig.json', true],
        ['clientFiles/vite.config.ts', 'vite.config.ts', true],
        ['clientFiles/currentGameName.js', 'currentGameName.js', false],
        ['clientFiles/.env', '.env', false],
        ['src/UI/Components', true],
        ['src/UI/main.ts', true],
        ['index.html', true],
        ['typeExtensions.d.ts', true],
        ['shims-vue.d.ts', true],
        ['vite-env.d.ts', true]
    ];

    try {
        for (const file of filesToCopy) {
            const srcFile = file[0];
            const destFile = file.length < 3 ? file[0] : file[1];
            const overWrite = file.length < 3 ? file[1] : file[2];

            const src = path.join(packageDir, srcFile);
            const dest = path.join(projectRoot, destFile);

            const stat = fs.statSync(src);

            if (stat.isDirectory()) {
                fs.cpSync(src, dest, {recursive: true});
                continue;
            }

            if (!fs.existsSync(src)) {
                console.warn(`⚠️  ${srcFile} not found in template`);
                continue;
            }

            if (fs.existsSync(dest)) {
                if (fs.existsSync(dest) && !overWrite) {
                    continue;
                }
            }

            fs.copySync(src, dest);
        }

        updatePackageJson(path.join(projectRoot, 'package.json'), 'type', 'module');

        console.log('✅ Setup complete!');
        console.log('\nNext steps:');
        console.log('  npx storyscript create-game your-game-name');
        console.log('  npx storyscript start');
    } catch (err) {
        console.error('❌ Setup failed:', err.message);
        process.exit(1);
    }
}

async function executeTask(command, args){
    spawn(command, args, {
        stdio: 'inherit'
    });
}

async function createGame(gameName) {
    if (!gameName) {
        console.error('Error: Game name is required');
        console.error('Usage: npx storyscript create-game <gameName>');
        process.exit(1);
    }

    const scriptPath = path.join(__dirname, 'createGame.js');

    spawn('node', [scriptPath, gameName], {
        stdio: 'inherit'
    });
}

async function createAsset(commandName, assetName) {
    if (!assetName) {
        console.error('Error: Asset name is required');
        console.error(`Usage: npx storyscript ${commandName} <assetName>`);
        process.exit(1);
    }

    const scriptPath = path.join(__dirname, 'createAsset.js');

    spawn('node', [scriptPath, commandName, assetName], {
        stdio: 'inherit'
    });
}