import '../../../Games/_TestGame/ui/styles/game.css';
import '../../../Games/_TestGame/run';

export function getUserTemplate(componentName: string) {
    var r = require.context('../../../Games/_TestGame/ui/components', false, /.component.html$/);
    let userTemplate = null;

    r.keys().map(i => {
        if (i.endsWith(`${componentName}.component.html`)) {
            userTemplate = r(i).default;
        }
    });

    return userTemplate;
}