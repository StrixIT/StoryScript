namespace StoryScript
{
    export class FeaturePicture implements ng.IDirective {
        constructor(private _game: IGame) {
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void => {
            var self = this;
            var feature = <IFeature>(<any>scope).feature;
            var topElement = angular.element('#visual-features');
            self.removeExistingElements(topElement, feature);
            var parentElement = null;

            scope.$on('showCombinationText', function(event, data: ShowCombinationTextEvent) {
                if (parentElement && data.featuresToRemove && data.featuresToRemove.indexOf(feature.id) > -1) {
                    parentElement.remove();
                }
            });

            if (feature.picture) {
                parentElement = angular.element('<div name="' + feature.id + '"></div>');
                topElement.append(parentElement);
                var coords = self.getFeatureCoordinates(feature);
                var pictureElement = angular.element('<img class="feature-picture" name="' + feature.id + '" src="' + 'resources/' + feature.picture + '" style="top:' + coords.top + 'px' +'; left: '+ coords.left + 'px' + '" />');
                parentElement.append(pictureElement);
                pictureElement.on('click', function() { element.click(); });
            }
        };

        private removeExistingElements(topElement, feature) {
            var self = this;
            var existingElements = topElement.children('div[name]');
            var currentFeatureIds = self._game.currentLocation.features.filter(f => f.id != feature.id).map(f => f.id);

            for (var i = 0; i < existingElements.length; i++) {
                var element = angular.element( existingElements[i]);

                if (currentFeatureIds.indexOf(element.attr('name')) === -1) {
                    element.remove();
                }
            };
        }

        private getFeatureCoordinates = (feature: IFeature): { top: number, left: number } => {
            var coords = feature.coords.split(",");
            var top = null, left = null;
    
            if (feature.shape.toLowerCase() === 'poly') {
                var x = [], y = [];
    
                for (var i = 0; i < coords.length; i++) {
                    var value = coords[i];
                    if (i % 2 === 0) {
                        x.push(value);
                    }
                    else {
                        y.push(value);
                    }
                }
    
                left = x.reduce(function (p, v) {
                    return (p < v ? p : v);
                });
                
                top = y.reduce(function (p, v) {
                    return (p < v ? p : v);
                });
            }
            else {
                left = coords[0];
                top = coords[1];
            }

            return { top: top, left: left };
        }

        public static Factory()
        {
            return (game: IGame) => new FeaturePicture(game);
        }
    }
}