module DangerousCave {
    export interface ICompiledEnemy extends StoryScript.ICompiledEnemy {
        attack: string;
        reward: number;
    }
}