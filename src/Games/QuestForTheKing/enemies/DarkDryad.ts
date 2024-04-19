import { Enemy } from 'storyScript/Interfaces/storyScript';

export function DarkDryad() {
    return Enemy({
        name: 'The Dark Dryad',
        hitpoints: 20,
        damage: '1d6',
        reward: 3
    });
}