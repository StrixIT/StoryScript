export interface IDataSerializer {
    buildClone(values, pristineValues, clone?): any;

    restoreObjects (
        functionList: { [type: string]: { [id: string]: { function: Function, hash: number } } }, 
        descriptions: Map<string, string>,
        loaded: any
    ): any;
}