import gameName from './gameName.js';
const gameDir = `src\\Games\\${gameName}`;

import { existsSync, mkdirSync, writeFileSync } from 'fs';

import pkg from 'jsonfile';
const { readFileSync } = pkg;

const assetType = process.argv[2];

if (!assetType) {
    console.log('You need to specify an asset type, e.g. location.');
    process.exit();
}

const assetName = process.argv[3];

if (!assetName) {
    console.log('You need to specify an asset name, e.g. \'Cave\'.');
    process.exit();
}

let snippetKey =  assetType.substring(0, 1).toUpperCase() + assetType.substring(1) + 's';
snippetKey = snippetKey.endsWith('ys') ? snippetKey.substring(0, snippetKey.length - 2) + 'ies' : snippetKey; 
const assetNameCapital = assetName.substring(0, 1).toUpperCase() + assetName.substring(1);

const snippets = readFileSync('CodeSnippets\\StoryScriptSnippets.code-snippets');

if (!snippets[snippetKey]) {
    console.log(`No asset type ${assetType} exists.`);
    process.exit();
}

const descriptionSnippet = snippets['Description'];

if (!descriptionSnippet) {
    console.log('The description snippet doesn\'t exist.');
    process.exit();
}

let includeDescription = !process.argv[4] || process.argv[4].toLowerCase() !== 'p';
includeDescription = (snippetKey === 'Locations' || snippetKey === 'Persons') || ((snippetKey === 'Items' || snippetKey === 'Enemies') && includeDescription);

let conversationSnippet = null;

if (snippetKey === 'Persons') {
    conversationSnippet = snippets['Conversation'];

    if (!conversationSnippet) {
        console.log('The conversation snippet doesn\'t exist.');
    }
}

const snippet = snippets[snippetKey];

// Keys go into the items folder.
const dirName = snippetKey === 'Keys' ? 'Items' : snippetKey;
const assetDir = `${gameDir}\\${dirName.toLowerCase()}`;
const assetBaseFileName = `${assetDir}\\${assetName}`;

if (!existsSync(assetDir)){
    mkdirSync(assetDir);
}

if (!includeDescription) {
    const cleaned = [];

    snippet.body = Object.keys(snippet.body).forEach(k => { 
        const l = snippet.body[k]; 
        if (!l.match(/import description from \'\.\/\$\{TM_FILENAME_BASE\}\.html';/g) && !l.match(/[\\t]{0,}description:/g)) {
            cleaned.push(l);
        } 
    });

    snippet.body = cleaned;
}

const tsString = snippet.body
                .join('\n')
                .replace(/\${TM_FILENAME_BASE}/g, assetName)
                .replace(/\${TM_FILENAME_BASE\/\(\.\*\)\/\${1:\/capitalize}\/}/g, assetNameCapital)
                .replace(/\$[0-9]{1,}/g, '');

// Write ts file
writeFileSync(assetBaseFileName + '.ts', tsString);

if (!includeDescription) {
    process.exit();
}

let htmlString = removePlaceholders(descriptionSnippet);

if (conversationSnippet) {
    htmlString = htmlString + '\n' + removePlaceholders(conversationSnippet);
}

// Write html file
writeFileSync(assetBaseFileName + '.html', htmlString);

function removePlaceholders(value) {
    return value.body
        .join('\n')
        .replace(/\$[0-9]{1,}/g, '');
}