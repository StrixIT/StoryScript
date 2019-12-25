import { IGame, Location } from '../types';
import description from './arena.html' 
import { CrossRoads } from './crossRoads';
import { RoomOne } from './roomOne';

export function RightCorridor() {
    return Location({
        name: 'Een gemetselde gang',
        description: description,
        destinations: [
            {
                name: 'Naar het kruispunt (noord)',
                target: CrossRoads
            },
            {
                name: 'Door de houten deur (zuid)',
                target: RoomOne
            }
        ]
    });
}