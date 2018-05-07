namespace StoryScript {
    export class CombinationController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _combinationService: ICombinationService, private _texts: IInterfaceTexts) {
            var self = this;
            self.texts = _texts;
            self.buildCombine();
            self._scope.$on('buildCombine', self.buildCombine);
        }

        texts: IInterfaceTexts;
        combination: ICombination;
        combineSources: any[];
        combineTargets: any[];
        combineActions: ICombinationAction[];

        showCombinations = () => {
            var self = this;
            return self._combinationService.showCombinations(self.combination);
        }

        tryCombination = (source: { id: string, name: string, combinations: ICombinations<any> }, target: { id: string }, type: ICombinationAction) => {
            var self = this;
            self._combinationService.tryCombination(source, target, type);
        }

        private buildCombine = (): void => {
            var self = this;
            var combine = self._combinationService.buildCombine();

            if (combine) {
                self.combineActions = combine.combineActions;
                self.combineSources = combine.combineSources;
                self.combineTargets = combine.combineTargets;
                self.combination = combine.combination;
            }
        }
    }

    CombinationController.$inject = ['$scope', 'combinationService', 'customTexts'];
}