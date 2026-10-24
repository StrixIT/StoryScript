import {buildEntities, entityTypeRegex, IDefinitions, startup, addArrayExtensions, addFunctionExtensions,ServiceFactory} from "storyScript";

if (!import.meta.env?.VITE_IS_MASTER) {
    // @ts-ignore
    await import('storyscript/styles');
}

import 'game/ui/styles/game.css'
// @ts-ignore
import {Rules} from 'game/rules';
// @ts-ignore
import {CustomTexts} from 'game/customTexts';
import {currentGameName} from "../../currentGameName";

addFunctionExtensions();
addArrayExtensions();
const definitions = importAssets();
const registeredEntities = buildEntities(definitions);
new ServiceFactory(currentGameName, definitions, registeredEntities, Rules(), CustomTexts());

startup();

export function importAssets(modules?: Record<string, unknown>): IDefinitions {
    const definitions = <IDefinitions>{};
    modules ??= import.meta.glob([
        'game/actions/**/*.ts',
        'game/features/**/*.ts',
        'game/items/**/*.ts',
        'game/enemies/**/*.ts',
        'game/persons/**/*.ts',
        'game/quests/**/*.ts',
        'game/locations/**/*.ts',
        'game/maps/**/*.ts'
    ], {eager: true, caseSensitive: false});

    // Loop over all found files to register the assets with the proper type.
    for (const path in modules) {
        const asset = modules[path];
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