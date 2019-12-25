import { IGame, Location } from '../types';
import description from './entry.html'
import { Lantern } from '../items/lantern';
import { Search } from '../actions/search';
import { RightCorridor } from './rightCorridor';
import { LeftCorridor } from './leftCorridor';

export function Entry() {
    return Location({
        name: 'De grot',
        description: description,
        // Example
        //descriptionSelector: function() {
        //    return game.currentLocation.descriptions['lantern'];
        //},
        //navigationDisabled: true,
        items: [
            Lantern()
        ],
        enterEvents: [
            (game: IGame) => {
                if (game.character.oplettendheid > 1) {
                    game.logToLocationLog('Je ruikt bloed.');
                }
            }
        ],
        destinations: [
            {
                name: 'Donkere gang (west)',
                target: LeftCorridor
            },
            {
                name: 'Schemerige gang (oost)',
                target: RightCorridor
            }
        ],
        actions: [
            Search({
                difficulty: 5,
                success: (game: IGame) => {
                    game.logToLocationLog('Op de muur staat een pijl, getekend met bloed. Hij wijst naar de oostgang.')
                },
                fail: (game: IGame) => {
                    game.logToLocationLog('Je vindt alleen stenen en stof.');
                }
            })
        ]
    });
}