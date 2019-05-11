namespace MyAdventureGame {
    export function Enemy<T extends IEnemy>(entity: T): T {
        return StoryScript.Enemy(entity);
    }

    export interface IEnemy extends StoryScript.IEnemy {
        // Add game-specific enemy properties here
    }
}