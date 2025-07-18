import {IGame as StoryScriptIGame, IHelpers as StoryScriptIHelpers} from 'storyScript/Interfaces/storyScript';
import {Character, ICompiledLocation, IEnemy, IItem, ILocation, IParty, IPerson} from '../types';
import {IWorldProperties} from "./worldProperties.ts";

// Your game-specific game interface.
export interface IGame extends StoryScriptIGame {
    party: IParty,
    activeCharacter: Character;
    person: IPerson;
    locations: Record<string, ICompiledLocation> & {
        get?(id?: string | (() => ILocation) | ICompiledLocation): ICompiledLocation;
    };
    currentLocation: ICompiledLocation;
    previousLocation: ICompiledLocation;
    worldProperties: IWorldProperties;
    helpers: IHelpers;
    changeTime?: (time: string) => void;
    delayedDescriptionChanges?: (() => void)[];
}

export interface IHelpers extends StoryScriptIHelpers {
    randomEnemy: (selector?: (enemy: IEnemy) => boolean) => IEnemy;
    randomItem: (selector?: (enemy: IItem) => boolean) => IItem;
    getEnemy: (selector: string) => IEnemy;
    getItem: (selector: string) => IItem;
}