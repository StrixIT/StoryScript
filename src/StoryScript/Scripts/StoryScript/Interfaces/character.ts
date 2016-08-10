module StoryScript {
    export interface ICharacter extends IActor {
        name: string;
        score: number;
        hitpoints: number;
        currentHitpoints: number;
        //money: number? en deze onder hitpoints tonen?

        items: StoryScript.ICollection<StoryScript.IItem>;

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
    }
}