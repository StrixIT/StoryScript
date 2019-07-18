namespace RidderMagnus {
    export function Enemy(entity: IEnemy): IEnemy {
        return StoryScript.Enemy(entity);
    }

    export interface IEnemy extends StoryScript.IEnemy {
        attack: string;
        defense?: number;
        reward: number;
        goudstukken?: number;
    }
}