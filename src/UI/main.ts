import {
    addArrayExtensions,
    addFunctionExtensions,
    startup
} from "storyScript";
import 'game/ui/styles/game.css'
// @ts-ignore
import('storyscript/styles');
// @ts-ignore
import {Rules} from 'game/rules';
// @ts-ignore
import {CustomTexts} from 'game/customTexts';
import {currentGameName} from "../../currentGameName";

addFunctionExtensions();
addArrayExtensions();
const assets = importAssets();
const components = getComponents();

startup(components, assets, currentGameName, Rules(), CustomTexts());

export function importAssets(): Record<string, unknown> {
    return import.meta.glob([
        'game/actions/**/*.ts',
        'game/features/**/*.ts',
        'game/items/**/*.ts',
        'game/enemies/**/*.ts',
        'game/persons/**/*.ts',
        'game/quests/**/*.ts',
        'game/locations/**/*.ts',
        'game/maps/**/*.ts'
    ], {eager: true, caseSensitive: false});
}

function getComponents(): Map<string, any> {
    const combinedTemplates = new Map<string, any>();
    const defaultTemplates = import.meta.glob('./Components/**/*.vue', {eager: true, caseSensitive: false});
    const customTemplates = import.meta.glob('game/ui/**/*.vue', {eager: true, caseSensitive: false});

    Object.keys(customTemplates).forEach(t => {
        const key = getKey(t);

        if (key) {
            combinedTemplates.set(getKey(t), customTemplates[t]);
        }
    });

    Object.keys(defaultTemplates).forEach(t => {
        const key = getKey(t);

        if (key && !combinedTemplates.has(key)) {
            combinedTemplates.set(key, defaultTemplates[t]);
        }
    });

    return combinedTemplates;
}

function getKey(path: string) {
    const capture = path.match(/([a-zA-Z]{1,}).vue$/);
    return capture ? capture[1] : null;
}