import {entityTypeRegex, IDefinitions, IGame} from 'storyScript';
import {parseHtmlDocumentFromString} from "src/Engine/utilityFunctions";

export function getDefinitions(assets: Record<string, unknown>){
    const definitions = <IDefinitions>{};
    
    // Loop over all found files to register the assets with the proper type.
    for (const path in assets) {
        const asset = assets[path];
        const entityType = entityTypeRegex.exec(path)?.[0];

        if (!entityType) {
            throw new Error(`'${path}' is not a valid entity type path!`);
        }

        const property = Object.getOwnPropertyNames(asset)[0];
        const entityFunc = asset[property];

        // Add the entity function to the definitions object for creating entities at run-time.
        definitions[entityType] = definitions[entityType] || [];

        if (definitions[entityType].indexOf(entityFunc) === -1) {
            definitions[entityType].push(entityFunc);
        }
    }

    return definitions;
}

export function checkAutoplay(game: IGame, value: string) {
    if (!value) {
        return;
    }

    const htmlDocumentFromString = parseHtmlDocumentFromString(value).body;
    value = htmlDocumentFromString.innerHTML;
    value = checkAutoplayProperties(value, htmlDocumentFromString.getElementsByTagName('audio'), game.sounds.playedAudio);
    value = checkAutoplayProperties(value, htmlDocumentFromString.getElementsByTagName('video'), game.sounds.playedAudio);
    return value;
}

const autoplayAttribute = 'autoplay';
const sourceAttribute = 'src';

function checkAutoplayProperties(value: string, elements: HTMLCollectionOf<HTMLElement>, playedAudio: string[]) {
    Array.from(elements).forEach(e => {
        const originalText = e.outerHTML;
        const source = e.getElementsByTagName('source')[0]?.getAttribute(sourceAttribute)?.toLowerCase()
            ?? e.getAttribute(sourceAttribute)?.toLowerCase();

        if (originalText && source && e.hasAttribute(autoplayAttribute)) {
            if (playedAudio.indexOf(source) < 0) {
                playedAudio.push(source);
            } else {
                e.removeAttribute(autoplayAttribute);
                value = value.replace(originalText, e.outerHTML);
            }
        }
    });

    return value;
}