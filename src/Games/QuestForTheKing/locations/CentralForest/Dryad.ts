import { Location, IGame } from '../../types';
import description from './Dryad.html';
import { CentralForest } from './CentralForest';
import { ForestPond } from './ForestPond';

export function Dryad() {
    return Location({
        name: 'The Dryad Tree',
        description: description,
        destinations: [
            {
                name: 'The Forest Pond',
                target: ForestPond,
				style: 'location-danger'
            },
            {
                name: 'The Central Forest',
                target: CentralForest
            }           
        ],
        leaveEvents: [
            (game: IGame) => {
                if (game.currentLocation.descriptionSelector === 'return') {
                    game.currentLocation.descriptionSelector = null;
                    game.currentLocation.completedDay = true;
                    game.currentLocation.completedNight = true;
                    return false;
                }

                return true;
            }
        ]
    });
}