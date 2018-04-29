namespace StoryScript {   
    export interface IEncounterModalController extends ng.IScope {
        game: IGame;
    }

    export class EncounterModalController implements ng.IComponentController {
        constructor(private _scope: IEncounterModalController, private _gameService: IGameService, private _game: IGame, private _rules: IRules, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;
            self._scope.game = self.game;

            self.modalSettings = <IModalSettings>{
                title: '',
                canClose: false,
                closeText: self.texts.closeModal
            }

            self._scope.$watch('game.state', (newValue: GameState, oldValue: GameState) => self.watchGameState(newValue, oldValue, self.modalSettings, self._texts, self._game, self._gameService));
            self._scope.$watchCollection('game.currentLocation.enemies', self.initCombat);
        }

        modalSettings: IModalSettings;
        game: IGame;
        texts: IInterfaceTexts;

        openModal = (modalSettings: any) => {
            var self = this;
            self.modalSettings = modalSettings;
            $('#encounters').modal('show');
        }

        closeModal = () => {
            var self = this;

            if (self.modalSettings.closeAction) {
                self.modalSettings.closeAction(self._game);
            }

            self._gameService.saveGame();
            self._scope.$broadcast('refreshCombine');
            self._game.state = GameState.Play;
        }

        getDescription(entity: any, key: string) {
            var self = this;
            return entity && entity[key] ? self._rules.processDescription ? self._rules.processDescription(self._game, entity, key) : entity[key] : null;
        }

        private watchGameState(newValue: GameState, oldValue: GameState, settings: IModalSettings, texts: IInterfaceTexts, game: IGame, gameService: IGameService) {
            if (oldValue != undefined) {
                // If there is a person trader, sync the money between him and the shop on trade end.
                if (oldValue == GameState.Trade) {
                    if (game.currentLocation.activePerson && game.currentLocation.activePerson.trade === game.currentLocation.activeTrade) {
                        game.currentLocation.activePerson.currency = game.currentLocation.activeTrade.currency;
                    }
                }
            }
            
            switch (newValue) {
                case GameState.Combat: {
                    settings.title = texts.combatTitle;
                    settings.canClose = false;
                } break;
                case GameState.Conversation: {
                    var person = game.currentLocation.activePerson;
                    settings.title = person.conversation.title || texts.format(texts.talk, [person.name]);
                    settings.canClose = true;
                } break;
                case GameState.Trade: {
                    var trader = game.currentLocation.activeTrade;
                    settings.title = trader.title || texts.format(texts.trade, [(<ICompiledPerson>trader).name]);
                    settings.canClose = true;
                } break;
                case GameState.Conversation: {
                    // Todo
                } break;
                default: {

                } break;
            }

            if (newValue != undefined) {
                if (newValue == GameState.Combat || newValue == GameState.Trade || newValue == GameState.Conversation || newValue == GameState.Description) {
                    $('#encounters').modal('show');
                }
                else {
                    $('#encounters').modal('hide');
                }

                gameService.changeGameState(newValue);
            }
        }

        private initCombat = (newValue: ICompiledEnemy[]): void => {
            var self = this;

            if (newValue && !newValue.some(e => !e.inactive)) {
                self.modalSettings.canClose = true;
            }

            if (newValue && self._rules.initCombat) {
                self._rules.initCombat(self.game, self.game.currentLocation);
            }

            self._scope.$broadcast('refreshCombine');
        }
    }

    EncounterModalController.$inject = ['$scope', 'gameService', 'game', 'rules', 'customTexts'];
}