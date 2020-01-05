import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GameService } from 'storyScript/Services/gameService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { IInterfaceTexts, PlayState, IGame } from 'storyScript/Interfaces/storyScript';
import { MenuModalComponent } from '../Components/MenuModal/menumodal.component';
import { EncounterModalComponent } from '../Components/EncounterModal/encountermodal.component';
import { IModalSettings } from '../Components/modalSettings';
import { watchPlayState, watchDynamicStyles } from '../helpers';

@Injectable()
export class ModalService {
    private _activeModal = <NgbModalRef>null;
    private _previousModalState = <PlayState>null;

    constructor(private _modalService: NgbModal, private _gameService: GameService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();

        watchPlayState(this.game, this.openOrCloseModal);
    }

    private game: IGame;
    private texts: IInterfaceTexts;

    private openOrCloseModal = (game: IGame, newState: PlayState, oldState: PlayState): void => {
        // 1. Just opening the menu
        if (newState === PlayState.Menu) {
            this._activeModal = this._modalService.open(MenuModalComponent);
            watchDynamicStyles(this.game, this._activeModal.componentInstance.element);
        }
        // 2. When opening the encounter modal
        else if (newState && !oldState && !this._previousModalState) {
            this._activeModal = this._modalService.open(EncounterModalComponent);
            this._activeModal.componentInstance.settings = this.getStateSettings(newState);
            watchDynamicStyles(this.game, this._activeModal.componentInstance.element);
        }
        // 3. When changing states on the encounter modal (e.g. from description to combat)
        else if (newState && oldState) {
            this._previousModalState = oldState;
        }
        // When changing back from the previous state on the encounter modal (e.g. from combat back to description)
        else if (newState != this._previousModalState) {
            game.playState = this._previousModalState;
            this._previousModalState = null;
        }
        // When no new or previous state is available, close the modal
        else if (!newState && this._activeModal) {
            // The menu modal doesn't have settings and we don't need to save when closing the menu.
            if (this._activeModal.componentInstance?.settings) {
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
                modalSettings.descriptionType = this.game.currentDescription.type;
                modalSettings.canClose = true;
            } break;
            default: {
            } break;
        }

        return modalSettings;
    }
}