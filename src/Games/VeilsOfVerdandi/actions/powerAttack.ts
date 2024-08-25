import {ActionStatus, ActionType} from 'storyScript/Interfaces/storyScript';
import {IAction, IGame} from '../types';

export function PowerAttack() {
    return <IAction>{
        text: 'Power Attack',
        actionType: ActionType.Combat,
        execute(game: IGame) {

        },
        status(game: IGame) {
            return ActionStatus.Available;
        },
        level: 1
    };
}