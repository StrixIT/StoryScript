import { IUpdatable } from "../updatable";

export interface IDataSynchronizer {
    updateModifiedEntities(
        entities: IUpdatable[],
        pristineEntities: Record<string, Record<string, any>>,
        parentEntity?: IUpdatable,
        pristineParentEntity?: IUpdatable
    ): void;

    updateModifiedEntity (
        entity: IUpdatable, 
        pristineEntity: IUpdatable, 
        pristineEntities: Record<string, Record<string, any>>,
        parentEntity?: IUpdatable,
        pristineParentEntity?: IUpdatable,
        parentProperty?: string
    ): void;
}