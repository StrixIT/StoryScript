﻿module MyNewGame {
    export class Character implements StoryScript.ICharacter {
        name: string;
        score: number = 0;
        currency: number = 0;
        level: number = 1;
        hitpoints: number = 10;
        currentHitpoints: number = 10;

        strength: number = 1;
        agility: number = 1;
        intelligence: number = 1;

        items: StoryScript.ICollection<StoryScript.IItem> = [];

        equipment: {
            head: StoryScript.IItem,
            body: StoryScript.IItem,
            leftHand: StoryScript.IItem,
            rightHand: StoryScript.IItem,
            feet: StoryScript.IItem,
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
}