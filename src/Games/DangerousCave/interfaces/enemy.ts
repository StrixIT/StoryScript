namespace DangerousCave {
    export function Enemy(entity: IEnemy): IEnemy {
        return StoryScript.Enemy(entity);
    }

    export interface IEnemy extends StoryScript.IEnemy {
        attack: string;
        reward: number;
    }
}