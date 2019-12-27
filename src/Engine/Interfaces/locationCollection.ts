import { ICollection } from './collection';
import { ILocation } from './location';
import { ICompiledLocation } from './compiledLocation';

    export interface ILocationCollection extends ICollection<ICompiledLocation> {
        get?(id?: string | (() => ILocation) | ICompiledLocation): ICompiledLocation;
    }