namespace RidderMagnus {
    export class Character implements StoryScript.ICharacter {
        name: string = 'Magnus';
        score: number = 0;
        hitpoints: number = 20;
        currentHitpoints: number = 20;
        currency: number = 0;

        // Add character properties here.
        vechten: number = 1;
        sluipen: number = 1;
        zoeken: number = 1;
        toveren: number = 0;
        snelheid: number = 1;

        items: StoryScript.ICollection<StoryScript.IItem> = [];
        quests: StoryScript.ICollection<StoryScript.IQuest> = [];

        equipment: {
            head: StoryScript.IItem,
            amulet: StoryScript.IItem,
            body: StoryScript.IItem,
            //hands: StoryScript.IItem,
            leftHand: StoryScript.IItem,
            //leftRing: StoryScript.IItem,
            rightHand: StoryScript.IItem,
            //rightRing: StoryScript.IItem,
            //legs: StoryScript.IItem,
            feet: StoryScript.IItem
        };

        constructor() {
            this.equipment = {
                head: null,
                amulet: null,
                body: null,
                //hands: null,
                leftHand: null,
                //leftRing: null,
                rightHand: Items.Dolk(),
                //rightRing: null,
                //legs: null,
                feet: null
            }
        }
    }
}