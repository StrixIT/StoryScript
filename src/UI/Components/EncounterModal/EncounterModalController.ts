namespace StoryScript {   
    export interface IModalSettings {
        title: string;
        closeText?: string;
        canClose?: boolean;
        closeAction?: (game: IGame) => void;
        descriptionEntity?: {};
    }

    export class EncounterModalController implements ng.IComponentController {
        constructor(private _scope: StoryScriptScope, private _sce: ng.ISCEService, private _gameService: IGameService, private _game: IGame, private _texts: IInterfaceTexts) {
            this.game = _game;
            this.texts = _texts;
            this._scope.game = _game;

            this.modalSettings = <IModalSettings>{
                title: '',
                canClose: false,
                closeText: _texts.closeModal
            }

            this._scope.$watch('game.playState', (newValue: PlayState, oldValue: PlayState) => {
                this.watchPlayState(newValue, oldValue, this);
            });

            this._scope.$on('showDescription', (event, args) => {
                this._game.playState = PlayState.Description;
                this.modalSettings.title = (<any>args).title;
                this.modalSettings.descriptionEntity = {
                    type: args.type,
                    item: args.item
                };
            });

            this._scope.$watchCollection('game.currentLocation.enemies', this.initCombat);
        }

        modalSettings: IModalSettings;
        game: IGame;
        texts: IInterfaceTexts;

        openModal = (modalSettings: any): void => {
            this.modalSettings = modalSettings;
            $('#encounters').modal('show');
        }

        closeModal = (): void => {
            if (this.modalSettings.closeAction) {
                this.modalSettings.closeAction(this._game);
            }

            this._gameService.saveGame();
            this._game.playState = null;
        }

        getDescription = (entity: any, key: string): string => this._sce.trustAsHtml(this._gameService.getDescription(entity.type, entity.item, key));
        
        private watchPlayState = (newValue: PlayState, oldValue: PlayState, controller: EncounterModalController): void => {
            if (newValue !== PlayState.Menu) {          
                this.getStateSettings(controller, newValue);
                this.switchState(controller, newValue);
            }
        }

        private getStateSettings = (controller: EncounterModalController, newValue: PlayState): void => {
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

        private switchState = (controller: EncounterModalController, newValue: PlayState): void => {
            if (newValue === null || newValue === undefined) {
                $('#encounters').modal('hide');
            }        
            else {
                $('#encounters').modal('show');
                controller._scope.$broadcast('init');
            }
        }

        private initCombat = (newValue: ICollection<IEnemy>): void => {
            if (newValue) {
                this._gameService.initCombat();

                if (!newValue.some(e => !e.inactive)) {
                    this.modalSettings.canClose = true;
                }
            }
        }
    }

    EncounterModalController.$inject = ['$scope', '$sce', 'gameService', 'game', 'customTexts'];
}