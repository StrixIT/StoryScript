import {IEntity} from "storyScript/Interfaces/entity.ts";

export interface IDataSynchronizer {
    updateModifiedEntities(
        entities: IEntity[],
        pristineEntities: Record<string, Record<string, any>>,
        parentEntity?: IEntity,
        pristineParentEntity?: IEntity
    ): void;

    updateModifiedEntity (
        entity: IEntity, 
        pristineEntity: IEntity, 
        pristineEntities: Record<string, Record<string, any>>,
        parentEntity?: IEntity,
        pristineParentEntity?: IEntity,
        parentProperty?: string
    ): void;
}