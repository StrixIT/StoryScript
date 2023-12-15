import { ObjectFactory } from './ObjectFactory';
import { addFunctionExtensions, addArrayExtensions } from './globals';
import { IInterfaceTexts } from './Interfaces/interfaceTexts';
import { IRules } from './Interfaces/rules/rules';
import { buildEntities, Register } from './ObjectConstructors';

/**
 * This function bootstraps and runs your game.
 * @param nameSpace Your game's namespace (e.g. '_GameTemplate')
 * @param texts Your game's custom interface texts
 * @param rules Your game rules
 */
export function Run(nameSpace: string, rules: IRules, texts: IInterfaceTexts) {
    if (!ObjectFactory.GetInstance()) {
        addFunctionExtensions();
        addArrayExtensions();
        importAssets();
        buildEntities();

        new ObjectFactory(nameSpace, rules, texts);
    }
}

export function importAssets() {
    if (process.env.WEBPACK_BUILDER) {
        loadAssetsWithRequire();
    }
    
    if (import.meta.env?.VITE_BUILDER) {
        loadAssetsWithImport();
    }
}

function loadAssetsWithRequire() {
    // Note that this regex cannot be extracted from here as that will break the require usage.
    var assets = require.context('game', true, /(actions|enemies|features|items|locations|persons|quests)\/[a-zA-Z0-9\/]{1,}\.ts$/);

    assets.keys().forEach(k => {
        // Require the asset so it is loaded as a module.
        var asset = assets(k);
        var type = getAssetType(k);
        
        // Get the property of the asset that has the asset's entity function (the first is whether or not the asset is a esModule).
        var assetProperties = Object.getOwnPropertyNames(asset);
        var property = assetProperties[1];

        // Register the asset with the proper type.
        Register(type, asset[property]);
    });
}

function loadAssetsWithImport() {
    const assetRegex = /(actions|enemies|features|items|locations|persons|quests)\/[a-zA-Z0-9\/]{1,}\.ts$/;
    const modules = import.meta.glob([
        'game/actions/**/*.ts',
        'game/features/**/*.ts',
        'game/items/**/*.ts',
        'game/enemies/**/*.ts',
        'game/persons/**/*.ts',
        'game/quests/**/*.ts',
        'game/locations/**/*.ts'
    ], { eager: true });

    // Loop over all found files to register the assets with the proper type.
    for (const path in modules)
    {
        let asset = modules[path];
        let type = getAssetType(path.match(assetRegex)[1]);
        let property = Object.getOwnPropertyNames(asset)[0];

        // Register the asset with the proper type.
        Register(type, asset[property]);
    }
}

function getAssetType(path: string): string {
    return path.replace('./', '').split('/')[0];
}