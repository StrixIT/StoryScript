namespace StoryScript
{
    export class FeaturePicture implements ng.IDirective {
        constructor(private _game: IGame) {
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void => {
            var self = this;
            var feature = <IFeature>(<any>scope).feature;

            if (feature.picture) {
                var coords = self.getFeatureCoordinates(feature);
                var pictureElement = '<img src="' + 'resources/' + feature.picture + '" style="position: absolute; top:' + coords.top + 'px' +'; left: '+ coords.left + 'px' + '" />';
                element.append(pictureElement);
            }
        };

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