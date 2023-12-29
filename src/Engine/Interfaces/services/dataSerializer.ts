export interface IDataSerializer {
    buildClone(parentKey: string, values, pristineValues, clone?): any;

    restoreObjects (
        functionList: { [type: string]: { [id: string]: { function: Function, hash: number } } }, 
        descriptions: Map<string, string>,
        loaded: any
    ): any;
}