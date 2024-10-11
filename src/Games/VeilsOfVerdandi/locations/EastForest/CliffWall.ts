import {Location} from '../../types';
import description from './CliffWall.html?raw';
import {Darkcave} from './Darkcave';
import {Twoheadedwolf} from '../../enemies/Twoheadedwolf';
import {Guardians} from './Guardians';

export function CliffWall() {
    return Location({
        name: 'The Cliff Wall',
        description: description,
        destinations: [
            {
                name: 'The Strange Trees',
                target: Guardians
            },
            {
                name: 'The Dark Cave',
                target: Darkcave
            }
        ],
        enemies: [
            Twoheadedwolf()
        ]
    });
}
