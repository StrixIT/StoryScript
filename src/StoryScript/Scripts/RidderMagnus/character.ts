module RidderMagnus {
    export class Character implements StoryScript.ICharacter {
        name: 'Magnus';
        score: number = 0;
        hitpoints: number = 1;
        currentHitpoints: number = 1;

        // Add character properties here.
        vechten: number = 1;
        sluipen: number = 1;
        zoeken: number = 1;
        toveren: number = 1;

        items: StoryScript.ICollection<StoryScript.IItem> = [];

        equipment: {
            head: StoryScript.IItem,
            amulet: StoryScript.IItem,
            body: StoryScript.IItem,
            hands: StoryScript.IItem,
            leftHand: StoryScript.IItem,
            leftRing: StoryScript.IItem,
            rightHand: StoryScript.IItem,
            rightRing: StoryScript.IItem,
            legs: StoryScript.IItem,
            feet: StoryScript.IItem
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