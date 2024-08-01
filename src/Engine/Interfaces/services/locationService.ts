import { ICollection } from '../collection';
import { ILocation } from '../location';
import { ICompiledLocation } from '../compiledLocation';
import { IGame } from '../game';

export interface ILocationService {
    init(game: IGame, buildWorld?: boolean): void;
    loadLocationDescriptions(game: IGame): void;
    saveWorld(locations: Record<string, ICompiledLocation>): void;
    changeLocation(location: string | (() => ILocation), travel: boolean, game: IGame): void;
}