import { ILocation } from "../location";

export interface IMapLocation {
    location: (() => ILocation) | string;
    coords?: string;
    MarkerPicture?: string;
    description?: string;
}