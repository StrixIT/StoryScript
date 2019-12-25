export function getUserTemplate(componentName: string): string {
    var r = require.context('game/ui/components', false, /.component.html$/);
    let userTemplate = null;

    r.keys().map(i => {
        if (i.endsWith(`${componentName}.component.html`)) {
            userTemplate = r(i).default;
        }
    });

    return userTemplate;
}