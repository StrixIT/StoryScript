namespace StoryScript {
    export class CombinationController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _combinationService: ICombinationService, private _game: IGame, _texts: IInterfaceTexts) {
            this.game = this._game;
            this.texts = _texts;
            this.combineActions = this._combinationService.getCombinationActions();
            this._scope.$on('showCombinationText', (event, data) => { this.showCombinationText(data); });
            this._scope.$on('restart', () => this.showCombinationText(null));
            this._scope.$on('gameLoaded', () => this.showCombinationText(null));
        }

        game: IGame;
        texts: IInterfaceTexts;
        combineActions: ICombinationAction[];
        combinationText: string;

        selectCombinationAction = (combination: ICombinationAction) => {
            this.combinationText = null;
            this._combinationService.setActiveCombination(combination);
        }

        getCombineClass = (action: ICombinationAction): string => this._game.combinations.activeCombination && this._game.combinations.activeCombination.selectedCombinationAction === action ? 'btn-outline-dark' : 'btn-dark';

        showCombinationText = (event: ShowCombinationTextEvent): string => this.combinationText = event && event.combineText;
        
        tryCombination = (source: ICombinable): ICombineResult => this._combinationService.tryCombination(source);   
    }

    CombinationController.$inject = ['$scope', 'combinationService', 'game', 'customTexts'];
}