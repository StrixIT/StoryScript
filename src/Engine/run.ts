import { ObjectFactory } from './ObjectFactory';
import { addFunctionExtensions, addArrayExtensions } from './globals';
import { IInterfaceTexts } from './Interfaces/interfaceTexts';
import { IRules } from './Interfaces/rules/rules';
import { registerEntities } from './ObjectConstructors';

let _factory: ObjectFactory = null;

/**
 * This function bootstraps and runs your game.
 * @param nameSpace Your game's namespace (e.g. '_GameTemplate')
 * @param texts Your game's custom interface texts
 * @param rules Your game rules
 */
export function Run(nameSpace: string, rules: IRules, texts: IInterfaceTexts) {
    addFunctionExtensions();
    addArrayExtensions();
    importAssets(require.context('game', true, /[a-zA-Z].ts$/));
    registerEntities();

    _factory = new ObjectFactory(nameSpace, rules, texts);
}

export function GetObjectFactory() {
    return _factory;
}

function importAssets(r) {
    let assets = {};
    let folders = [
        'actions',
        'features',
        'items',
        'enemies',
        'persons',
        'quests',
        'locations'
    ]

    r.keys().map(i => {
        folders.forEach(f => {
            var trimmed = i.replace('./', '');

            if (trimmed.startsWith(f)) { 
                assets[trimmed] = r(i);
            }
        });
    });

    return assets;
}