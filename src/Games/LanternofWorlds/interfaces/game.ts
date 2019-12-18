import * as StoryScript from '../../../Engine/Interfaces/storyScript';
import { IPerson, IEnemy, IItem, ICompiledLocation, Character } from '../types';

// Your game-specific game interface.
export interface IGame extends StoryScript.IGame {
    character: Character;
    person: IPerson;
    locations: StoryScript.ICollection<ICompiledLocation>;
    currentLocation: ICompiledLocation;
    previousLocation: ICompiledLocation;
    helpers: IHelpers;
}

export interface IHelpers extends StoryScript.IHelpers {
    randomEnemy: (selector?: (enemy: IEnemy) => boolean) => IEnemy;
    randomItem: (selector?: (enemy: IItem) => boolean) => IItem;
    getEnemy: (selector: string) => IEnemy;
    getItem: (selector: string) => IItem;
}