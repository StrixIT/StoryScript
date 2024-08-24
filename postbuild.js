import fs from 'fs';
import archiver from 'archiver';
import path, { resolve } from "path";
import jsonfile from 'jsonfile';
import gameName from "./gameName.js";
import { fileURLToPath } from "url";
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';

const { readFileSync } = jsonfile;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gamePath = resolve(__dirname, `./src/Games/${gameName}`);
const gameInfoPath = `${gamePath}/gameinfo.json`;
const gameInfo = readFileSync(gameInfoPath);

fs.copyFile(gameInfoPath, 'dist/gameinfo.json', () => {});

if (gameInfo.sourcesIncluded) {
    await zipDirectory(gamePath, 'dist/sources.zip');
}

await imagemin(['dist/resources/*.{jpg,png}'], {
    destination: 'dist/resources',
    plugins: [
        imageminJpegtran(),
        imageminPngquant({
            quality: [0.6, 0.8]
        })
    ]
});

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