namespace GameTemplate {
    export function Key<T extends IKey>(entity: T): T {
        return StoryScript.Key(entity);
    }

    export interface IKey extends IItem, StoryScript.IKey {
        // Add game-specific key properties here
    }

    export interface ICompiledKey extends IKey, ICompiledItem, StoryScript.ICompiledKey {
    }
}