import { Location } from '../types';
import description from './WarLocTwo.html?raw';
import { WarLocThree } from './WarLocThree';
import { WarLocFour } from './WarLocFour';
import { WarLocFive } from './WarLocFive';
import { WarLocSix } from './WarLocSix';

export function WarLocTwo() {
    return Location({
        name: 'Wars against the Ottoman Empire',
        description: description,
        destinations: [
            {
                name: 'Military conflicts with Louis XIV, King of France',
                target: WarLocThree,
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