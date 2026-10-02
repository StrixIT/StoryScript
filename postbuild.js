import fs from 'fs';
import {ZipArchive} from "archiver";
import path, {resolve} from "path";
import jsonfile from 'jsonfile';
import gameName from "./currentGameName.js";
import {fileURLToPath} from "url";
import sharp from 'sharp';
import {execFile} from 'child_process'
import ffmpegStatic from 'ffmpeg-static'

const {readFileSync} = jsonfile;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gamePath = resolve(__dirname, `./src/Games/${gameName}`);
const resourcePath = resolve(__dirname, `./dist/resources`);
const tempResourcePath = path.join(resourcePath, '_tmp');
const gameInfoPath = `${gamePath}/gameinfo.json`;
const gameInfo = readFileSync(gameInfoPath);

// 1. Copy the gameinfo.json file.
fs.copyFile(gameInfoPath, 'dist/gameinfo.json', () => {
});

// 2. Include the game sources if specified to do so.
if (gameInfo.sourcesIncluded) {
    fs.cpSync(gamePath, 'dist/sources', {recursive: true});

    if (fs.existsSync('dist/sources/resources')) {
        fs.rmSync('dist/sources/resources', {recursive: true});
    }

    await zipDirectory('dist/sources', 'dist/sources.zip');
    fs.rmSync('dist/sources', {recursive: true});
}

// 3. Optimize jpg and png images using sharp.
const imageFiles = getFiles(resourcePath, ['.jpg', '.png', 'webp']);

if (imageFiles?.length) {
    await optimizeFiles('images', imageFiles, async (filePath, tempPath) => {
        const sharpStream = sharp(filePath);
        if (filePath.indexOf('.png') > -1) {
            await sharpStream.png({quality: 80}).toFile(tempPath);
        } else if (filePath.indexOf('.jpg') > -1) {
            await sharpStream.jpeg({quality: 80}).toFile(tempPath);
        } else if (filePath.indexOf('.webp') > -1) {
            await sharpStream.webp({quality: 80}).toFile(tempPath);
        }
    });
}

// 4. Optimize sound files
const soundFiles = getFiles(resourcePath, ['.mp3']);

if (soundFiles?.length) {

    if (!ffmpegStatic) {
        console.error('FFmpeg is not installed. Please install it to optimize sound files.');
    } else {
        await optimizeFiles('sounds', soundFiles, async (filePath, tempPath) => {
            execFile(ffmpegStatic, ['-i', filePath, '-b:a', '64k', tempPath], (error) => {
                if (error) {
                    console.error(`Error converting ${filePath}:`, error.message);
                    reject(error);
                } else {
                    resolve(filePath);
                }
            });
        });
    }
}

async function optimizeFiles(type, files, conversionFunc) {
    console.log(`Optimize ${type}`)

    await Promise.all(files.map(async (file) => {
        const subdirectory = path.join(resourcePath, '_tmp', file.subdirectory);

        if (!fs.existsSync(subdirectory)) {
            fs.mkdirSync(subdirectory, {recursive: true});
        }

        const filePath = path.join(resourcePath, file.subdirectory, file.filepath);
        const tempPath = path.join(tempResourcePath, file.subdirectory, file.filepath);

        await conversionFunc(filePath, tempPath);
    }));

    console.log(`Replace ${type} with optimized versions`);

    await Promise.all(files.map(async (file) => {
        const filePath = path.join(resourcePath, file.subdirectory, file.filepath);
        const tempPath = path.join(tempResourcePath, file.subdirectory, file.filepath);
        await waitForFileReady(tempPath);
        await fs.promises.rename(tempPath, filePath);
    }));

    if (fs.existsSync(tempResourcePath)) {
        fs.rmSync(tempResourcePath, {recursive: true});
    }
}

function getFiles(dirPath, extensions, arrayOfFiles) {
    arrayOfFiles = arrayOfFiles || [];

    if (!fs.existsSync(dirPath)) {
        return;
    }

    const files = fs.readdirSync(dirPath);

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getFiles(dirPath + "/" + file, extensions, arrayOfFiles);
        } else if (extensions.find(e => file.indexOf(e) > -1)) {
            const subdirectory = dirPath.replace(resourcePath, '');
            arrayOfFiles.push({filepath: file, subdirectory: subdirectory});
        }
    })

    return arrayOfFiles;
}

function zipDirectory(sourceDir, outPath) {
    const archive = new ZipArchive({zlib: {level: 9}});
    const stream = fs.createWriteStream(outPath);

    return new Promise(async (resolve, reject) => {
        archive
            .directory(sourceDir, false)
            .on('error', err => reject(err))
            .pipe(stream)
        ;

        stream.on('close', () => resolve());
        await archive.finalize();
    });
}

async function waitForFileReady(filePath, maxWaitTime = 5000) {
    const startTime = Date.now();
    let lastSize = 0;
    let stableCount = 0;

    while (Date.now() - startTime < maxWaitTime) {
        try {
            const stat = await fs.promises.stat(filePath);

            // If file size hasn't changed for 2 checks, it's ready
            if (stat.size === lastSize) {
                stableCount++;
                if (stableCount >= 2) return true;
            } else {
                stableCount = 0;
            }

            lastSize = stat.size;
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    return true;
}