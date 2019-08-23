namespace _LanternofWorlds {
    export function Enemy(entity: IEnemy): IEnemy {
        return StoryScript.Enemy(entity);
    }

    export interface IEnemy extends StoryScript.IEnemy {
        // Add game-specific enemy properties here
    }
}