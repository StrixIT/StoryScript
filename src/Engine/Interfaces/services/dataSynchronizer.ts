export interface IDataSynchronizer {
    synchronizeEntityData (
        entity: any, 
        pristineEntity?: any,
        parentEntity?: any,
        pristineParentEntity?: any,
        parentProperty?: string
    ): void;
}