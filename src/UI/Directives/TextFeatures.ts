namespace StoryScript
{
    export class TextFeatures implements ng.IDirective {
        restrict = 'A';
        scope = {
            location: '='
        }
    
        constructor(private _combinationService: ICombinationService, private _game: IGame) {
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void => {
            var self = this;

            scope.$on('showCombinationText', function(event, data: ShowCombinationTextEvent) {
                var featureNode = element.find('feature[name="' + data.featureToRemove + '"]')[0];

                if (featureNode) {
                    featureNode.remove();
                }
            });

            element.on('click', function(ev) {
                if (self.isFeatureNode(ev)) {
                    var feature = self.getFeature(ev);

                    if (feature) {
                        var result = self._game.combinations.tryCombine(feature);
                        scope.$applyAsync();
                    }
                }
            });

            element.on('mouseover', function(ev) {
                if (self.isFeatureNode(ev)) {
                    var node = angular.element(ev.target);
                    var feature = self.getFeature(ev);
                    var combineClass= self._combinationService.getCombineClass(feature);
                    node.addClass(combineClass);

                    // Todo: not needed? Works without this in Chrome.
                    // node.on('mouseout', function(ev) {
                    //     var node = angular.element(ev.target);
                    //     node.removeClass(combineClass);
                    //     node.off('mouseout');
                    // });
                }
            });

        };

        private isFeatureNode(ev: JQueryEventObject): boolean {
            var nodeType = ev.target && ev.target.nodeName && ev.target.nodeName.toLowerCase();
            return nodeType === 'feature';
        }

        private getFeature(ev: JQueryEventObject): IFeature {
            var self = this;
            var featureName = angular.element(ev.target).attr('name');
            return self._game.currentLocation.features.get(featureName);
        }

        public static Factory()
        {
            return (combinationService: ICombinationService, game: IGame) => new TextFeatures(combinationService, game);
        }
    }
}