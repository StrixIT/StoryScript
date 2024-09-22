import {
    ICompiledLocation as StoryScriptICompiledLocation,
    ILocation as StoryScriptILocation,
    Location as StoryScriptLocation
} from 'storyScript/Interfaces/storyScript';
import {IAction, IDestination, IEnemy, IItem, IPerson} from '../types';

export function Location(entity: ILocation): ILocation {
    return StoryScriptLocation(entity);
}

export interface ILocation extends StoryScriptILocation {
    actions?: [string, IAction][];
    destinations?: IDestination[];
    enemies?: IEnemy[];
    items?: IItem[];
    persons?: IPerson[];
}

export interface ICompiledLocation extends ILocation, StoryScriptICompiledLocation {
    actions?: [string, IAction][];
    destinations?: IDestination[];
    enemies?: IEnemy[];
    items?: IItem[];
    persons?: IPerson[];
    encounterWonDay?: boolean;
    encounterWonNight?: boolean;
    completedDay?: boolean;
    completedNight?: boolean;
}