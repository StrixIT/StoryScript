import { Location } from '../types';
import description from './WarLocFive.html?raw';
import { WarLocTwo } from './WarLocTwo';
import { WarLocThree } from './WarLocThree';
import { WarLocFour } from './WarLocFour';
import { WarLocSix } from './WarLocSix';

export function WarLocFive() {
    return Location({
        name: '1757 War against Prussia',
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
                name: 'War of the Polish Succession',
                target: WarLocFour,
            },
            {
                name: 'French Revolutionary and Napoleonic Wars',
                target: WarLocSix,
            }
        ]
    });
}