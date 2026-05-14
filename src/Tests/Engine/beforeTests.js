import {join} from 'node:path';
import fs from "fs";
import {copyFileSync, existsSync, mkdirSync, readdir, rmSync, statSync} from 'node:fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const testAssetsDirectory = join(__dirname, './assets/');
const gameDirectory = join(__dirname, '../../Games');

const testAssets = JSON.parse(fs.readFileSync(join (__dirname, './testAssets.json')));

if (existsSync(testAssetsDirectory)) {
    rmSync(testAssetsDirectory, {recursive: true});
}

mkdirSync(testAssetsDirectory, {recursive: true});

const copyFiles = function (directory, assets) {
    readdir(join(gameDirectory, directory), (err, files) => {
        files?.forEach(file => {
            const source = join(gameDirectory, directory, file);
            const target = join(testAssetsDirectory, directory, file);

            if (statSync(source).isFile() === false) {
                copyFiles(join(directory, file), assets);
            } else {
                const asset = `${directory}/${file}`.toLowerCase();
                
                const isMatch = assets.find(a => {
                    const isRootTsFile = a.endsWith('/') && !directory.includes('/') && asset.endsWith('.ts');
                    const isInterfaceFile = a.endsWith('interfaces/') && directory.includes('/interfaces') && asset.endsWith('.ts');
                    const isIncludedAsset = !a.endsWith('/') && asset.includes(a.toLowerCase());
                    return isRootTsFile || isInterfaceFile || isIncludedAsset;
                });
                
                if (isMatch) {
                    const targetDir = join(testAssetsDirectory, directory);
                    mkdirSync(targetDir, {recursive: true});
                    copyFileSync(source, target);   
                }
            }
        });
    });
}

testAssets.games.forEach(game => {
    const assets = ['/', 'interfaces/'];

    game.assets.forEach(a => {
        assets.push(a + '.ts');
        assets.push(a + '.html');
    });
    
    copyFiles(game.folder, assets);
});