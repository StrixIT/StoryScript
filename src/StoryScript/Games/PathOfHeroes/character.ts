module PathOfHeroes {
    export class Character implements StoryScript.ICharacter {
        name: string = "";
        currency: number = 0;
        hitpoints: number = 20;
        currentHitpoints: number = 20;
        mana: number = 20;
        currentMana: number = 20;
        score: number;
        scoreToNextLevel: number = 0;
        level: number = 1;

        strength: number = 1;
        agility: number = 1;
        intelligence: number = 1;
        charisma: number = 1;

        melee: number = 0;
        armor: number = 0;
        ranged: number = 0;
        stealth: number = 0;
        creation: number = 0;
        destruction: number = 0;
        body: number = 0;
        spirit: number = 0;

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