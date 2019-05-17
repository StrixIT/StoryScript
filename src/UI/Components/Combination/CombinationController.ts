namespace StoryScript {
    export class CombinationController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _timeout: ng.ITimeoutService, private _combinationService: ICombinationService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = self._game;
            self.texts = _texts;
            self.combineActions = self._combinationService.getCombinationActions();
            self._scope.$on('showCombinationText', (event, text) => { self.showCombinationText(text); });
        }

        game: IGame;
        texts: IInterfaceTexts;
        combineActions: ICombinationAction[];
        combinationText: string;

        selectCombinationAction = (combination: ICombinationAction) => {
            var self = this;

            if (!combination) {
                return;
            }

            if (self._game.combinations.activeCombination && self._game.combinations.activeCombination.selectedCombinationAction === combination) {
                self._game.combinations.activeCombination = null;
                return;
            }

            combination.requiresTool = combination.requiresTool === undefined || combination.requiresTool === true ? true : false;

            self._game.combinations.activeCombination = {
                selectedCombinationAction: combination,
                selectedTool: null,
                combineText: combination.requiresTool ? combination.text : combination.text + ' ' + (combination.preposition || '')
            };
        }

        getCombineClass = (action: ICombinationAction) => {
            var self = this;
            return self._game.combinations.activeCombination && self._game.combinations.activeCombination.selectedCombinationAction === action ? 'btn-outline-dark' : 'btn-dark';
        }

        showCombinationText = (text: string): void => {
            var self = this;
            self.combinationText = text;
            self._timeout(() => self.combinationText = null, 4000);
        }

        tryCombination = (source: ICombinable, target: { name: string }, type: ICombinationAction) => {
            var self = this;
            self._combinationService.tryCombination(source);
        }
    }

    CombinationController.$inject = ['$scope', '$timeout', 'combinationService', 'game', 'customTexts'];
}