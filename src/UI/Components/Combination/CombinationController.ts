namespace StoryScript {
    export class CombinationController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _combinationService: ICombinationService, private _game: IGame, _texts: IInterfaceTexts) {
            this.game = this._game;
            this.texts = _texts;
            this.combineActions = this._combinationService.getCombinationActions();
        }

        game: IGame;
        texts: IInterfaceTexts;
        combineActions: ICombinationAction[];

        selectCombinationAction = (combination: ICombinationAction) => this._combinationService.setActiveCombination(combination);

        getCombineClass = (action: ICombinationAction): string => this._game.combinations.activeCombination && this._game.combinations.activeCombination.selectedCombinationAction === action ? 'btn-outline-dark' : 'btn-dark';
     
        tryCombination = (source: ICombinable): ICombineResult => this._combinationService.tryCombination(source);   
    }

    CombinationController.$inject = ['$scope', 'combinationService', 'game', 'customTexts'];
}