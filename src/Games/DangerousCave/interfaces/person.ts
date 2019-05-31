namespace DangerousCave {
    export function Person<T extends IPerson>(entity: T): T {
        return StoryScript.Person(entity);
    }

    export interface IPersonBase extends StoryScript.IPersonBase {
        // Add game-specific person properties here
    }

    export interface IPerson extends IPersonBase, StoryScript.IPerson {
    }

    export interface ICompiledPerson extends IPersonBase, ICompiledEnemy, StoryScript.ICompiledPerson {
    }
}