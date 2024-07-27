export interface IDataSerializer {
    createSerializableClone(values: any, pristineValues: Record<string, Record<string, any>>): any;

    restoreObjects (loaded: any): any;
}