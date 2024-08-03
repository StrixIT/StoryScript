import { ActionStatus, ActionType } from 'storyScript/Interfaces/storyScript';
import { Action, IGame } from '../types';

export function PowerAttack() {
	return Action({
		text: 'Power Attack',
		actionType: ActionType.Combat,
		execute(game: IGame) {
		
		},
		status(game: IGame) {
		return ActionStatus.Available;
		},
		level: 1
	});
}