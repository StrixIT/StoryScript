import {inject, Injectable} from '@angular/core';
import {NgbModal, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {GameService} from 'storyScript/Services/GameService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {IGame, IInterfaceTexts, PlayState} from 'storyScript/Interfaces/storyScript';
import {MenuModalComponent} from '../Components/MenuModal/menumodal.component';
import {EncounterModalComponent} from '../Components/EncounterModal/encountermodal.component';
import {IModalSettings} from '../Components/modalSettings';
import {DataService} from "storyScript/Services/DataService.ts";

@Injectable()
export class ModalService {
    private readonly _modalService: NgbModal;
    private readonly _dataService: DataService;
    private readonly _gameService: GameService;
    private _activeModal = <NgbModalRef>null;
    private _previousModalState = <PlayState>null;

    constructor() {
        this._modalService = inject(NgbModal);
        this._dataService = inject(DataService);
        this._gameService = inject(GameService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this._gameService.watchPlayState(this.openOrCloseModal);
    }

    private readonly game: IGame;
    private readonly texts: IInterfaceTexts;

    private readonly openOrCloseModal = (game: IGame, newState: PlayState, oldState: PlayState): void => {
        if (this._previousModalState && newState === this._previousModalState) {
            return;
        }

        const settings = this.getStateSettings(newState);

        const modalOptions = <NgbModalOptions>{
            beforeDismiss: () => {
                this.closeModal(false);
            }, backdrop: settings.canClose !== undefined && !settings.canClose ? 'static' : null, keyboard: false
        };

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
            } else {
                this._activeModal = this._modalService.open(EncounterModalComponent, modalOptions);
                this._activeModal.componentInstance.element.parentElement.classList.add('encounter-modal');
                this._activeModal.componentInstance.settings = settings;
            }
        }
    }

    private readonly closeModal = (dismiss: boolean) => {
        // The menu modal doesn't have settings and we don't need to save when closing the menu.
        if (this._activeModal.componentInstance?.settings) {
            if (this._activeModal.componentInstance.settings.closeAction) {
                this._activeModal.componentInstance.closeAction(this.game);
            }

            this._dataService.saveGame(this.game);
        }

        if (dismiss) {
            this._modalService.dismissAll();
        }

        this._previousModalState = null;
        this._activeModal = null;
    }

    private readonly getStateSettings = (value: PlayState): IModalSettings => {
        const modalSettings: IModalSettings = {
            title: '',
            closeText: this.texts.closeModal
        };

        if (value === PlayState.Combat) {
            modalSettings.title = this.texts.combatTitle;
            modalSettings.canClose = false;
        } else if (value === PlayState.Conversation) {
            const person = this.game.person;
            modalSettings.title = person.conversation.title || this.texts.format(this.texts.talk, [person.name]);
            modalSettings.canClose = true;
        } else if (value === PlayState.Trade) {
            const trader = this.game.trade;
            modalSettings.title = trader.name;
            modalSettings.canClose = true;
        } else if (value === PlayState.Description) {
            modalSettings.title = this.game.currentDescription.title;
            modalSettings.description = this.game.currentDescription.item.description;
            modalSettings.descriptionType = this.game.currentDescription.type;
            modalSettings.canClose = true;
        }

        return modalSettings;
    }
}