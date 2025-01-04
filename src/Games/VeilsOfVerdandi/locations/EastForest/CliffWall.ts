import {IGame, Location} from '../../types';
import description from './CliffWall.html?raw';
import {Darkcave} from './Darkcave';
import {Twoheadedwolf} from '../../enemies/Twoheadedwolf';
import {Guardians} from './Guardians';
import {locationComplete} from "../../sharedFunctions.ts";

export function CliffWall() {
    return Location({
        name: 'The Cliff Wall',
        description: description,
        picture: true,
        destinations: [
            {
                name: 'The Strange Trees',
                target: Guardians
            },
            {
                name: 'The Dark Cave',
                target: Darkcave
            }
        ],
        enemies: [
            Twoheadedwolf()
        ],
        leaveEvents: [[
            'Leave',
            (game: IGame) => {
                locationComplete(game, game.currentLocation, () => true, () => true);
                return true;
            }
        ]]
    });
}
