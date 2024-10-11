import { IGame, IItem, IPerson, Person } from '../types';
import description from './Merchant.html?raw';
import {BroadSword} from "../items/BroadSword.ts";
import {SilverDagger} from "../items/SilverDagger.ts";
import {Roundshield} from "../items/Roundshield.ts";
import {MagicRing} from "../items/MagicRing.ts";
import {Dodge2} from "../items/Dodge2.ts";

export function Merchant() {
	return Person({
		name: 'Merchant',
		description: description,
		hitpoints: 10,
		canAttack: false,
		items: [
			BroadSword(),
			SilverDagger(),
			Roundshield(),
			MagicRing(),
			Dodge2()
		],
		trade: {
			name: 'Merchant\'s Inventory',
			text: 'And whatever you need, friends, I can provide. Weapons and armour. Swords and bows of the highest quality.' +
				' And magic items. Strange, mysterious items of such power as to be found nowhere else.' +
				' Oh, and I can teach you a skill or two, if you are of a certain profession.',
			ownItemsOnly: true,
			buy: {
				text: 'Buy from the merchant',
				emptyText: 'I have nothing left to offer you!',
			}
		},
	});
}