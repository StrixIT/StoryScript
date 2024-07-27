import {IEntity} from "storyScript/Interfaces/entity.ts";

export interface SerializationData
{
    clone: any;
    key: string;
    original: any;
    originalValue: any;
    pristine: any;
    pristineValue: any;
    pristineValues: Record<string, Record<string, IEntity>>;
}