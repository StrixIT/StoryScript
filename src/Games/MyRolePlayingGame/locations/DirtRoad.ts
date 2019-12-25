import { IGame, Location } from '../types';
import { Start } from './start';
import { Bandit } from '../enemies/bandit';
import description from './Dirtroad.html';

export function DirtRoad() {
    return Location({
        name: 'Dirt road',
        description: description,
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