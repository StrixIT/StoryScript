import { ICombinationAction } from '../combinations/combinationAction';
import { ICombinable } from '../combinations/combinable';
import { ICombineResult } from '../combinations/combineResult';

export interface ICombinationService {
    getCombinationActions(): ICombinationAction[];
    getCombineClass(tool: ICombinable): string;
    setActiveCombination(combination: ICombinationAction): void;
    tryCombination(target: ICombinable): ICombineResult;
}