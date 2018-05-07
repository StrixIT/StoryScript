namespace StoryScript {
    export class MainController {
        constructor(private _scope: ng.IScope, private _gameService: IGameService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = self._game;
            self._scope.$on('restart', () => self.init());
            self._scope.$on('refreshCombine', () => self._scope.$broadcast('buildCombine'));
            (<any>self._scope).game = self._game;

            self._scope.$watch('game.currentLocation', self.watchLocation);
            self._scope.$watch('game.character.currentHitpoints', self.watchCharacterHitpoints);
            self._scope.$watch('game.character.score', self.watchCharacterScore);
            self._scope.$watchCollection('game.currentLocation.persons', self.watchPersons);
            self._scope.$watchCollection('game.currentLocation.destinations', self.watchDestinations);
            self._scope.$watchCollection('game.currentLocation.features', self.watchFeatures);
            
            self.init();
        }

        game: IGame;

        private init() {
            var self = this;

            var defaultTexts = new DefaultTexts();

            for (var n in defaultTexts.texts) {
                self._texts[n] = self._texts[n] ? self._texts[n] : defaultTexts.texts[n];
            }

            self._texts.format = defaultTexts.format;
            self._texts.titleCase = defaultTexts.titleCase;

            self._gameService.init();
            self._scope.$broadcast('createCharacter');
        }

        private watchPersons = (newValue: ICompiledPerson[]) => {
            var self = this;
            self._scope.$broadcast('buildCombine');
        }

        private watchDestinations = (newValue: IDestination[]) => {
            var self = this;
            self._scope.$broadcast('buildCombine');
        }

        private watchFeatures = (newValue: IDestination[]) => {
            var self = this;
            self._scope.$broadcast('buildCombine');
        }

        private watchCharacterHitpoints(newValue, oldValue, scope) {
            if (parseInt(newValue) && parseInt(oldValue) && newValue != oldValue) {
                var change = newValue - oldValue;
                // Todo: test, does this work?
                scope.$ctrl._gameService.hitpointsChange(change);
            }
        }

        private watchCharacterScore(newValue, oldValue, scope) {
            if (parseInt(newValue) && parseInt(oldValue) && newValue != oldValue) {
                var increase = newValue - oldValue;
                scope.$ctrl._gameService.scoreChange(increase);
            }
        }

        private watchLocation(newValue: ICompiledLocation, oldValue: ICompiledLocation, scope) {
            if (oldValue != undefined && newValue != undefined) {
                // Don't change the game state change to 'play' when a level-up is in progress. This level-up
                // can be triggered on location change.
                if (scope.$ctrl._game.state != StoryScript.GameState.LevelUp) {
                    scope.$ctrl._game.state = GameState.Play;
                }
            }
        }
    }

    MainController.$inject = ['$scope', 'gameService', 'game', 'customTexts'];
}