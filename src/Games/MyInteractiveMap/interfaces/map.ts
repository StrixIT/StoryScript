import { IMap as StoryScriptIMap, LocationMap as StoryScriptLocationMap, IMapLocation as StoryScriptIMapLocation } from 'storyScript/Interfaces/storyScript';
import { ILocation } from "./location.ts";

export function LocationMap(entity: IMap): IMap {
    return StoryScriptLocationMap(entity);
}

export interface IMap extends StoryScriptIMap {
    locations: IMapLocation[];
    secondaryLocations?: IMapSecondaryLocation[]; // Add this line
    // Add game-specific location properties here
}

export interface IMapLocation extends StoryScriptIMapLocation {
    location: (() => ILocation) | string;
    // Add game-specific location properties here
}

// Add this new interface
export interface IMapSecondaryLocation {
    name: string;
    coords: string;
    tooltip?: string;
}
