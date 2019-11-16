import { IGame, Location } from '../interfaces/types';
import { RegisterLocation } from '../../../Engine/Interfaces/storyScript'
import { Start } from './start';
import { Bandit } from '../enemies/bandit';

export function DirtRoad() {
    return Location({
        name: 'Dirt road',
        destinations: [
            {
                name: 'Enter your home',
                target: Start
            }
        ],
        enemies: [
            Bandit()
        ],
        combatActions: [
            {
                text: 'Run back inside',
                execute: (game: IGame) => {
                    game.changeLocation('Start');
                    game.logToActionLog(`You storm back into your house and slam the 
                                        door behind you. You where lucky... this time!`);
                    return true;
                }
            }
        ]
    });
}

RegisterLocation(DirtRoad);