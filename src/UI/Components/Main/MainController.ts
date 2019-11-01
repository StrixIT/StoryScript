namespace StoryScript {
    export class MainController {
        constructor(private _scope: StoryScriptScope, private _timeout: ng.ITimeoutService, private _gameService: IGameService, private _sharedMethodService: ISharedMethodService, private _game: IGame, _texts: IInterfaceTexts) {
            this.game = _game;
            this.texts = _texts;
            this._scope.game = _game;

            this._scope.$on('restart', (ev) => {
                this._game.combinations.combinationResult.reset();
                this.broadcast(ev, null, () => this.init(true));
            });

            this._scope.$on('showDescription', this.broadcast);

            // Watch for dynamic styling.
            this._game.dynamicStyles = this._game.dynamicStyles || [];
            this._scope.$watchCollection('game.dynamicStyles', () => this.applyDynamicStyling());

            this.init();
        }
        
        game: IGame;
        texts: IInterfaceTexts;

        showCharacterPane = (): boolean => this._sharedMethodService.useCharacterSheet || this._sharedMethodService.useEquipment || this._sharedMethodService.useBackpack || this._sharedMethodService.useQuests;

        private init = (restart?: boolean): void => {
            if (restart) {
                this._gameService.restart();
            }
            else {
                this._gameService.init();
            }
        }

        private broadcast = (event: ng.IAngularEvent, args?: any[], callback?: Function): void =>
        {
            if (event.currentScope !== event.targetScope) {
                if (callback) {
                    callback();
                }

                event.currentScope.$broadcast(event.name, args);
            }
        }

        private applyDynamicStyling = (): void => {
            this._timeout(() => {
                this._game.dynamicStyles.forEach(s => {
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

    MainController.$inject = ['$scope', '$timeout', 'gameService', 'sharedMethodService', 'game', 'customTexts'];
}