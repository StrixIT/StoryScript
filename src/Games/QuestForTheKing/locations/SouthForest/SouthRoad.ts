import { IGame, Location } from '../../types';
import { Guardians } from './Guardians';
import { Merchant } from './Merchant';
import { CentralForest } from '../CentralForest/CentralForest';
import description from './SouthRoad.html';
import { Start } from '../ForestEntry/start';

export function SouthRoad() {
	return Location({
		name: 'SouthRoad',
		description: description,
		destinations: [
			{
                name: 'The Merchant',
                target: Merchant,
				style: 'location-danger'
            },
			{                          
				name: 'The Strange Trees',
				target: Guardians,
				style: 'location-danger'
			},
			{
                name: 'The Forest Entry',
                target: Start,
            },
			{
                name: 'The Central Forest',
                target: CentralForest,
            }
		],
		features: [
		],
		items: [
		],
		enemies: [
		],
		persons: [
		],
		trade: [
		],
		enterEvents: [
		],
		leaveEvents: [
		],
		actions: [
		],
		combatActions: [
		],
	});
}