﻿namespace RidderMagnus {
    export function Location(entity: ILocation): ILocation  {
        return StoryScript.Location(entity);
    }

    export interface ILocation extends StoryScript.ILocation {
        sluipCheck?: number;
    }

    export interface ICompiledLocation extends ILocation, StoryScript.ICompiledLocation {
        activeEnemies?: StoryScript.ICollection<IEnemy>;
        enemies?: StoryScript.ICollection<IEnemy>;
        activeItems?: StoryScript.ICollection<IItem>;
        items?: StoryScript.ICollection<IItem>;
        activePersons?: StoryScript.ICollection<IPerson>;
        persons?: StoryScript.ICollection<IPerson>;
        activePerson: IPerson;
    }
}