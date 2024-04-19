import { ActionStatus, ActionType } from 'storyScript/Interfaces/storyScript';
import { Action, IGame } from '../types';

export function Dodge() {
	return Action({
		text: 'Dodge',
		actionType: ActionType.Combat,
		execute(game: IGame) {
		
		},
		status(game: IGame) {
			return ActionStatus.Available;
		},
		level: 1
	});
}