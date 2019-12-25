import { IGame as StoryScriptIGame, IHelpers as StoryScriptIHelpers, ICollection } from 'storyScript/Interfaces/storyScript';
import { ICompiledLocation, IEnemy, IPerson, IItem, Character } from '../types';

export interface IGame extends StoryScriptIGame {
    character: Character;
    person: IPerson;
    locations: ICollection<ICompiledLocation>;
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