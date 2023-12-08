import gameName from './gameName.js';
const gameDir = `src\\Games\\${gameName}`;

import { existsSync, mkdirSync, writeFileSync } from 'fs';

import pkg from 'jsonfile';
const { readFileSync } = pkg;

var assetType = process.argv[2];

if (!assetType) {
    console.log('You need to specify an asset type, e.g. location.');
    process.exit();
}

var assetName = process.argv[3];

if (!assetName) {
    console.log('You need to specify an asset name, e.g. \'Cave\'.');
    process.exit();
}

var snippetKey =  assetType.substring(0, 1).toUpperCase() + assetType.substring(1) + 's';
snippetKey = snippetKey.endsWith('ys') ? snippetKey.substring(0, snippetKey.length - 2) + 'ies' : snippetKey; 
var assetNameCapital = assetName.substring(0, 1).toUpperCase() + assetName.substring(1);

var snippets = readFileSync('CodeSnippets\\StoryScriptSnippets.code-snippets');

if (!snippets[snippetKey]) {
    console.log(`No asset type ${assetType} exists.`);
    process.exit();
}

var descriptionSnippet = snippets['Description'];

if (!descriptionSnippet) {
    console.log('The description snippet doesn\'t exist.');
    process.exit();
}

var includeDescription = !process.argv[4] || process.argv[4].toLowerCase() !== 'p';
includeDescription = (snippetKey === 'Locations' || snippetKey === 'Persons') || ((snippetKey === 'Items' || snippetKey === 'Enemies') && includeDescription);

var conversationSnippet = null;

if (snippetKey === 'Persons') {
    var conversationSnippet = snippets['Conversation'];

    if (!conversationSnippet) {
        console.log('The conversation snippet doesn\'t exist.');
    }
}

var snippet = snippets[snippetKey];

// Keys go into the items folder.
var dirName = snippetKey === 'Keys' ? 'Items' : snippetKey;
var assetDir = `${gameDir}\\${dirName.toLowerCase()}`;
var assetBaseFileName = `${assetDir}\\${assetName}`;

if (!existsSync(assetDir)){
    mkdirSync(assetDir);
}

if (!includeDescription) {
    var cleaned = [];

    snippet.body = Object.keys(snippet.body).forEach(k => { 
        l = snippet.body[k]; 
        if (!l.match(/import description from \'\.\/\$\{TM_FILENAME_BASE\}\.html';/g) && !l.match(/[\\t]{0,}description:/g)) {
            cleaned.push(l);
        } 
    });

    snippet.body = cleaned;
}

var tsString = snippet.body
                .join('\n')
                .replace(/\${TM_FILENAME_BASE}/g, assetName)
                .replace(/\${TM_FILENAME_BASE\/\(\.\*\)\/\${1:\/capitalize}\/}/g, assetNameCapital)
                .replace(/\$[0-9]{1,}/g, '');

// Write ts file
writeFileSync(assetBaseFileName + '.ts', tsString);

if (!includeDescription) {
    process.exit();
}

var htmlString = removePlaceholders(descriptionSnippet);

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