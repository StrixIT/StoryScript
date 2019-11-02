namespace StoryScript
{
    export class TextFeatures implements ng.IDirective {
        restrict = 'A';
        scope = {
            location: '='
        }
    
        constructor(private _combinationService: ICombinationService, private _game: IGame) {
        }

        link = (scope: StoryScriptScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void => {
            scope.game = this._game;

            scope.$watch('game.combinations.combinationResult.done', (newValue) => {
                if (newValue) {
                    // Show the text of added features.
                    element.find('feature')
                        .filter((i, e) => e.innerHTML.trim() === '')
                        .map((i, e) => {
                            var featureElement = angular.element(e);
                            var feature = this._game.currentLocation.features.get(featureElement.attr('name'));

                            if (feature) {
                                this._game.currentLocation.text = this._game.currentLocation.text.replace(new RegExp('<feature name="' + feature.id +'">\s*<\/feature>'), '<feature name="' + feature.id +'">' + addHtmlSpaces(feature.description) + '<\/feature>');
                            }
                        });
                    
                    // Remove the text of deleted features.
                    element.find('feature')
                        .filter((i, e) => e.innerHTML.trim() !== '')
                        .map((i, e) => {
                            var featureElement = angular.element(e);

                            if (this._game.combinations.combinationResult.featuresToRemove.indexOf(featureElement.attr('name')) > -1)
                            {
                                featureElement[0].innerHTML = '';
                            }
                        });

                    element.find('feature').each((i, e) => {
                        angular.element(e).removeClass(['combine-active-selected']);
                    });
                }
            });

            element.on('click', ev => {
                if (this.isFeatureNode(ev)) {
                    var feature = this.getFeature(ev);

                    if (feature) {
                        var node = angular.element(ev.target);
                        this._game.combinations.tryCombine(feature);
                        var combineClass= this._combinationService.getCombineClass(feature);
                        node.addClass(combineClass);
                        scope.$applyAsync();
                    }
                }
            });

            element.on('mouseover', ev => {
                if (this.isFeatureNode(ev)) {
                    var node = angular.element(ev.target);
                    var feature = this.getFeature(ev);
                    var combineClass= this._combinationService.getCombineClass(feature);
                    node.addClass(combineClass);
                }
            });
            
        };

        private isFeatureNode = (ev: JQueryEventObject): boolean  => {
            var nodeType = ev.target && ev.target.nodeName;
            return StoryScript.compareString(nodeType, 'feature');
        }

        private getFeature = (ev: JQueryEventObject): IFeature => {
            var featureName = angular.element(ev.target).attr('name');
            return this._game.currentLocation.features.get(featureName);
        }

        public static Factory()
        {
            return (combinationService: ICombinationService, game: IGame) => new TextFeatures(combinationService, game);
        }
    }
}