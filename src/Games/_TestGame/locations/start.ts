import { IGame, Location } from '../interfaces/types';
import { RegisterLocation } from '../../../Engine/Interfaces/storyScript'
import { Garden } from './Garden';
import { Bedroom } from './bedroom';
import { DirtRoad } from './DirtRoad';
import { Friend } from '../persons/Friend';
import description from './Start.html';

export function Start() {
    return Location({
        name: 'Home',
        html: description,
        descriptionSelector: (game: IGame) => {
            var date = new Date();
            var hour = date.getHours();

            if (hour <= 6 || hour >= 18) {
                return 'night';
            }

            return 'day';
        },
        destinations: [
            {
                name: 'To the bedroom',
                target: Bedroom
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

RegisterLocation(Start);