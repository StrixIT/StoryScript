﻿import { Enemy } from "../types";

export function Troll() {
    return Enemy({
        name: 'Troll',
        hitpoints: 22,
        damage: '1d8',
        currency: 4
    });
}