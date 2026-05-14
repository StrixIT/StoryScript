import {join} from 'node:path';
import fs from "fs";
import {copyFileSync, existsSync, mkdirSync, readdir, rmSync, statSync} from 'node:fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const testAssetsDirectory = join(__dirname, './assets/');
const gameDirectory = join(__dirname, '../../Games');
const testGames = JSON.parse(fs.readFileSync(join (__dirname, './testGames.json')));

const copyFiles = function (directory) {
    readdir(join(gameDirectory, directory), (err, files) => {
        files?.forEach(file => {
            const source = join(gameDirectory, directory, file);
            const target = join(testAssetsDirectory, directory, file);

            if (statSync(source).isFile() === false) {
                copyFiles(join(directory, file));
            } else {
                if (file.endsWith('.ts') || file.endsWith('.html')) {
                    const targetDir = join(testAssetsDirectory, directory);
                    mkdirSync(targetDir, {recursive: true});
                    copyFileSync(source, target);   
                }
            }
        });
    });
}

if (!existsSync(testAssetsDirectory)) {
    mkdirSync(testAssetsDirectory);
}

testGames.forEach(game => {
    const gameFolder = join(gameDirectory, game);
    
    if (!existsSync(gameFolder)) {
        return;
    }
    
    const assetsFolder = join(testAssetsDirectory, game);
    
    if (existsSync(assetsFolder)) {
        rmSync(assetsFolder, {recursive: true});    
    }
    
    mkdirSync(assetsFolder);
    copyFiles(game);
});