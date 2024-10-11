import {IAction, IGame, Location} from '../../types';
import description from './Treestump.html?raw';
import {ActionType} from "storyScript/Interfaces/enumerations/actionType.ts";
import {StickGolem} from "../../enemies/StickGolem.ts";

export function Treestump() {
    return Location({
        name: 'The Satyr',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: null,
                inactive: true
            },                                        
        ],
        actions: [
            [
                'TakeGold', <IAction>{
                    text: 'Take the gold',
                    actionType: ActionType.Regular,
                    execute: (game: IGame) => {
                        game.currentLocation.descriptionSelector = 'TookGold';
                        game.currentLocation.enemies.forEach(e => e.inactive = false);
                    }
                }
            ]
        ],
        enemies: [
            StickGolem()
        ]
    });
}