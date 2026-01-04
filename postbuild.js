import fs from 'fs';
import archiver from 'archiver';
import path, { resolve } from "path";
import jsonfile from 'jsonfile';
import gameName from "./currentGameName.js";
import { fileURLToPath } from "url";
import sharp from 'sharp';

const { readFileSync } = jsonfile;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gamePath = resolve(__dirname, `./src/Games/${gameName}`);
const resourcePath = resolve(__dirname, `./dist/resources`);
const tempResourcePath = path.join(resourcePath, '_tmp');
const gameInfoPath = `${gamePath}/gameinfo.json`;
const gameInfo = readFileSync(gameInfoPath);

// 1. Copy the gameinfo.json file.
fs.copyFile(gameInfoPath, 'dist/gameinfo.json', e => console.log(e));

// 2. Include the game sources if specified to do so.
if (gameInfo.sourcesIncluded) {
    fs.cpSync(gamePath, 'dist/sources',{ recursive: true }, e => console.log(e));
    fs.rmSync('dist/sources/resources', { recursive: true }, e => console.log(e));
    await zipDirectory('dist/sources', 'dist/sources.zip');
    fs.rmSync('dist/sources', { recursive: true }, e => console.log(e));
}

// 3. Optimize jpg and png images using sharp.
const imageFiles = getImageFiles(resourcePath);

if (imageFiles?.length) {
    await optimizeImages(imageFiles);
}

async function optimizeImages(imageFiles) {
    console.log('Optimize images')

    await Promise.all(imageFiles.map(async (file) => {
        const subdirectory = path.join(resourcePath, '_tmp', file.subdirectory);

        if (!fs.existsSync(subdirectory)){
            fs.mkdirSync(subdirectory, { recursive: true });
        }

        const filePath = path.join(resourcePath, file.subdirectory, file.filepath);
        const tempPath = path.join(tempResourcePath, file.subdirectory, file.filepath);

        const sharpStream = sharp(filePath);
        if (filePath.indexOf('.png') > -1) {
            await sharpStream.png({ quality: 80 }).toFile(tempPath);
        } else if (filePath.indexOf('.jpg') > -1) {
            await sharpStream.jpeg({ quality: 80 }).toFile(tempPath);
        }
    }));

    console.log('Replace images with optimized versions');

    await Promise.all(imageFiles.map(async (file) => {
        const filePath = path.join(resourcePath, file.subdirectory, file.filepath);
        const tempPath = path.join(tempResourcePath, file.subdirectory, file.filepath);
        await fs.promises.rename(tempPath, filePath);
    }));

    if (fs.existsSync(tempResourcePath)){
        fs.rmSync(tempResourcePath, { recursive: true });
    }
}

function getImageFiles(dirPath, arrayOfFiles) {
    arrayOfFiles = arrayOfFiles || [];
    
    if (!fs.existsSync(dirPath)) {
        return;
    }
    
    const files = fs.readdirSync(dirPath);

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getImageFiles(dirPath + "/" + file, arrayOfFiles);
        } else if (file.indexOf('.jpg') > -1 || file.indexOf('.png') > -1) {
            const subdirectory = dirPath.replace(resourcePath, '');
            arrayOfFiles.push({ filepath: file, subdirectory: subdirectory });
        }
    })

    return arrayOfFiles;
}

function zipDirectory(sourceDir, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = fs.createWriteStream(outPath);

    return new Promise((resolve, reject) => {
        archive
            .directory(sourceDir, false)
            .on('error', err => reject(err))
            .pipe(stream)
        ;

        stream.on('close', () => resolve());
        archive.finalize();
    });
}