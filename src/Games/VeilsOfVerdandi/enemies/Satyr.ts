﻿import { Enemy } from "../types";

export function Satyr() {
    return Enemy({
        name: 'Satyr',
        hitpoints: 18,
        damage: '1d6',
        currency: 2
    });
}