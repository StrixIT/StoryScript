module StoryScript {
    export interface ICharacter extends IActor {
        name: string;
        hitpoints: number;
        currentHitpoints: number;
        score: number;
        scoreToNextLevel: number;
        level: number;
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