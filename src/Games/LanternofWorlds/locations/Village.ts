import { IGame, Location, IFeature } from '../types';
import description from './Village.html';
import { ICombinable, IItem, PlayState } from 'storyScript/Interfaces/storyScript';
import { Constants } from '../Constants';
import { Druidstart } from './Introduction/Druidstart';
import { setCoordinates, showElements } from '../rules';
import { setLocationDescription } from '../helpers';

export function Village() {
	return Location({
		name: 'Village',
		description: description,
		showOnMap: false,
		destinations: [
			
		],
		features: [
			{
				name: "Blacksmithfeature",
				combinations: {
					combine: [
						{
							combinationType: Constants.WALK,
							match: (game: IGame, target: ICombinable, tool: ICombinable): string => {
								game.trade = game.currentLocation.trade[0];
								game.playState = PlayState.Trade;
								return 'ok';
							},
						}
					],
				},
			},
			{
				name: "Magicshopfeature",
				combinations: {
					combine: [
						{
							combinationType: Constants.WALK,
							match: (game: IGame, target: ICombinable, tool: ICombinable): string => {
								game.trade = game.currentLocation.trade[1];
								game.playState = PlayState.Trade;
								return 'ok';
							},
						}
					],
				},
			},
			{
				name: 'Fountain',
				combinations: {
					combine: [
						{
							combinationType: Constants.WALK,
							match: (game: IGame, target: IFeature, tool: ICombinable): string => {
								setLocationDescription(game);
								return '';
							},
						}
					],
				},
			},
			{
				name: 'Forest entrance',
				combinations: {
					combine: [
						{
							combinationType: Constants.WALK,
							match: (game: IGame, target: IFeature, tool: ICombinable): string => {
								game.changeLocation(Druidstart);
								setCoordinates(game, target);
								showElements(game, true, target.linkToLocation);
								return '';
							},
						}
					],
				},
			},
		],
		items: [
		],
		enemies: [
		],
		persons: [
		],
		trade: [
			{
				name: "Blacksmith",
				buy: {
					description: 'I have these items for sale',
					emptyText: '',
					itemSelector: (game: IGame, item: IItem): boolean => {
						return true;
					},
					maxItems: 2,
				},
				sell: {
					description: 'I will buy these items from you',
					emptyText: '',
					itemSelector: (game: IGame, item: IItem): boolean => {
						return true;
					},
					maxItems: 2,
				}
			},
			{
				name: "Magic shop",
				buy: {
					description: 'I have these trinkets available',
					emptyText: '',
					itemSelector: (game: IGame, item: IItem): boolean => {
						return true;
					},
					maxItems: 2,
				},
				sell: {
					description: 'Those look interesting',
					emptyText: '',
					itemSelector: (game: IGame, item: IItem): boolean => {
						return true;
					},
					maxItems: 2,
				}
			}
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