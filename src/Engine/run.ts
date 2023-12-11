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
        // Todo: this is webpack specific and should not be part of the engine. Inject it.
        importAssets(require.context('game', true, /[a-zA-Z0-9].ts$/));
        buildEntities();

        new ObjectFactory(nameSpace, rules, texts);
    }
}

function importAssets(r) {
    let folders = [
        'actions',
        'features',
        'items',
        'enemies',
        'persons',
        'quests',
        'locations'
    ]

    // Loop over all found files to register the assets with the proper type.
    r.keys().map(i => {
        folders.forEach(f => {
            var trimmed = i.replace('./', '');

            if (trimmed.startsWith(f)) {
                // Require the asset so it is loaded as a module.
                var asset = r(i);
                
                // Get the property of the asset that has the asset's entity function using the asset file name. When it is not found
                // (when the asset has a name different from the file name) default to the second property (the first is whether or not
                // the asset is a esModule).
                var assetProperties = Object.getOwnPropertyNames(asset);
                var property = assetProperties.filter(p => trimmed.toLowerCase().indexOf(p.toLowerCase()) > -1)[0];
                property = property || assetProperties[1];

                // Register the asset with the proper type.
                Register(f, asset[property]);
            }
        });
    });
}