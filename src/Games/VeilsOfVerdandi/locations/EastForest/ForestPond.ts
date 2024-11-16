import {IGame, Location} from '../../types';
import description from './ForestPond.html?raw';
import {DarkDryad} from '../../enemies/DarkDryad';
import {Dryad} from './Dryad';
import {ForceField} from "../../items/ForceField.ts";

export function ForestPond() {
    return Location({
        name: 'The Forest Pond',
        description: description,
        picture: true,
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
            ForceField(),
        ],
        leaveEvents:
            [[
                'LeavePond',
                (game: IGame) => {
                    game.worldProperties.helpedDryad = true;
                    game.currentLocation.completedDay = true;
                    game.currentLocation.completedNight = true;
                }
            ]]
    });
}