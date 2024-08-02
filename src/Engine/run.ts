import {ServiceFactory} from './ServiceFactory';
import {addArrayExtensions, addFunctionExtensions} from './globalFunctions';
import {IInterfaceTexts} from './Interfaces/interfaceTexts';
import {IRules} from './Interfaces/rules/rules';
import {buildEntities} from './ObjectConstructors';
import {assetRegex} from '../../constants';
import {IDefinitions} from "storyScript/Interfaces/definitions.ts";

/**
 * This function bootstraps and runs your game.
 * @param nameSpace Your game's namespace (e.g. '_GameTemplate')
 * @param texts Your game's custom interface texts
 * @param rules Your game rules
 */
export function Run(nameSpace: string, rules: IRules, texts: IInterfaceTexts) {
    let instance = ServiceFactory.GetInstance();

    if (!instance) {
        addFunctionExtensions();
        addArrayExtensions();
        const definitions = importAssets();
        const registedEntities = buildEntities(definitions);
        instance = new ServiceFactory(nameSpace, definitions, registedEntities, rules, texts);
    }

    return instance;
}

export function importAssets(): IDefinitions {
    /* v8 ignore next 3 */
    if (process.env.WEBPACK_BUILDER) {
        return loadAssetsWithRequire();
    }

    if (import.meta.env?.VITE_BUILDER) {
        return loadAssetsWithImport();
    }

    throw new Error('No loader found for importing the game assets!');
}

/* v8 ignore start */
function loadAssetsWithRequire(): IDefinitions {
    const definitions = <IDefinitions>{};
    // Note that this regex cannot be extracted from here as that will break the require usage.
    const assets = require.context('game', true, /(actions|enemies|features|items|locations|persons|quests)\/[a-zA-Z0-9/]+\.ts$/);

    assets.keys().forEach(k => {
        // Require the asset, so it is loaded as a module.
        const asset = assets(k);
        const type = getAssetType(k);

        // Get the property of the asset that has the asset's entity function (the first is whether or not the asset is a esModule).
        const assetProperties = Object.getOwnPropertyNames(asset);
        const property = assetProperties[1];

        // Register the asset with the proper type.
        Register(definitions, type, asset[property]);
    });

    return definitions;
}

/* v8 ignore stop */

function loadAssetsWithImport(): IDefinitions {
    const definitions = <IDefinitions>{};
    const modules = import.meta.glob([
        'game/actions/**/*.ts',
        'game/features/**/*.ts',
        'game/items/**/*.ts',
        'game/enemies/**/*.ts',
        'game/persons/**/*.ts',
        'game/quests/**/*.ts',
        'game/locations/**/*.ts'
    ], {eager: true});

    // Loop over all found files to register the assets with the proper type.
    for (const path in modules) {
        let asset = modules[path];
        let type = getAssetType(assetRegex.exec(path)[1]);
        let property = Object.getOwnPropertyNames(asset)[0];

        // Register the asset with the proper type.
        Register(definitions, type, asset[property]);
    }

    return definitions;
}

function getAssetType(path: string): string {
    return path.replace('./', '').split('/')[0];
}

function Register(definitions: IDefinitions, type: string, entityFunc: Function) {
    // Add the entity function to the definitions object for creating entities at run-time.
    definitions[type] = definitions[type] || [];

    if (definitions[type].indexOf(entityFunc) === -1) {
        definitions[type].push(entityFunc);
    }
}