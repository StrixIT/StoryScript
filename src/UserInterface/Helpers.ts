let _templates = <Map<string, string>>null;

export function getTemplate(root: string, componentName: string): string {
    if (!_templates) {
        _templates = new Map<string, string>();
        importAssets();
    }

    return _templates.get(componentName) ?? import.meta.resolve(`${root}/${componentName}.vue`);
}

function importAssets() {
    if (import.meta.env?.VITE_BUILDER) {
        const modules = import.meta.glob('game/ui/**/*.vue', {eager: true, query: 'raw'});

        for (const path in modules) {
            AddTemplate(path);
        }
    }
}

function AddTemplate(templateName: string) {
    const capture = templateName.match(/([a-zA-Z]{1,}).vue$/);
    _templates.set(capture[1], templateName);
}