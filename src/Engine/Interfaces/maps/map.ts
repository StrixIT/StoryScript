import { IMapLocation } from "./mapLocation";

export interface IMap {
    name: string;
    mapImage: string;
    locations: IMapLocation[];
    avatarImage?: string;
    textLabels: boolean;
    locationMarkerImage?: string;
}