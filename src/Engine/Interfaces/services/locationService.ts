import { ILocation } from '../location';
import { IGame } from '../game';
import {IAction} from "storyScript/Interfaces/action.ts";

export interface ILocationService {
    init(): void;
    processDestinations(game: IGame): void;
    loadLocationDescriptions(game: IGame): void;
    changeLocation(location: string | (() => ILocation), travel: boolean, game: IGame): void;
    executeAction(action: [string, IAction]): void;
}