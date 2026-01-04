import {ServiceFactory} from './ServiceFactory';
import {addArrayExtensions, addFunctionExtensions} from './arrayAndFunctionExtensions';
import {IInterfaceTexts} from './Interfaces/interfaceTexts';
import {IRules} from './Interfaces/rules/rules';
import {buildEntities} from './EntityCreatorFunctions';
import {assetRegex} from '../../constants';
import {IDefinitions} from "storyScript/Interfaces/definitions.ts";

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
        'game/actions/**/*.ts',
        'game/features/**/*.ts',
        'game/items/**/*.ts',
        'game/enemies/**/*.ts',
        'game/persons/**/*.ts',
        'game/quests/**/*.ts',
        'game/locations/**/*.ts',
        'game/maps/**/*.ts'
    ], {eager: true});

    // Loop over all found files to register the assets with the proper type.
    for (const path in modules) {
        const asset = modules[path];
        const type = assetRegex.exec(path)[1].replace('./', '').split('/')[0];
        const property = Object.getOwnPropertyNames(asset)[0];
        const entityFunc = asset[property];

        // Add the entity function to the definitions object for creating entities at run-time.
        definitions[type] = definitions[type] || [];

        if (definitions[type].indexOf(entityFunc) === -1) {
            definitions[type].push(entityFunc);
        }
    }

    return definitions;
}