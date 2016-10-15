module GameTemplate {
    export class Character implements StoryScript.ICharacter {
        name: string = "";
        score: number = 0;
        hitpoints: number = 10;
        currentHitpoints: number = 10;
        currency: number = 0;

        // Add character properties here.

        items: StoryScript.ICollection<IItem> = [];

        equipment: {
            head: IItem,
            amulet: IItem,
            body: IItem,
            hands: IItem,
            leftHand: IItem,
            leftRing: IItem,
            rightHand: IItem,
            rightRing: IItem,
            legs: IItem,
            feet: IItem
        };

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
}