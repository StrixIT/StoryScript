module DangerousCave {
    export class Character implements StoryScript.ICharacter {
        name: string;
        hitpoints: number = 20;
        currentHitpoints: number = 20;
        score: number;
        scoreToNextLevel: number;
        level: number = 1;

        kracht: number = 1;
        vlugheid: number = 1;
        oplettendheid: number = 1;
        defense: number = 1;

        items: StoryScript.ICollection<StoryScript.IItem>;
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
    }
}