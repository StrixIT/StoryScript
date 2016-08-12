module DangerousCave {
    export interface IEnemy extends StoryScript.IEnemy {
        attack: string;
        reward: number;
    }
}