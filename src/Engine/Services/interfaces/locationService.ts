import { ICollection } from '../../Interfaces/collection';
import { ILocation } from '../../Interfaces/location';
import { ICompiledLocation } from '../../Interfaces/compiledLocation';
import { IGame } from '../../Interfaces/game';

export interface ILocationService {
    init(game: IGame, buildWorld?: boolean): void;
    saveWorld(locations: ICollection<ICompiledLocation>): void;
    copyWorld(): ICollection<ICompiledLocation>;
    changeLocation(location: string | (() => ILocation), travel: boolean, game: IGame): void;
}