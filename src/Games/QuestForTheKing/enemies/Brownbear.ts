﻿import { Enemy } from 'storyScript/Interfaces/storyScript';

export function Brownbear() {
    return Enemy({
        name: 'Brown Bear',
        hitpoints: 20,
        attack: '1d8',
        reward: 2,
        activeDay: true
    });
}