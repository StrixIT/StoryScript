import { IGame, Location } from '../../types';
import { Fisherman } from '../Fisherman';
import { Magicflowers } from '../Magicflowers';
import { Woodcutter } from '../Woodcutter';
import { CentralForest } from './CentralForest';
import description from './NorthRoad.html';
import { Start } from './start';

export function NorthRoad() {
	return Location({
		name: 'NorthRoad',
		description: description,
		destinations: [
			{
                name: 'The Woodcutters Lodge',
                target: Woodcutter,
				style: 'location-danger'
            },
			{
                name: 'The Magic Flower',
                target: Magicflowers,
				style: 'location-danger'
            },
			{
                name: 'The Fisherman\'s Cottage',
                target: Fisherman,
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