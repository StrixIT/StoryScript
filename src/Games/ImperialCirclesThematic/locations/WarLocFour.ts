import { Location } from '../types';
import description from './WarLocFour.html?raw';
import { WarLocTwo } from './WarLocTwo';
import { WarLocThree } from './WarLocThree';
import { WarLocFive } from './WarLocFive';
import { WarLocSix } from './WarLocSix';

export function WarLocFour() {
    return Location({
        name: 'War of the Polish Succession',
        description: description,
        destinations: [
            {
                name: 'Wars against the Ottoman Empire',
                target: WarLocTwo,
            },
            {
                name: 'Military conflicts with Louis XIV, King of France',
                target: WarLocThree,
            },
            {
                name: '1757 War against Prussia',
                target: WarLocFive,
            },
            {
                name: 'French Revolutionary and Napoleonic Wars',
                target: WarLocSix,
            }
        ]
    });
}