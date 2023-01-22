import { ICharacter, ICollection, IEquipment as StoryScriptEquipment } from 'storyScript/Interfaces/storyScript';
import { custom } from 'storyScript/utilities';
import { Class } from './interfaces/class';
import { Firebolt } from './items/firebolt';
import { Healingpotion } from './items/healingPotion';
import { Sword } from './items/sword';
import { Map } from './items/map';
import { IEquipment, IItem } from './types';

export class Character implements ICharacter {
    name: string = '';
    score: number = 0;
    hitpoints: number = 10;
    currentHitpoints: number = 1000;
    currency?: number;
    
    // Add character properties here.
    strength?: number = 1;
    agility?: number = 1;
    intelligence?: number = 1;
    class?: Class;
    level?: number = 1;
    
    items: ICollection<IItem> = [
        Healingpotion(),
        Firebolt(),
        Map()
    ];

    equipment: IEquipment;

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