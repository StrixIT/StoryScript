import { ILocation as StoryScriptILocation, Location as StoryScriptLocation, ICompiledLocation as StoryScriptICompiledLocation, ICollection } from 'storyScript/Interfaces/storyScript';

export function Location(entity: ILocation): ILocation  {
    return StoryScriptLocation(entity);
}

export interface ILocation extends StoryScriptILocation {
    // Add game-specific location properties here
}

export interface ICompiledLocation extends ILocation, StoryScriptICompiledLocation {
    // Add game-specific location properties here
}