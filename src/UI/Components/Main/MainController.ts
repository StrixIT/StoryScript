namespace StoryScript {
    export class MainController {
        constructor(private _scope: ng.IScope, private _timeout: ng.ITimeoutService, private _eventListener: EventTarget, private _gameService: IGameService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = self._game;
            self.texts = self._texts;
            self._scope.$on('restart', () => self.init());
            self._scope.$on('showDescription', (event, args) => self._scope.$broadcast('initDescription', args));
            self._scope.$on('levelUp', () => self._scope.$broadcast('initLevelUp'));
            self._scope.$on('saveGame', () => self._scope.$broadcast('initSaveGame'));
            self._scope.$on('loadGame', () => self._scope.$broadcast('initLoadGame'));
            (<any>self._scope).game = self._game;

            self._scope.$watch('game.currentLocation', self.watchLocation);
            self._scope.$watch('game.character.currentHitpoints', self.watchCharacterHitpoints);
            self._scope.$watch('game.character.score', self.watchCharacterScore);

            _eventListener.addEventListener('combinationFinished', function(event) {
                self._scope.$broadcast('showCombinationText', (<any>event).combineText);
            });

            self.init();
        }

        showCharacterSheet = () => {
            var self = this;

            // Just check to see whether there are any character sheet elements that display anything 
            // to determine whether or not it should be shown.
            var sheetElement = angular.element('#character-sheet-container');
            return sheetElement[0] && sheetElement[0].innerText;
        }

        game: IGame;
        texts: IInterfaceTexts;

        private init() {
            var self = this;
            self._gameService.init();
            self._gameService.initTexts(self._texts);
            self._scope.$broadcast('createCharacter');
        }

        private watchCharacterHitpoints(newValue, oldValue, scope) {
            if (!scope.$ctrl._game.loading) {
                if (parseInt(newValue) && parseInt(oldValue) && newValue != oldValue) {
                    var change = newValue - oldValue;
                    // Todo: test, does this work?
                    scope.$ctrl._gameService.hitpointsChange(change);
                }
            }
        }

        private watchCharacterScore(newValue, oldValue, scope) {
            if (!scope.$ctrl._game.loading) {
                if (parseInt(newValue) && parseInt(oldValue) && newValue != oldValue) {
                    var increase = newValue - oldValue;
                    scope.$ctrl._gameService.scoreChange(increase);
                }
            }
        }

        private watchLocation(newValue: ICompiledLocation, oldValue: ICompiledLocation, scope) {
            if (!scope.$ctrl._game.loading) {
                if (oldValue != undefined && newValue != undefined) {
                    // Don't change the game state change to 'play' when a level-up is in progress. This level-up
                    // can be triggered on location change.
                    if (scope.$ctrl._game.state != StoryScript.GameState.LevelUp) {
                        scope.$ctrl._game.state = GameState.Play;
                    }
                }
            }
        }
    }

    MainController.$inject = ['$scope', '$timeout', 'eventListener', 'gameService', 'game', 'customTexts'];
}