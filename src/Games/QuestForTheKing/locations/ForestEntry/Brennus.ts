import { Location, IGame } from '../../types';
import description from './Brennus.html';
import { Brennus as BrennusEnemy } from '../../enemies/Brennus';
import { BrennusApproach } from './BrennusApproach';
import { Start } from './start';

export function Brennus() {
    return Location({
        name: 'Brennus',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Start,
                activeDay: true
            },
            {
                name: 'Approach the Tent',
                target: BrennusApproach,
                activeNight: true
            },
            {
                name: 'Leave',
                target: Start,
                activeNight: true               
            },
        ],
        enemies: [
            BrennusEnemy()  
        ],
        enterEvents: [
            {
                'Night':
                (game: IGame) => {
                    if (game.worldProperties.isNight) {
                        game.currentLocation.enemies.map(e => e.inactive = true);
                    }
                }
            }
        ]
    });
}