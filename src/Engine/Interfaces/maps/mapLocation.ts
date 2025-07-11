import { ILocation } from "../location";

export interface IMapLocation {
    location: (() => ILocation) | string;
    coords?: string;
    markerImage?: string;
    textLabel?: string
    description?: string;
}