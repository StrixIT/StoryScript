import { ICollection } from '../collection';
import { ILocation } from '../location';
import { ICompiledLocation } from '../compiledLocation';
import { IGame } from '../game';

export interface ILocationService {
    init(game: IGame, buildWorld?: boolean): void;
    loadLocationDescriptions(game: IGame): void;
    saveWorld(locations: ICollection<ICompiledLocation>): void;
    copyWorld(): ICollection<ICompiledLocation>;
    changeLocation(location: string | (() => ILocation), travel: boolean, game: IGame): void;
}