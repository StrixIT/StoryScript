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
    addFunctionExtensions();
    addArrayExtensions();

    importAssets(import.meta.glob([
        'game/actions/*.ts',
        'game/features/*.ts',
        'game/items/*.ts',
        'game/enemies/*.ts',
        'game/persons/*.ts',
        'game/quests/*.ts',
        'game/locations/*.ts'
    ], { eager: true }));
    buildEntities();
    new ObjectFactory(nameSpace, rules, texts);
}

export function GetObjectFactory() {
    return ObjectFactory.GetInstance();
}

function importAssets(modules: Record<string, unknown>) {
    // Loop over all found files to register the assets with the proper type.
    for (const path in modules)
    {
        let asset = modules[path];
        let type = path.split('/').reverse()[1];
        let property = Object.getOwnPropertyNames(asset)[0];

        // Register the asset with the proper type.
        Register(type, asset[property]);
    }
}