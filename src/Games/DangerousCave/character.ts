import {ICharacter, ICollection} from 'storyScript/Interfaces/storyScript';
import {IItem} from './types';

export class Character implements ICharacter {
    name: string = "";
    hitpoints: number = 20;
    currentHitpoints: number = 20;
    currency?: number = 0;
    score?: number = 0;
    scoreToNextLevel?: number = 0;
    level?: number = 1;

    kracht?: number = 1;
    vlugheid?: number = 1;
    oplettendheid?: number = 1;
    verdediging?: number = 1;

    items: ICollection<IItem> = [];

    equipment: {};

    constructor() {
        this.equipment = {
            head: null,
            amulet: null,
            body: null,
            hands: null,
            leftHand: null,
            leftRing: null,
            rightHand: null,
            rightRing: null,
            legs: null,
            feet: null
        }
    }
}