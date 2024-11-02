import { IGame, Location } from '../../types';
import description from './SecretCove.html?raw';
import {OceanShrine} from "../Sea/OceanShrine.ts";
import {CentralForest} from "./CentralForest.ts";
import {getId} from "storyScript/utilityFunctions.ts";

export function SecretCove() {
	return Location({
		name: 'Secret Cove',
		description: description,
		destinations: [
			{
				name: 'The Ocean Shrine',
				target: OceanShrine,
			},
			{
				name: 'The Central Forest',
				target: CentralForest,
			},
		],
		leaveEvents: [['AddCoveDestinations', (game: IGame) => {
			const inactiveDestination = game.locations[getId(CentralForest)].destinations.get(getId(SecretCove));
			inactiveDestination.inactive = false;
		}]]
	});
}