import { ICharacter, ICollection } from 'storyScript/Interfaces/storyScript';
import { custom } from 'storyScript/utilities';
import { Firebolt } from './items/firebolt';
import { Healingpotion } from './items/healingPotion';
import { Sword } from './items/sword';
import { IItem } from './types';

export class Character implements ICharacter {
    name: string = '';
    score: number = 0;
    hitpoints: number = 10;
    currentHitpoints: number = 1000;
    currency: number = 0;

    // Add character properties here.
    strength?: number = 1;
    agility?: number = 1;
    intelligence?: number = 1;
    
    items: ICollection<IItem> = [
        Healingpotion(),
        Firebolt()
    ];

    equipment: {
        // Remove the slots you don't want to use
        head?: IItem,
        amulet?: IItem,
        body?: IItem,
        hands?: IItem,
        leftHand?: IItem,
        leftRing?: IItem,
        rightHand?: IItem,
        rightRing?: IItem,
        legs?: IItem,
        feet?: IItem,
        spell?: IItem
    };

    constructor() {
        this.equipment = {
            // Remove the slots you don't want to use
            head: null,
            amulet: null,
            body: null,
            hands: null,
            leftHand: null,
            leftRing: null,
            rightHand: Sword(),
            rightRing: null,
            legs: null,
            feet: null,
            spell: custom(Firebolt, { name: 'Special Bolt' })
        }
    }
}