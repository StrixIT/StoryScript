namespace RidderMagnus {
    export interface IEnemy extends StoryScript.IEnemy {
        attack: string;
        defense?: number;
        reward: number;
        goudstukken?: number;
    }
}