import { ICombinationAction, ICombinable, ICombineResult } from '../combinations/combinations';

export interface ICombinationService {
    getCombinationActions(): ICombinationAction[];
    getCombineClass(tool: ICombinable): string;
    setActiveCombination(combination: ICombinationAction): void;
    tryCombination(target: ICombinable): ICombineResult;
}