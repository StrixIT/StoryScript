import { Enemy, IGame } from '../types';
import {ClassType} from "../classType.ts";

export function Octopus() {
    return Enemy({
        name: 'Giant Octopus',
        hitpoints: 25,
        defence: 2,
        currency: 10,
        attacks: [
            {
                damage: '1d6',
                speed: 5,
                attackPriority: [
                    [ClassType.Rogue, [1, 2, 3, 4]],
                    [ClassType.Warrior, [5, 6]]]
            },
            {
                damage: '1d6',
                speed: 7,
                attackPriority: [
                    [ClassType.Rogue, [1, 2, 3, 4]],
                    [ClassType.Warrior, [5, 6]]]
            },
            {
                damage: '1d6',
                speed: 9,
                attackPriority: [
                    [ClassType.Warrior, [1, 2, 3, 4]],
                    [ClassType.Rogue, [5, 6]]]
            }
        ],
        activeDay: false,
        activeNight: false,
        onDefeat: (game: IGame) => {
            game.currentLocation.actions.clear();
        }
    });
}