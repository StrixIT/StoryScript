import { IGame as StoryScriptIGame } from 'storyScript/Interfaces/game';
import { IHelpers as StoryScriptIHelpers } from 'storyScript/Interfaces/helpers';
import { ICollection } from 'storyScript/Interfaces/collection';
import { Character } from '../character';
import { ICompiledLocation, IEnemy, IPerson, IItem } from '../types';

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