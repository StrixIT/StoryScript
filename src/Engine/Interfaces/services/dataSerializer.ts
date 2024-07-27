export interface IDataSerializer {
    buildClone(values: any, pristineValues: Record<string, Record<string, any>>, clone?: any): any;

    restoreObjects (
        functionList: { [type: string]: { [id: string]: { function: Function, hash: number } } }, 
        descriptions: Map<string, string>,
        loaded: any
    ): any;
}