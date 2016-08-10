module QuestForTheKing {
    export class Character implements StoryScript.ICharacter {
        name: string;
        hitpoints: number = 20;
        currentHitpoints: number = 20;
        score: number = 0;

        strength: number = 1;
        agility: number = 1;
        intelligence: number = 1;
        charisma: number = 1;

        items: StoryScript.ICollection<StoryScript.IItem> = [];

        equipment: {
            head: StoryScript.IItem,
            body: StoryScript.IItem,
            leftHand: StoryScript.IItem,
            rightHand: StoryScript.IItem,
            feet: StoryScript.IItem
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