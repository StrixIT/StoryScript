module StoryScript.Interfaces {
    export interface ICharacter {
        name: string;
        hitpoints: number;
        currentHitpoints: number;
        score: number;
        scoreToNextLevel: number;
        level: number;
        items: ICollection<IItem>;
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
        }
    }
}