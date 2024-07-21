import { RuntimeProperties } from "storyScript/runtimeProperties";
import { IEntity } from "./entity";

export interface IUpdatable extends IEntity {
    [RuntimeProperties.Deleted];
}