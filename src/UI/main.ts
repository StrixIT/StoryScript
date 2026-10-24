import {
    addArrayExtensions,
    addFunctionExtensions,
    buildEntities,
    entityTypeRegex,
    IDefinitions,
    ServiceFactory,
    startup
} from "storyScript";
import 'game/ui/styles/game.css'
// @ts-ignore
import {Rules} from 'game/rules';
// @ts-ignore
import {CustomTexts} from 'game/customTexts';
import {currentGameName} from "../../currentGameName";

if (!import.meta.env?.VITE_IS_MASTER) {
    // @ts-ignore
    await import('storyscript/styles');
}

addFunctionExtensions();
addArrayExtensions();
const definitions = importAssets();
const registeredEntities = buildEntities(definitions);
new ServiceFactory(currentGameName, definitions, registeredEntities, Rules(), CustomTexts());
const components = getComponents();

startup(components);

export function importAssets(modules?: Record<string, unknown>): IDefinitions {
    const definitions = <IDefinitions>{};

    if (!import.meta.env?.VITE_BUILDER) {
        console.log('import.meta.glob is NOT available to import game assets!');
        return definitions;
    }

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

function getComponents(): Map<string, any> {
    const combinedTemplates = new Map<string, any>();

    if (!import.meta.env?.VITE_BUILDER) {
        console.log('import.meta.glob is NOT available to import ui components!');
        return combinedTemplates;
    }

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