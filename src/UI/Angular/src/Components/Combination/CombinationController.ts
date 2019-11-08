import { IInterfaceTexts, IGame, Combinations } from '../../../../../Engine/Interfaces/storyScript';
import { ICombinationService } from '../../../../../Engine/Services/interfaces/services';

export class CombinationController implements ng.IComponentController {
    constructor(private _combinationService: ICombinationService, private _game: IGame, _texts: IInterfaceTexts) {
        this.game = this._game;
        this.texts = _texts;
        this.combineActions = this._combinationService.getCombinationActions();
    }

    game: IGame;
    texts: IInterfaceTexts;
    combineActions: Combinations.ICombinationAction[];

    selectCombinationAction = (combination: Combinations.ICombinationAction) => this._combinationService.setActiveCombination(combination);

    getCombineClass = (action: Combinations.ICombinationAction): string => this._game.combinations.activeCombination && this._game.combinations.activeCombination.selectedCombinationAction === action ? 'btn-outline-dark' : 'btn-dark';
    
    tryCombination = (source: Combinations.ICombinable): Combinations.ICombineResult => this._combinationService.tryCombination(source);   
}

CombinationController.$inject = ['combinationService', 'game', 'customTexts'];