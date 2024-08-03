export interface IDataSerializer {
    createSerializableClone(values: any, clone?: any): any;
    restoreObjects (loaded: any): any;
}