module QuestForTheKing {
    export function Person<T extends IPerson>(entity: T): T {
        return StoryScript.Person(entity);
    }

    export interface IPerson extends IEnemy, StoryScript.IPerson, IEnemy {

    }
}