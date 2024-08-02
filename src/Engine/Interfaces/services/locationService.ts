import { ILocation } from '../location';
import { IGame } from '../game';

export interface ILocationService {
    init(buildWorld: boolean): void;
    loadLocationDescriptions(game: IGame): void;
    changeLocation(location: string | (() => ILocation), travel: boolean, game: IGame): void;
}