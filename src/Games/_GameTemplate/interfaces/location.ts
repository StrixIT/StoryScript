namespace GameTemplate {
    export function Location(entity: ILocation): ILocation  {
        return StoryScript.Location(entity);
    }

    export interface ILocation extends StoryScript.ILocation {
        // Add game-specific location properties here
    }

    export interface ICompiledLocation extends StoryScript.ICompiledLocation {
        activeEnemies?: IEnemy[];
        enemies?: IEnemy[];
        activeItems?: IItem[];
        items?: IItem[];
        activePersons?: IPerson[];
        persons?: IPerson[];
        activePerson: IPerson;
    }
}