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

            self._scope.$watch('game.playState', (newValue: PlayState, oldValue: PlayState) => {
                self.watchPlayState(newValue, oldValue, self);
            });

            self._scope.$on('showDescription', (event, args) => {
                self._game.playState = PlayState.Description;
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
            self._game.playState = null;
        }

        getDescription(entity: any, key: string) {
            var self = this;
            return self._sce.trustAsHtml(self._gameService.getDescription(entity.type, entity.item, key));
        }

        private watchPlayState(newValue: PlayState, oldValue: PlayState, controller: EncounterModalController) {
            var self = this;

            if (newValue !== PlayState.Menu) {
                // Todo: is this really necessary?
                if (oldValue != undefined) {
                    // If there is a person trader, sync the money between him and the shop on trade end.
                    if (oldValue == PlayState.Trade) {
                        if (controller._game.currentLocation.activePerson && controller._game.currentLocation.activePerson.trade === controller._game.currentLocation.activeTrade) {
                            controller._game.currentLocation.activePerson.currency = controller._game.currentLocation.activeTrade.currency;
                        }
                    }
                }
                
                self.getStateSettings(controller, newValue);
                self.switchState(controller, newValue);
            }
        }

        private getStateSettings(controller: EncounterModalController, newValue: PlayState): void {
            switch (newValue) {
                case PlayState.Combat: {
                    controller.modalSettings.title = controller._texts.combatTitle;
                    controller.modalSettings.canClose = false;
                } break;
                case PlayState.Conversation: {
                    var person = controller._game.currentLocation.activePerson;
                    controller.modalSettings.title = person.conversation.title || controller._texts.format(controller._texts.talk, [person.name]);
                    controller.modalSettings.canClose = true;
                } break;
                case PlayState.Trade: {
                    var trader = controller._game.currentLocation.activeTrade;
                    controller.modalSettings.title = trader.title;
                    controller.modalSettings.canClose = true;
                } break;
                case PlayState.Description: {
                    controller.modalSettings.canClose = true;
                } break;
                default: {

                } break;
            }
        }

        private switchState(controller: EncounterModalController, newValue: PlayState): void {
            if (newValue === undefined) {
                return;
            }
            else if (newValue === null) {
                $('#encounters').modal('hide');
            }        
            else {
                $('#encounters').modal('show');
                controller._scope.$broadcast('init');
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