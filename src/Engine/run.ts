import { ServiceFactory } from './ServiceFactory';
import { addFunctionExtensions, addArrayExtensions } from './globals';
import { IInterfaceTexts } from './Interfaces/interfaceTexts';
import { IRules } from './Interfaces/rules/rules';
import { buildEntities, Register } from './ObjectConstructors';
import { assetRegex } from '../../constants';

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
        importAssets();
        buildEntities();
        instance = new ServiceFactory(nameSpace, rules, texts);
    }
    
    return instance;
}

export function importAssets() {
    /* v8 ignore next 3 */
    if (process.env.WEBPACK_BUILDER) {
        loadAssetsWithRequire();
    }
    
    if (import.meta.env?.VITE_BUILDER) {
        loadAssetsWithImport();
    }
}

/* v8 ignore start */
function loadAssetsWithRequire() {
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
        Register(type, asset[property]);
    });
}
/* v8 ignore stop */

function loadAssetsWithImport() {
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
        let type = getAssetType(assetRegex.exec(path)[1]);
        let property = Object.getOwnPropertyNames(asset)[0];

        // Register the asset with the proper type.
        Register(type, asset[property]);
    }
}

function getAssetType(path: string): string {
    return path.replace('./', '').split('/')[0];
}