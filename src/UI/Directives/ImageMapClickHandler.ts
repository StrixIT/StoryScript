namespace StoryScript
{
    export class ImageMapClickHandler implements ng.IDirective {
        constructor(private _game: IGame) {
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void => {
            var self = this;

            element.on('click', 'map', function(e) {
                self.handleClick(e, e.target, self._game, scope);
            });

            element.on('click', 'img', function(e) {
                self.handleClick(e, e.target.parentElement, self._game, scope);
            });
        };

        private handleClick(e: JQueryEventObject, target: Element, game: IGame, scope: angular.IScope) {
            e.preventDefault();
            var featureName = target.attributes['name'] && target.attributes['name'].value;
            
            if (featureName) {
                var feature = game.currentLocation.features.filter(f => f.id == featureName.toLowerCase())[0];
                if (feature) {
                    scope.$applyAsync(() => {
                        game.combinations.tryCombine(feature);
                    });
                }
            }
        }

        public static Factory()
        {
            return (game: IGame) => new ImageMapClickHandler(game);
        }
    }
}