let _templates = <Map<string, string>>null;

export function getTemplate(componentName: string, defaultTemplate?: any): string {
    if (!_templates) {
        _templates = new Map<string, string>();
        importAssets();
    }

    return _templates.get(componentName) || defaultTemplate?.default;
}

function importAssets() {
    if (process.env.WEBPACK_BUILDER) {
        loadAssetsWithRequire();
    }
    else if (import.meta.env?.VITE_BUILDER) {
        loadAssetsWithImport();
    }
}

function loadAssetsWithRequire() {
    const modules = require.context('game/ui', true, /.component.html$/);

    modules.keys().map(i => {
        var capture = i.match(/([a-z]{1,})\.component\.html$/)
        AddTemplate(capture[1], modules(i).default);
    });
}

function loadAssetsWithImport() {
    const modules = import.meta.glob('game/ui/*.component.html', { eager: true });

    for (const path in modules)
    {
        //AddTemplate(match[0].substring(1, match[0].indexOf('.')), (<any>modules[path]).default);
    }
}

function AddTemplate(templateName: string, template) {
    _templates.set(templateName, template);
}