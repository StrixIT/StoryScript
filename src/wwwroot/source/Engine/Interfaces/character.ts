namespace StoryScript {
    export interface ICharacter {
        name: string;
        score: number;
        hitpoints: number;
        currentHitpoints: number;
        currency: number;

        items: ICollection<StoryScript.IItem>;
        combatItems?: ICollection<StoryScript.IItem>;

        quests?: ICollection<StoryScript.IQuest>;

        equipment: {
            head?: IItem,
            body: IItem,
            hands?: IItem,
            leftHand?: IItem,
            leftRing?: IItem,
            rightHand?: IItem,
            rightRing?: IItem,
            legs?: IItem,
            feet?: IItem
        }

        level?: number;
    }
}