﻿import {ActionType, IAction} from 'storyScript/Interfaces/storyScript';
import {IGame} from '../types';

export interface SearchSettings {
    text?: string;
    difficulty: number;
    success: (game: IGame) => void;
    fail: (game: IGame) => void;
}

export function Search(settings: SearchSettings): IAction {
    return {
        text: settings?.text || 'Zoek',
        actionType: ActionType.Check,
        execute: function (game: IGame) {
            let result;
            const bonus = game.helpers.calculateBonus(game.activeCharacter, 'oplettendheid') - 1;
            const check = game.helpers.rollDice(game.activeCharacter.oplettendheid + 'd6');
            result = check * game.activeCharacter.oplettendheid + bonus;

            if (result >= settings.difficulty) {
                settings.success(game);
            } else {
                settings.fail(game);
            }
        }
    };
}