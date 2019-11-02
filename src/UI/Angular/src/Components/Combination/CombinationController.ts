import StoryScript from '../../../../../types/storyscript';

export class CombinationController implements ng.IComponentController {
    constructor(private _combinationService: StoryScript.ICombinationService, private _game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.game = this._game;
        this.texts = _texts;
        this.combineActions = this._combinationService.getCombinationActions();
    }

    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;
    combineActions: StoryScript.ICombinationAction[];

    selectCombinationAction = (combination: StoryScript.ICombinationAction) => this._combinationService.setActiveCombination(combination);

    getCombineClass = (action: StoryScript.ICombinationAction): string => this._game.combinations.activeCombination && this._game.combinations.activeCombination.selectedCombinationAction === action ? 'btn-outline-dark' : 'btn-dark';
    
    tryCombination = (source: StoryScript.ICombinable): StoryScript.ICombineResult => this._combinationService.tryCombination(source);   
}

CombinationController.$inject = ['combinationService', 'game', 'customTexts'];