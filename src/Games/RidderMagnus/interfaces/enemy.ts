namespace RidderMagnus {
    export function BuildEnemy<T extends IEnemy>(entity: T): T {
        return StoryScript.BuildEnemy(entity);
    }

    export interface IEnemy extends StoryScript.IEnemy {
        attack: string;
        defense?: number;
        reward: number;
        goudstukken?: number;
    }
}