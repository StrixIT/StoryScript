import {IAction, IGame, ILocation} from 'storyScript';

export interface ILocationService {
    init(): void;

    processDestinations(game: IGame): void;

    loadLocationDescriptions(game: IGame): void;

    changeLocation(location: string | (() => ILocation), travel: boolean, game: IGame): void;

    executeAction(action: [string, IAction]): void;
}