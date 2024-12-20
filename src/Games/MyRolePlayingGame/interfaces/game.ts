﻿import { IGame as StoryScriptIGame, IHelpers as StoryScriptIHelpers } from 'storyScript/Interfaces/storyScript';
import { ICompiledLocation, IPerson, ILocation, IParty, IEnemy, IItem, Character } from '../types';

export interface IGame extends StoryScriptIGame {
    party: IParty,
    activeCharacter: Character;
    person: IPerson;
    locations: Record<string, ICompiledLocation> & {
        get?(id?: string | (() => ILocation) | ICompiledLocation): ICompiledLocation;
    };
    currentLocation: ICompiledLocation;
    previousLocation: ICompiledLocation;
    helpers: IHelpers;
}

export interface IHelpers extends StoryScriptIHelpers {
    randomEnemy: (selector?: (enemy: IEnemy) => boolean) => IEnemy;
    randomItem: (selector?: (enemy: IItem) => boolean) => IItem;
    getEnemy: (selector: string) => IEnemy;
    getItem: (selector: string) => IItem;
}