#!/usr/bin/env node

import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

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
        await start();
    } else if (command === 'test') {
        await test();
    } else if (command === 'publish') {
        await publish();
    } else if (command === 'preview') {
        const { spawn } = await import('child_process');
        spawn('npx', ['vite', 'preview'], { stdio: 'inherit' });
    } else {
        console.log('Usage: storyscript <command>');
        console.log('\nCommands:');
        console.log('  setup        Setup StoryScript. Run automatically on npm install.');
        console.log('  create-game  Create a new StoryScript game');
        console.log('  start        Start running your game in development mode.');
        console.log('  test         Run the tests for your games.');
        console.log('  publish      Build your game for deployment');
        console.log('  preview      preview your game ready for deployment');
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

    const filesToCopy = [
        ['CodeSnippets/StoryScriptSnippets.code-snippets', '.vscode/StoryScriptSnippets.code-snippets'],
        ['clientFiles/tsconfig.json', 'tsconfig.json'],
        ['clientFiles/vite.config.ts', 'vite.config.ts'],
        ['clientFiles/currentGameName.js', 'currentGameName.js'],
        ['clientFiles/.env', '.env'],
        'src/UI/Components',
        'src/UI/main.ts',
        'index.html',
        'typeExtensions.d.ts',
        'shims-vue.d.ts',
        'vite-env.d.ts',
    ];

    try {
        for (const file of filesToCopy) {
            const srcFile = Array.isArray(file) ? file[0] : file;
            const destFile = Array.isArray(file) ? file[1] : file;

            const src = path.join(packageDir, srcFile);
            const dest = path.join(projectRoot, destFile);

            const stat = fs.statSync(src);
            
            if (stat.isDirectory()) {
                if (fs.existsSync(dest)) {
                    console.log(`⏭️  ${srcFile} already exists, skipping`);
                }
                
                fs.cpSync(src, dest, {recursive: true});
                continue;
            }
            
            if (!fs.existsSync(src)) {
                console.warn(`⚠️  ${srcFile} not found in template`);
                continue;
            }

            if (fs.existsSync(dest)) {
                console.log(`⏭️  ${srcFile} already exists, skipping`);
                continue;
            }

            console.log(`✅ Copying ${srcFile}...`);
            fs.copySync(src, dest);
        }
        
        updatePackageJson(path.join(projectRoot, 'package.json'));

        console.log('✅ Setup complete!');
        console.log('\nNext steps:');
        console.log('  npx storyscript create-game your-game-name');
        console.log('  npx storyscript start');
    } catch (err) {
        console.error('❌ Setup failed:', err.message);
        process.exit(1);
    }
}

function updatePackageJson(filePath) {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const jsonObject = JSON.parse(rawData);
    jsonObject['type'] = 'module';
    fs.writeFileSync(filePath, JSON.stringify(jsonObject, null, 2), 'utf8');
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

async function start() {
    spawn('vite', [], {
        stdio: 'inherit'
    });
}

async function test() {
    spawn('vite', ['vitest', '--ui'], {
        stdio: 'inherit'
    });
}

async function publish() {
    spawn('vite', ['build'], /*should be: tsc && vite build*/{
        stdio: 'inherit'
    });
}