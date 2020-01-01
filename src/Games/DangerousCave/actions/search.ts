import { IAction, ActionType, Action } from 'storyScript/Interfaces/storyScript';
import { IGame } from '../types';

export interface SearchSettings {
    text?: string;
    difficulty: number;
    success: (game: IGame) => void;
    fail: (game: IGame) => void;
}

export function Search(settings: SearchSettings): IAction {
    return Action({
        text: settings && settings.text || 'Zoek',
        actionType: ActionType.Check,
        execute: function (game: IGame) {
            var result;
            var bonus = game.helpers.calculateBonus(game.character, 'oplettendheid') - 1;
            var check = game.helpers.rollDice(game.character.oplettendheid + 'd6');
            result = check * game.character.oplettendheid + bonus;

            if (result >= settings.difficulty) {
                settings.success(game);
            }
            else {
                settings.fail(game);
            };
        }
    });
}