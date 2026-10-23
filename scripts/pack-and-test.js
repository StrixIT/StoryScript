#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function run(command, silent = true) {
    const stdio = silent ? 'pipe' : 'inherit';
    try {
        execSync(command, { stdio, shell: true });
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

console.log('🔨 Building...');
run('npm run publish');

console.log('📦 Packing...');
run('npm pack');

// Find the most recent tarball
const files = fs.readdirSync('.')
    .filter(f => f.match(/^storyscript-\d+\.\d+\.\d+\.tgz$/))
    .sort((a, b) => fs.statSync(b).mtime - fs.statSync(a).mtime);

if (files.length === 0) {
    console.error('❌ Error: No tarball found');
    process.exit(1);
}

const tarball = files[0];
console.log(`📦 Installing ${tarball} in test-project...`);

// Resolve absolute path to tarball
const tarballPath = path.resolve(tarball);
const testProjectPath = path.resolve('../../test-project');

// Install in test project
run(`cd "${testProjectPath}" && npm install --silent "${tarballPath}"`, false);

run(`cd "${testProjectPath}" && node node_modules/.bin/storyscript setup`, false);

console.log('✅ Test installation complete!');