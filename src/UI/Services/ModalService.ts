import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GameService } from 'storyScript/Services/gameService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { IInterfaceTexts, PlayState, IGame } from 'storyScript/Interfaces/storyScript';
import { MenuModalComponent } from '../Components/MenuModal/menumodal.component';
import { EncounterModalComponent } from '../Components/EncounterModal/encountermodal.component';
import { IModalSettings } from '../Components/modalSettings';
import { watchDynamicStyles } from '../helpers';

@Injectable()
export class ModalService {
    private _activeModal = <NgbModalRef>null;
    private _previousModalState = <PlayState>null;

    constructor(private _modalService: NgbModal, private _gameService: GameService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();

        _gameService.watchPlayState(this.openOrCloseModal);
    }

    private game: IGame;
    private texts: IInterfaceTexts;

    private openOrCloseModal = (game: IGame, newState: PlayState, oldState: PlayState): void => {
        if (this._previousModalState && newState === this._previousModalState) {
            return;
        }

        const modalOptions = <NgbModalOptions>{ beforeDismiss: () => {
            this.closeModal(false);
        } };

        // 1. If there is already an active modal:
        if (this._activeModal) {
            // a. Restore the old modal state, if it has a value.
            if (this._previousModalState) {
                game.playState = this._previousModalState;
                this._previousModalState = null;
                return;
            }

            // b. If the new state is NULL, close the modal.
            if (newState === null) {
                this.closeModal(true);
            }
            // c. If the new state is not NULL, don't open a new modal. Instead, just store the old state
            // so we can switch back to it later. If there
            else {
                this._previousModalState = oldState;
            }

            return;
        }

        // 2. If not, open the correct modal
        if (newState !== null) {
            if (newState === PlayState.Menu) {
                this._activeModal = this._modalService.open(MenuModalComponent, modalOptions);
            }
            else {
                this._activeModal = this._modalService.open(EncounterModalComponent, modalOptions);
                this._activeModal.componentInstance.element.parentElement.classList.add('encounter-modal');
                this._activeModal.componentInstance.settings = this.getStateSettings(newState);
                watchDynamicStyles(this.game, this._activeModal.componentInstance.element);
            }
        }
    }

    private closeModal = (dismiss: boolean) => {
        // The menu modal doesn't have settings and we don't need to save when closing the menu.
        if (this._activeModal.componentInstance?.settings) {
            if (this._activeModal.componentInstance.settings.closeAction) {
                this._activeModal.componentInstance.closeAction(this.game);
            }

            this._gameService.saveGame();
        }

        if (dismiss) {
            this._modalService.dismissAll();
        }

        this._previousModalState = null;
        this._activeModal = null;
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