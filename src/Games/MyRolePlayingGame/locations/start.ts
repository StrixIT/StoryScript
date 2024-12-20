﻿import { IGame, Location } from '../types';
import { Garden } from './Garden';
import { Library } from './Library';
import { DirtRoad } from './DirtRoad';
import { Friend } from '../persons/Friend';
import description from './Start.html?raw';

export function Start() {
    return Location({
        name: 'Home',
        description: description,
        descriptionSelector: (_: IGame) => {
            const date = new Date();
            const hour = date.getHours();

            if (hour <= 6 || hour >= 18) {
                return 'night';
            }

            return 'day';
        },
        destinations: [
            {
                name: 'To the library',
                target: Library
            },
            {
                name: 'To the garden',
                target: Garden
            },
            {
                name: 'Out the front door',
                target: DirtRoad
            }
        ],
        persons: [
            Friend()
        ]
    });
}