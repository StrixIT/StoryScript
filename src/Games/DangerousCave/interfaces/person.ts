namespace DangerousCave {
    export function PersonIPerson(entity: IPerson): IPerson {
        return StoryScript.Person(entity);
    }

    export interface IPerson extends IEnemy, StoryScript.IPerson {
        // Add game-specific person properties here
    }
}