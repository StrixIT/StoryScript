module RidderMagnus {
    export interface ICompiledEnemy extends StoryScript.ICompiledEnemy {
        attack: string;
        defense?: number;
        reward: number;
        goudstukken?: number;
    }
}