import {ServiceFactory} from './ServiceFactory';
import {addArrayExtensions, addFunctionExtensions} from './arrayAndFunctionExtensions';
import {IDefinitions, IInterfaceTexts, IRules} from 'storyScript';
import {buildEntities} from './EntityCreatorFunctions';
import {entityTypeRegex} from 'src/constants';

/**
 * This function bootstraps and runs your game. It creates a singleton of the ServiceFactory to
 * use with the UI framework.
 * @param nameSpace Your game's namespace (e.g. '_GameTemplate')
 * @param texts Your game's custom interface texts
 * @param rules Your game rules
 */
export function Run(nameSpace: string, rules: IRules, texts: IInterfaceTexts) {
    if (!ServiceFactory.GetInstance()) {
        addFunctionExtensions();
        addArrayExtensions();
        const definitions = importAssets();
        const registeredEntities = buildEntities(definitions);
        new ServiceFactory(nameSpace, definitions, registeredEntities, rules, texts);
    }
}

export function importAssets(modules?: Record<string, unknown>): IDefinitions {
    if (import.meta.env?.VITE_BUILDER) {
        return loadAssetsWithImport(modules);
    }

    /* v8 ignore next 2 */
    throw new Error('No loader found for importing the game assets!');
}

function loadAssetsWithImport(modules?: Record<string, unknown>): IDefinitions {
    const definitions = <IDefinitions>{};
    modules ??= import.meta.glob([
        'game/actions/**/*',
        'game/features/**/*',
        'game/items/**/*',
        'game/enemies/**/*',
        'game/persons/**/*',
        'game/quests/**/*',
        'game/locations/**/*',
        'game/maps/**/*'
    ], {eager: true, caseSensitive: false});

    // Loop over all found files to register the assets with the proper type.
    for (const path in modules) {
        if (path.endsWith('.html')) {
            continue;
        }
        
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