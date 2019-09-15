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
                // Show the text of added features.
                element.find('feature')
                    .filter((i, e) => e.innerHTML.trim() === '')
                    .map((i, e) => {
                        var featureElement = angular.element(e);
                        var feature = self._game.currentLocation.features.get(featureElement.attr('name'));

                        if (feature) {
                            self._game.currentLocation.text = self._game.currentLocation.text.replace(new RegExp('<feature name="' + feature.id +'">\s*<\/feature>'), '<feature name="' + feature.id +'">' + addHtmlSpaces(feature.description) + '<\/feature>');
                        }
                    });
                
                // Remove the text of deleted features.
                element.find('feature')
                    .filter((i, e) => e.innerHTML.trim() !== '')
                    .map((i, e) => {
                        var featureElement = angular.element(e);

                        if (data.featuresToRemove && data.featuresToRemove.indexOf(featureElement.attr('name')) > -1)
                        {
                            featureElement[0].innerHTML = '';
                        }
                    });
            });

            element.on('click', function(ev) {
                if (self.isFeatureNode(ev)) {
                    var feature = self.getFeature(ev);

                    if (feature) {
                        self._game.combinations.tryCombine(feature);
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
                }
            });

        };

        private isFeatureNode(ev: JQueryEventObject): boolean {
            var nodeType = ev.target && ev.target.nodeName;
            return StoryScript.compareString(nodeType, 'feature');
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