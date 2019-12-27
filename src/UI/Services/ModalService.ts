import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GameService } from 'storyScript/Services/gameService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { IInterfaceTexts, PlayState, IGame } from 'storyScript/Interfaces/storyScript';
import { MenuModalComponent } from '../Components/MenuModal/menumodal.component';
import { EncounterModalComponent } from '../Components/EncounterModal/encountermodal.component';
import { IModalSettings } from '../Components/modalSettings';

@Injectable()
export class ModalService {
    private _activeModal = null;

    constructor(private _modalService: NgbModal, private _gameService: GameService , objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();

        this.watchPlayState();
    }

    private game: IGame;
    private texts: IInterfaceTexts;

    private watchPlayState = () => {
        var playState = this.game.playState;

        Object.defineProperty(this.game, 'playState', {
            enumerable: true,
            get: () => {
                return playState;
            },
            set: value => {
                playState = value;
                this.openOrCloseModal(playState);
            }
        });
    }

    private openOrCloseModal = (state: PlayState): void => {
        if (state === PlayState.Menu) {
            this._activeModal = this._modalService.open(MenuModalComponent);
        }
        else if (state) {
            this._activeModal = this._modalService.open(EncounterModalComponent);
            this._activeModal.componentInstance.settings = this.getStateSettings(state);
        }
        else if (this._activeModal) {
            // The menu modal doesn't have settings and we don't need to save when closing the menu.
            if (this._activeModal.componentInstance.settings) {
                if (this._activeModal.componentInstance.settings.closeAction) {
                    this._activeModal.componentInstance.closeAction(this.game);
                }

                this._gameService.saveGame();
            }

            this._modalService.dismissAll();
            this._activeModal = null;
        }
    }

    private getStateSettings = (value: PlayState): IModalSettings => {
        var modalSettings: IModalSettings = {
            title: '',
            closeText: this.texts.closeModal
        };

        switch (value) {
            case PlayState.Combat: {
                modalSettings.title = this.texts.combatTitle;
                modalSettings.canClose = false;
            } break;
            case PlayState.Conversation: {
                var person = this.game.person;
                modalSettings.title = person.conversation.title || this.texts.format(this.texts.talk, [person.name]);
                modalSettings.canClose = true;
            } break;
            case PlayState.Trade: {
                var trader = this.game.trade;
                modalSettings.title = trader.name;
                modalSettings.canClose = true;
            } break;
            case PlayState.Description: {
                modalSettings.title = this.game.currentDescription.title;
                modalSettings.description = this.game.currentDescription.item.description;
                modalSettings.canClose = true;
            } break;
            default: {
            } break;
        }

        return modalSettings;
    }
}