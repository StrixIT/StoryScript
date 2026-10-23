import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const command = process.argv[2];
const projectRoot = process.cwd();

// Package directory is node_modules/storyscript
const packageDir = path.resolve(__dirname, '..');

async function setup() {
    console.log('🚀 Setting up storyscript...');
    console.log(`📁 Target: ${projectRoot}`);

    fs.moveSync(path.join(packageDir, 'helpers.js'), path.join(packageDir, 'dist/helpers.js'));
    fs.moveSync(path.join(packageDir, 'baseViteConfig.js'), path.join(packageDir, 'dist/baseViteConfig.js'));
    
    const filesToCopy = [
        ['CodeSnippets/StoryScriptSnippets.code-snippets', '.vscode/StoryScriptSnippets.code-snippets'],
        ['clientFiles/tsconfig.json', 'tsconfig.json'],
        ['clientFiles/vite.config.ts', 'vite.config.ts'],
        '.env'
    ];

    try {
        for (const file of filesToCopy) {
            const srcFile = Array.isArray(file) ? file[0] : file;
            const destFile = Array.isArray(file) ? file[1] : file;
            
            const src = path.join(packageDir, srcFile);
            const dest = path.join(projectRoot, destFile);

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

        console.log('✅ Setup complete!');
        console.log('\nNext steps:');
        console.log('  npm run storyscript create-game your-game-name');
        console.log('  npm run storyscript start');
    } catch (err) {
        console.error('❌ Setup failed:', err.message);
        process.exit(1);
    }
}

async function start() {
    // Proxy to vite
    const { spawn } = await import('child_process');
    spawn('npx', ['start'], { stdio: 'inherit' });
}

async function publish() {
    // Proxy to vite
    const { spawn } = await import('child_process');
    spawn('npx', ['publish'], { stdio: 'inherit' });
}

async function createGame() {
    // Proxy to vite
    const { spawn } = await import('child_process');
    spawn('npx', ['vite', 'build'], { stdio: 'inherit' });
}

async function main() {
    if (command === 'setup') {
        await setup();
    } else if (command === 'create-game') {
        await createGame();
    } else if (command === 'dev') {
        await start();
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
        console.log('  publish      Build your game for deployment');
        console.log('  preview      preview your game ready for deployment');
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
