module StoryScript {
    export interface ICharacter extends IActor {
        name: string;
        score: number;
        hitpoints: number;
        currentHitpoints: number;

        items: StoryScript.ICollection<StoryScript.IItem>;

        equipment: {
        }
    }
}