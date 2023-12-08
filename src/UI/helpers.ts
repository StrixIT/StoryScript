const _templates = new Map<string, string>();

export function getTemplate(componentName: string, defaultTemplate?: any): string {
    if (_templates.size === 0) {
        var componentRegex = /\/[a-z_A-Z]{2,}\.component\.html$/;
        const modules = import.meta.glob('game/ui/*.component.html', { eager: true })

        for (const path in modules)
        {
            var match = componentRegex.exec(path);

            if (match) {
                // Todo: make work with Vite
                _templates.set(match[0].substring(1, match[0].indexOf('.')), (<any>modules[path]).default);
            }
        }
    }

    return _templates.get(componentName) || defaultTemplate?.default;
}