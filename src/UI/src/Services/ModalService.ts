import { Injectable, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { IInterfaceTexts, PlayState, IGame } from 'storyScript/Interfaces/storyScript';
import { MenuModalComponent } from '../Components/MenuModal/menumodal.component';
import { EncounterModalComponent } from '../Components/EncounterModal/encountermodal.component';
import { IModalSettings } from '../Components/modalSettings';
import { EventService } from './EventService';

@Injectable()
export class ModalService implements OnDestroy {

    constructor(private _modalService: NgbModal, private _eventService: EventService , objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();

        this._playStateSubscription = this._eventService.playStateChange$.subscribe((p: PlayState) => this.openModal(p));
    }

    private _playStateSubscription: Subscription;

    private game: IGame;
    private texts: IInterfaceTexts;

    ngOnDestroy(): void {
        this._playStateSubscription.unsubscribe();
    }

    openModal = (state: PlayState): void => {
        if (state === PlayState.Menu) {
            this._modalService.open(MenuModalComponent);
        }
        else if (state) {
            var modal = this._modalService.open(EncounterModalComponent);
            modal.componentInstance.settings = this.getStateSettings(state);
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
                modalSettings.title = trader.title;
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