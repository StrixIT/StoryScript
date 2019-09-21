namespace StoryScript {   
    export interface IModalSettings {
        title: string;
        closeText?: string;
        canClose?: boolean;
        closeAction?: (game: IGame) => void;
        descriptionEntity?: {};
    }

    export class EncounterModalController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _sce: ng.ISCEService, private _gameService: IGameService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;
            (<any>self._scope).game = self._game;

            self.modalSettings = <IModalSettings>{
                title: '',
                canClose: false,
                closeText: self.texts.closeModal
            }

            self._scope.$watch('game.state', (newValue: GameState, oldValue: GameState) => {
                self.watchGameState(newValue, oldValue, self);
            });

            self._scope.$on('initDescription', (event, args) => {
                self.modalSettings.title = (<any>args).title;
                self.modalSettings.descriptionEntity = {
                    type: args.type,
                    item: args.item
                };
            });

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
            self._game.state = GameState.Play;
        }

        getDescription(entity: any, key: string) {
            var self = this;
            return self._sce.trustAsHtml(self._gameService.getDescription(entity.type, entity.item, key));
        }

        private watchGameState(newValue: GameState, oldValue: GameState, controller: EncounterModalController) {
            var self = this;

            if (oldValue != undefined) {
                // If there is a person trader, sync the money between him and the shop on trade end.
                if (oldValue == GameState.Trade) {
                    if (controller._game.currentLocation.activePerson && controller._game.currentLocation.activePerson.trade === controller._game.currentLocation.activeTrade) {
                        controller._game.currentLocation.activePerson.currency = controller._game.currentLocation.activeTrade.currency;
                    }
                }

                if (oldValue == GameState.LevelUp && newValue == GameState.Play) {
                    // Level-up was just completed. Save the game from here, because the character service cannot depend on the game service.
                    self._gameService.saveGame();
                }
            }
            
            self.getStateSettings(controller, newValue);
            self.switchState(controller, newValue);
        }

        private getStateSettings(controller: EncounterModalController, newValue: GameState): void {
            switch (newValue) {
                case GameState.Combat: {
                    controller.modalSettings.title = controller._texts.combatTitle;
                    controller.modalSettings.canClose = false;
                } break;
                case GameState.Conversation: {
                    var person = controller._game.currentLocation.activePerson;
                    controller.modalSettings.title = person.conversation.title || controller._texts.format(controller._texts.talk, [person.name]);
                    controller.modalSettings.canClose = true;
                } break;
                case GameState.Trade: {
                    var trader = controller._game.currentLocation.activeTrade;
                    controller.modalSettings.title = trader.title;
                    controller.modalSettings.canClose = true;
                } break;
                case GameState.Description: {
                    controller.modalSettings.canClose = true;
                } break;
                default: {

                } break;
            }
        }

        private switchState(controller: EncounterModalController, newValue: GameState): void {
            if (newValue != undefined) {
                var modalStates = [
                    GameState.Combat,
                    GameState.Trade,
                    GameState.Conversation,
                    GameState.Description
                ];

                if (modalStates.some(s => s == newValue)) {
                    $('#encounters').modal('show');
                    controller._scope.$broadcast('init');
                }
                else {
                    $('#encounters').modal('hide');
                }

                if (newValue == GameState.LevelUp) {
                    controller._scope.$emit('levelUp');
                }

                controller._gameService.changeGameState(newValue);
            }
        }

        private initCombat = (newValue: ICollection<IEnemy>): void => {
            var self = this;

            if (newValue) {
                self._gameService.initCombat();

                if (!newValue.some(e => !e.inactive)) {
                    self.modalSettings.canClose = true;
                }
            }
        }
    }

    EncounterModalController.$inject = ['$scope', '$sce', 'gameService', 'game', 'customTexts'];
}