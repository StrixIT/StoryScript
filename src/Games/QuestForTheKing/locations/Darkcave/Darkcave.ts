import { Location, IGame } from '../../types';
import description from './Darkcave.html';

export function Darkcave() {
    return Location({
        name: 'The Dark Cave',
        description: description,       
        enemies: [
            Enchantress()
        ]
    });
}