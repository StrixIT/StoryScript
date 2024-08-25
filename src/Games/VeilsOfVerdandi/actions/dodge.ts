import {ActionStatus, ActionType} from 'storyScript/Interfaces/storyScript';
import {IAction, IGame} from '../types';

export function Dodge() {
    return <IAction>{
        text: 'Dodge',
        actionType: ActionType.Combat,
        execute(game: IGame) {

        },
        status(game: IGame) {
            return ActionStatus.Available;
        },
        level: 1
    };
}