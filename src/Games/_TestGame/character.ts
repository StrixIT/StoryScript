namespace _TestGame {
    export class Character implements StoryScript.ICharacter {
        name: string = "";
        score: number = 0;
        currency: number = 0;
        level: number = 1;
        hitpoints: number = 10;
        currentHitpoints: number = 10;

        // Add character properties here.
        strength: number = 1;
        agility: number = 1;
        intelligence: number = 1;

        items: StoryScript.ICollection<IItem> = [];

        equipment: {
            head: IItem,
            body: IItem,
            leftHand: IItem,
            rightHand: IItem,
            feet: IItem,
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