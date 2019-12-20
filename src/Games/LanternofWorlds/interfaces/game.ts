import { IGame as StoryScriptIGame } from 'storyScript/Interfaces/game';
import { IHelpers as StoryScriptIHelpers } from 'storyScript/Interfaces/helpers';
import { ICollection } from 'storyScript/Interfaces/collection';
import { IPerson, IEnemy, IItem, ICompiledLocation, Character } from '../types';

// Your game-specific game interface.
export interface IGame extends StoryScriptIGame {
    character: Character;
    person: IPerson;
    locations: ICollection<ICompiledLocation>;
    currentLocation: ICompiledLocation;
    previousLocation: ICompiledLocation;
    helpers: IHelpers;
    worldProperties: {
        startChoice: string,
        mapPosition: string,
        mapLocationY: number,
        mapLocationX: number
    }
}

export interface IHelpers extends StoryScriptIHelpers {
    randomEnemy: (selector?: (enemy: IEnemy) => boolean) => IEnemy;
    randomItem: (selector?: (enemy: IItem) => boolean) => IItem;
    getEnemy: (selector: string) => IEnemy;
    getItem: (selector: string) => IItem;
}