import { IGame, Location } from '../../types';
import { Dryad } from './Dryad';
import { Treestump } from './Treestump';
import { Troll } from './Troll';
import description from './CentralForest.html';
import { NorthRoad } from '../NorthForest/NorthRoad';
import { SouthRoad } from '../SouthForest/SouthRoad';

export function CentralForest() {
	return Location({
		name: 'CentralForest',
		description: description,
		destinations: [
			{
                name: 'The Tree Stump',
                target: Treestump,
				style: 'location-danger'
            }, 
			{
                name: 'The Troll',
                target: Troll,
				style: 'location-danger'
            },
			{                          
                name: 'The Dryad Tree',
                target: Dryad
            },
			{
                name: 'The Northern Road',
                target: NorthRoad,            
            },
			{
                name: 'The Southern Road',
                target: SouthRoad,            
            },
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