import {ICharacter} from 'storyScript/Interfaces/storyScript';
import {IEquipment, IItem} from './types';
import {CharacterClass} from './characterClass';

export class Character implements ICharacter {
    name: string = '';
    portraitFileName?: string = '';
    hitpoints: number = 0;
    currentHitpoints: number = 0;
    currency?: number = 3;
    spellDefence?: number;

    class?: CharacterClass;

    items: IItem[] = [];

    frozen?: boolean;
    frightened?: boolean;
    confused?: boolean;

    equipment: IEquipment = {};

    constructor() {
        this.equipment = <IEquipment>{
            primaryWeapon: null,
            secondaryWeapon: null,
            bow: null,
            body: null,
            amulet: null,
            rightRing: null,
            special: null
        }
    }
}