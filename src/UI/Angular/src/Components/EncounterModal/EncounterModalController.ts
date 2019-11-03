import StoryScript from '../../../../../types/storyscript';
import { StoryScriptScope } from '../StoryScriptScope';

export interface IModalSettings {
    title: string;
    closeText?: string;
    canClose?: boolean;
    closeAction?: (game: StoryScript.IGame) => void;
    descriptionEntity?: {};
}

export class EncounterModalController implements ng.IComponentController {
    constructor(private _scope: StoryScriptScope, private _sce: ng.ISCEService, private _gameService: StoryScript.IGameService, private _game: StoryScript.IGame, private _texts: StoryScript.IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
        this._scope.game = _game;

        this.modalSettings = <IModalSettings>{
            title: '',
            canClose: false,
            closeText: _texts.closeModal
        }

        this._scope.$watch('game.playState', (newValue: StoryScript.PlayState, oldValue: StoryScript.PlayState) => {
            this.watchPlayState(newValue, oldValue);
        });

        this._scope.$watch('game.currentDescription', (newValue: any, oldValue: any) => {
            if (newValue) {
                this.game.playState = StoryScript.PlayState.Description;
                this.modalSettings.title = this.game.currentDescription.title;
                this.modalSettings.descriptionEntity = {
                    type: this.game.currentDescription.type,
                    item: this.game.currentDescription.item
                };
            }
        });

        this._scope.$watchCollection('game.currentLocation.enemies', this.initCombat);
    }

    modalSettings: IModalSettings;
    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;

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
    
    private watchPlayState = (newValue: StoryScript.PlayState, oldValue: StoryScript.PlayState): void => {
        if (newValue !== StoryScript.PlayState.Menu) {          
            this.getStateSettings(newValue);
            this.switchState(newValue);
        }
    }

    private getStateSettings = (newValue: StoryScript.PlayState): void => {
        switch (newValue) {
            case StoryScript.PlayState.Combat: {
                this.modalSettings.title = this._texts.combatTitle;
                this.modalSettings.canClose = false;
            } break;
            case StoryScript.PlayState.Conversation: {
                var person = this._game.person;
                this.modalSettings.title = person.conversation.title || this._texts.format(this._texts.talk, [person.name]);
                this.modalSettings.canClose = true;
            } break;
            case StoryScript.PlayState.Trade: {
                var trader = this._game.trade;
                this.modalSettings.title = trader.title;
                this.modalSettings.canClose = true;
            } break;
            case StoryScript.PlayState.Description: {
                this.modalSettings.canClose = true;
            } break;
            default: {
            } break;
        }
    }

    private switchState = (newValue: StoryScript.PlayState): void => {
        if (newValue === null || newValue === undefined) {
            $('#encounters').modal('hide');
        }        
        else {
            $('#encounters').modal('show');
        }
    }

    private initCombat = (newValue: StoryScript.ICollection<StoryScript.IEnemy>): void => {
        if (newValue) {
            this._gameService.initCombat();

            if (!newValue.some(e => !e.inactive)) {
                this.modalSettings.canClose = true;
            }
        }
    }
}

EncounterModalController.$inject = ['$scope', '$sce', 'gameService', 'game', 'customTexts'];