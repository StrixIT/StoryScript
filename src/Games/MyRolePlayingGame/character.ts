namespace MyRolePlayingGame {
    export class Character implements StoryScript.ICharacter {
        name: string = "";
        score: number = 0;
        hitpoints: number = 10;
        currentHitpoints: number = 10;
        currency: number = 0;

        // Add character properties here.
        strength: number = 1;
        agility: number = 1;
        intelligence: number = 1;

        items: StoryScript.ICollection<IItem> = [];

        equipment: {
            // Remove the slots you don't want to use
            head: IItem,
            body: IItem,
            leftHand: IItem,
            rightHand: IItem,
            feet: IItem
        };

        constructor() {
            this.equipment = {
                // Remove the slots you don't want to use
                head: null,
                body: null,
                leftHand: null,
                rightHand: null,
                feet: null
            }
        }
    }
}