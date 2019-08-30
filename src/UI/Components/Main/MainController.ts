namespace StoryScript {
    export class ShowCombinationTextEvent extends Event {
        constructor() {
            super('showCombinationText');
        }

        combineText: string;
        featuresToRemove: string[];
    }

    export class MainController {
        constructor(private _scope: ng.IScope, private _timeout: ng.ITimeoutService, private _eventListener: EventTarget, private _gameService: IGameService, private _sharedMethodService: ISharedMethodService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = self._game;
            self.texts = self._texts;
            self._scope.$on('restart', () => self.init(true));
            self._scope.$on('showDescription', (event, args) => self._scope.$broadcast('initDescription', args));
            self._scope.$on('levelUp', () => self._scope.$broadcast('initLevelUp'));
            self._scope.$on('saveGame', () => self._scope.$broadcast('initSaveGame'));
            self._scope.$on('loadGame', () => self._scope.$broadcast('initLoadGame'));
            (<any>self._scope).game = self._game;

            self._scope.$watch('game.currentLocation', self.watchLocation);
            self._scope.$watch('game.character.currentHitpoints', self.watchCharacterHitpoints);
            self._scope.$watch('game.character.score', self.watchCharacterScore);

            self._game.dynamicStyles = self._game.dynamicStyles || [];

            // Todo: improve this by using an object with deep watch?
            self._scope.$watchCollection('game.dynamicStyles', function(newForm, oldForm) {
                self.applyDynamicStyling();
            });

            _eventListener.addEventListener('combinationFinished', function(finishedEvent: StoryScript.CombinationFinishedEvent) {
                var showEvent = new ShowCombinationTextEvent();
                showEvent.combineText = finishedEvent.combineText;
                showEvent.featuresToRemove = finishedEvent.featuresToRemove;
                self._scope.$broadcast(showEvent.type, showEvent);
            });

            self.init();
        }

        showCharacterPane = () => {
            var self = this;
            return self._sharedMethodService.useCharacterSheet || self._sharedMethodService.useEquipment || self._sharedMethodService.useBackpack || self._sharedMethodService.useQuests;
        }

        game: IGame;
        texts: IInterfaceTexts;

        private init(restart?: boolean) {
            var self = this;

            if (restart) {
                self._gameService.restart();
            }

            self._gameService.init();
            self._scope.$broadcast('createCharacter');
        }

        private watchCharacterHitpoints(newValue, oldValue, scope) {
            if (!scope.$ctrl._game.loading) {
                if (parseInt(newValue) && parseInt(oldValue) && newValue != oldValue) {
                    var change = newValue - oldValue;
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

        private applyDynamicStyling() {
            var self = this;

            self._timeout(() => {
                self._game.dynamicStyles.forEach(s => {
                    var element = angular.element(s.elementSelector);

                    if (element.length) {
                        var styleText = '';
                        s.styles.forEach(e => styleText += e[0] + ': ' + e[1] + ';' );
                        element.attr('style', styleText);
                    }

                });
            }, 0, false);
        }
    }

    MainController.$inject = ['$scope', '$timeout', 'eventListener', 'gameService', 'sharedMethodService', 'game', 'customTexts'];
}