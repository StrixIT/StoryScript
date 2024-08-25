import {Location} from '../../types';
import description from './Guardians.html?raw';
import {Cliffwall} from './Cliffwall';
import {Parchment} from '../../items/Parchment';
import {SouthRoad} from './SouthRoad';

export function Guardians() {
    return Location({
        name: 'The Strange Trees',
        description: description,
        destinations: [
            {
                name: 'The Southern Road',
                target: SouthRoad
            },
            {
                name: 'To the Cliffwall',
                target: Cliffwall,
                barriers: [
                    ['WallOfBranches', {
                        name: 'Wall of branches',
                        key: Parchment
                    }]]
            }
        ]
    });
}