import { IGame, Location } from '../types';
import description from './leftRoom.html'
import { Orc } from '../enemies/orc';
import { Goblin } from '../enemies/goblin';
import { RoomOne } from './roomOne';

export function LeftRoom() {
    return Location({
        name: 'De slaapkamer van de orks',
        description: description,
        enemies: [
            Orc(),
            Goblin()
        ],
        destinations: [
            {
                name: 'De kamer van de ork',
                target: RoomOne
            }
        ]
    });
}