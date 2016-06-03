module DangerousCave {
    export interface IEnemy extends StoryScript.IEnemy {
        items?: [() => IItem];
    }
}