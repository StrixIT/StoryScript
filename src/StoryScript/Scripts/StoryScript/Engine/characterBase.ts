module StoryScript {
    export class CharacterBase implements Interfaces.ICharacter {
        name: string;
        hitpoints: number;
        currentHitpoints: number;
        score: number;
        scoreToNextLevel: number;
        level: number;
        items: Interfaces.ICollection<Interfaces.IItem>;
        equipment: {
            head: Interfaces.IItem,
            amulet: Interfaces.IItem,
            body: Interfaces.IItem,
            hands: Interfaces.IItem,
            leftHand: Interfaces.IItem,
            leftRing: Interfaces.IItem,
            rightHand: Interfaces.IItem,
            rightRing: Interfaces.IItem,
            legs: Interfaces.IItem,
            feet: Interfaces.IItem
        };
    }
}