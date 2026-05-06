import { Location } from '../types';
import description from './WarLocThree.html?raw';
import { WarLocTwo } from './WarLocTwo';
import { WarLocFour } from './WarLocFour';
import { WarLocFive } from './WarLocFive';
import { WarLocSix } from './WarLocSix';

export function WarLocThree() {
    return Location({
        name: 'Military conflicts with Louis XIV, King of France',
        description: description,
        destinations: [
            {
                name: 'Wars against the Ottoman Empire',
                target: WarLocTwo,
            },
            {
                name: 'War of the Polish Succession',
                target: WarLocFour,
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