namespace GameTemplate {
    export function Location<T extends ILocation>(entity: T): T {
        return StoryScript.Location(entity);
    }

    export interface ILocationBase extends StoryScript.ILocationBase {
        // Add game-specific location properties here
    }

    export interface ILocation extends ILocationBase, StoryScript.ILocation {
    }

    export interface ICompiledLocation extends ILocationBase, StoryScript.ICompiledLocation {
        activeEnemies?: StoryScript.ICompiledCollection<IEnemy, ICompiledEnemy>;
        enemies?: StoryScript.ICompiledCollection<IEnemy, ICompiledEnemy>;
        activeItems?: StoryScript.ICompiledCollection<IItem, ICompiledItem>;
        items?: StoryScript.ICompiledCollection<IItem, ICompiledItem>;
        activePersons?: StoryScript.ICompiledCollection<IPerson, ICompiledPerson>;
        persons?: StoryScript.ICompiledCollection<IPerson, ICompiledPerson>;
        activePerson: ICompiledPerson;
    }
}