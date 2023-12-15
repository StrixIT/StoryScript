import { ICharacter, ICollection } from 'storyScript/Interfaces/storyScript';
import { IItem } from './types';
import { ClassType } from './classType';

export class Character implements ICharacter {
    name: string = '';
    portraitFileName?: string = "resources/Hero1.png";
    hitpoints: number = 200;
    currentHitpoints: number = 200;
    score: number = 0;
    currency?: number = 3;

    strength?: number = 1;
    agility?: number = 1;
    intelligence?: number = 1;
    charisma?: number = 1;

    class?: ClassType;

    items: ICollection<IItem> = [];

    equipment: {
        head?: IItem,
        body?: IItem,
        leftHand?: IItem,
        rightHand?: IItem,
        feet?: IItem
    };

    constructor() {
        this.equipment = {
            head: null,
            body: null,
            leftHand: null,
            rightHand: null,
            feet: null
        }
    }
}