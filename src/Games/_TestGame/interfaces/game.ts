import { IGame, IHelpers, ICollection } from '../../../Engine/Interfaces/storyScript'
import { Character } from '../character';
import { ICompiledLocation, IEnemy, IPerson, IItem } from '../types';

export interface IGame extends IGame {
    character: Character;
    person: IPerson;
    locations: ICollection<ICompiledLocation>;
    currentLocation: ICompiledLocation;
    previousLocation: ICompiledLocation;
    helpers: IHelpers;
}

export interface IHelpers extends IHelpers {
    randomEnemy: (selector?: (enemy: IEnemy) => boolean) => IEnemy;
    randomItem: (selector?: (enemy: IItem) => boolean) => IItem;
    getEnemy: (selector: string) => IEnemy;
    getItem: (selector: string) => IItem;
}