namespace PathOfHeroes {
    export function BuildPerson<T extends IPerson>(entity: T): T {
        return StoryScript.BuildPerson(entity);
    }

    export interface IPerson extends StoryScript.IPerson, IEnemy {
    }
}