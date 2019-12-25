import { IGame, Location } from '../types';
import description from './centreRoom.html' 
import { Search } from '../actions/search';
import { SmallShield } from '../items/smallShield';
import { RoomOne } from './roomOne';

export function CentreRoom() {
    return Location({
        name: 'Een opslagkamer',
        description: description,
        destinations: [
            {
                name: 'De kamer van de ork',
                target: RoomOne
            }
        ],
        actions: [
            Search({
                difficulty: 9,
                success: function (game: IGame) {
                    game.logToLocationLog('Je vindt een schild!');
                    game.character.items.push(SmallShield());
                },
                fail: function (game: IGame) {
                    game.logToLocationLog('Je vindt niets.');
                }
            })
        ]
    });
}