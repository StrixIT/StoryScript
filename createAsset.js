const gameName = require('./gameName');
const gameDir = `src\\Games\\${gameName}`;

const fs = require('fs');

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
var assetNameCapital = assetName.substring(0, 1).toUpperCase() + assetName.substring(1);

var snippetData = fs.readFileSync('CodeSnippets\\StoryScriptSnippets.code-snippets', 'utf8');

snippetData = snippetData
                .replace(/\${TM_FILENAME_BASE}/g, '[gameNameLowered]')
                .replace(/\${TM_FILENAME_BASE\/\(\.\*\)\/\${1:\/capitalize}\/}/g, '[gameNameCapital]');

var snippets = JSON.parse(snippetData);

if (!snippets[snippetKey]) {
    console.log(`No asset type ${assetType} exists.`);
    return;
}

var descriptionSnippet = snippets['Description'];

if (!descriptionSnippet) {
    console.log('The description snippet doesn\'t exist.');
    return;
}

var snippet = snippets[snippetKey];
var assetDir = `${gameDir}\\${snippetKey.toLowerCase()}`;
var assetBaseFileName = `${assetDir}\\${assetName}`;

if (!fs.existsSync(assetDir)){
    fs.mkdirSync(assetDir);
}

var tsString = snippet.body
                .join('\n')
                .replace(/\[gameNameLowered\]/g, assetName)
                .replace(/\[gameNameCapital\]/g, assetNameCapital)
                .replace(/\$[0-9]{1,}/g, '')

// Write ts file
fs.writeFileSync(assetBaseFileName + '.ts', tsString);

var htmlString = descriptionSnippet.body
                    .join('\n')
                    .replace(/\$[0-9]{1,}/g, '');

// Write html file
fs.writeFileSync(assetBaseFileName + '.html', htmlString);