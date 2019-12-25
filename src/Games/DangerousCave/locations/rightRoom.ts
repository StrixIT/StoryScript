import { IGame, Location } from '../types';
import description from './rightRoom.html'
import { Search } from '../actions/search';
import { GiantBat } from '../enemies/giantBat';
import { CandleLitCave } from './candleLitCave';
import { Entry } from './entry';

export function RightRoom() {
    return Location({
        name: 'Een schemerige gang',
        description: description,
        enemies: [
            GiantBat()
        ],
        destinations: [
            {
                name: 'Richting het licht',
                target: CandleLitCave
            },
            {
                name: 'Richting ingang',
                target: Entry
            }
        ],
        actions: [
            Search({
                difficulty: 8,
                success: function (game) {
                    game.logToLocationLog('Je ruikt de geur van brandende kaarsen.')
                },
                fail: function (game) {
                    game.logToLocationLog('Er zijn hier heel veel vleermuizen. En heel veel vleermuispoep.');
                }
            })
        ]
    });
}