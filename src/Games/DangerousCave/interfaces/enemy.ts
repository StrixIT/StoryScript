namespace DangerousCave {
    export function Enemy<T extends IEnemy>(entity: T): T {
        return StoryScript.Enemy(entity);
    }

    export interface IEnemyBase extends StoryScript.IEnemyBase {
        attack: string;
        reward: number;
    }

    export interface IEnemy extends IEnemyBase, StoryScript.IEnemy {
    }

    export interface ICompiledEnemy extends IEnemyBase, ICompiledFeature, StoryScript.ICompiledEnemy {
    }
}