import { Location, IGame } from '../types';
import description from './ForestPond.html';
import { Quest1map2 } from './ForestOfMyrr/Quest1map2';
import { DarkDryad } from '../enemies/DarkDryad';
import { Magicshield } from '../items/Magicshield';
import { Dryad } from './Dryad';

export function ForestPond() {
    return Location({
        name: 'The Forest Pond',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map2
            }              
        ],
        enemies: [
            DarkDryad()
        ],
        items: [
            Magicshield(),
        ],
        leaveEvents: [
            (game: IGame) => {
                var dryadLocation = game.locations.get(Dryad);
                dryadLocation.descriptionSelector = 'return';
                game.currentLocation.completedDay = true;
                game.currentLocation.completedNight = true;
            }
        ]
    });
}