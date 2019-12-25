import { IGame, Location } from '../types';
import description from './temp.html'
import { Entry } from './entry';

export function Temp() {
    return Location({
        name: 'Deze locatie bestaat nog niet',
        description: description,
        destinations: [
            {
                name: 'Ga terug naar de ingang',
                target: Entry,
            }
        ]
    });
}