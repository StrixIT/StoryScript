namespace StoryScript
{
    export class ImageMapClickHandler implements ng.IDirective {
        constructor(private _game: IGame) {
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void => {
            var self = this;

            element.on('click', 'map', function(e) {
                e.preventDefault();
                var target = e.target;
                var featureName = target.attributes['name'] && target.attributes['name'].value;

                if (featureName) {
                    var feature = self._game.currentLocation.features.filter(f => f.name.toLowerCase() == featureName.toLowerCase())[0];

                    if (feature) {
                        scope.$applyAsync(() => {
                            self._game.combinations.tryCombine(feature);
                        });
                    }
                }
            });
        };

        public static Factory()
        {
            return (game: IGame) => new ImageMapClickHandler(game);
        }
    }
}