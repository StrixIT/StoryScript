const gameName = require('./gameName');
const gameDir = `src\\Games\\${gameName}`;

const fs = require('fs');
const jf = require('jsonfile');

var assetType = process.argv[2];

if (!assetType) {
    console.log('You need to specify an asset type, e.g. location.');
    return;
}

var assetName = process.argv[3];

if (!assetName) {
    console.log('You need to specify an asset name, e.g. \'Cave\'.');
    return;
}

var snippetKey =  assetType.substring(0, 1).toUpperCase() + assetType.substring(1) + 's';
snippetKey = snippetKey.endsWith('ys') ? snippetKey.substring(0, snippetKey.length - 2) + 'ies' : snippetKey; 
var assetNameCapital = assetName.substring(0, 1).toUpperCase() + assetName.substring(1);

var snippets = jf.readFileSync('CodeSnippets\\StoryScriptSnippets.code-snippets');

if (!snippets[snippetKey]) {
    console.log(`No asset type ${assetType} exists.`);
    return;
}

var descriptionSnippet = snippets['Description'];

if (!descriptionSnippet) {
    console.log('The description snippet doesn\'t exist.');
    return;
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

if (!fs.existsSync(assetDir)){
    fs.mkdirSync(assetDir);
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
fs.writeFileSync(assetBaseFileName + '.ts', tsString);

if (!includeDescription) {
    return;
}

var htmlString = removePlaceholders(descriptionSnippet);

if (conversationSnippet) {
    htmlString = htmlString + '\n' + removePlaceholders(conversationSnippet);
}

// Write html file
fs.writeFileSync(assetBaseFileName + '.html', htmlString);

function removePlaceholders(value) {
    return value.body
        .join('\n')
        .replace(/\$[0-9]{1,}/g, '');
}