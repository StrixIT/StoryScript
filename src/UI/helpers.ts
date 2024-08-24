let _templates = <Map<string, string>>null;

export function getTemplate(componentName: string, defaultTemplate?: any): string {
    if (!_templates) {
        _templates = new Map<string, string>();
        importAssets();
    }

    return _templates.get(componentName) || defaultTemplate?.default;
}

function importAssets() {
    if (import.meta.env?.VITE_BUILDER) {
        const modules = import.meta.glob('game/ui/**/*.component.html', {eager: true, query: 'raw'});

        for (const path in modules) {
            AddTemplate(path, (<{ default }>modules[path]).default);
        }
    }
}

function AddTemplate(templateName: string, template) {
    const capture = templateName.match(/([a-z]{1,})\.component\.html$/);
    _templates.set(capture[1], template);
}