import { Location, IGame } from '../../types';
import description from './ForestPond.html';
import { DarkDryad } from '../../enemies/DarkDryad';
import { Magicshield } from '../../items/Magicshield';
import { Dryad } from './Dryad';

export function ForestPond() {
    return Location({
        name: 'The Forest Pond',
        description: description,
        destinations: [
			{                          
                name: 'The Dryad Tree',
                target: Dryad
            },             
        ],
        enemies: [
            DarkDryad()
        ],
        items: [
            Magicshield(),
        ],
        leaveEvents: [
            {
                'LeavePond':
                (game: IGame) => {
                    var dryadLocation = game.locations.get(Dryad);
                    dryadLocation.descriptionSelector = 'return';
                    game.currentLocation.completedDay = true;
                    game.currentLocation.completedNight = true;
                }
            }
        ]
    });
}