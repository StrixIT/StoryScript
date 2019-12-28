import { Location, IGame } from '../../types';
import description from './Darkcave.html';
import { Enchantress } from '../../enemies/Enchantress';

export function Darkcave() {
    return Location({
        name: 'The Dark Cave',
        description: description,       
        enemies: [
            Enchantress()
        ]
    });
}