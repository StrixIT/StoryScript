module QuestForTheKing {
    export interface IEnemy extends StoryScript.IEnemy {
        items?: [() => IItem];
    }
}