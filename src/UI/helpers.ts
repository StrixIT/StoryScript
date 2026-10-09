import {IGame} from "storyScript/Interfaces/game.ts";
import {parseHtmlDocumentFromString} from "storyScript/utilityFunctions.ts";

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