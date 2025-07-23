import {ICharacter} from 'storyScript/Interfaces/storyScript';
import {IEquipment, IItem} from './types';
import {CharacterClass} from './characterClass';

export class Character implements ICharacter {
    name: string = '';
    portraitFileName?: string = '';
    hitpoints: number = 0;
    currentHitpoints: number = 0;

    class?: CharacterClass;

    items: IItem[] = [];

    // Combat states
    defenseBonus? = 0;
    spellDefence? = 0;
    frozen? = false;
    frightened? = false;
    confused? = false;
    
    effects?: { name: string, description: string }[];

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