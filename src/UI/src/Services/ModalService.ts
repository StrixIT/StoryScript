import { Injectable, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ObjectFactory } from '../../../Engine/ObjectFactory';
import { IInterfaceTexts, Enumerations, IGame } from '../../../Engine/Interfaces/storyScript';
import { MenuModalComponent } from '../Components/MenuModal/menumodal.component';
import { EncounterModalComponent } from '../Components/EncounterModal/encountermodal.component';
import { IModalSettings } from '../Components/modalSettings';
import { EventService } from './EventService';

@Injectable()
export class ModalService implements OnDestroy {

    constructor(private _modalService: NgbModal, private _eventService: EventService , objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();

        this._playStateSubscription = this._eventService.playStateChange$.subscribe((p: Enumerations.PlayState) => this.openModal(p));
    }

    private _playStateSubscription: Subscription;

    private game: IGame;
    private texts: IInterfaceTexts;

    ngOnDestroy(): void {
        this._playStateSubscription.unsubscribe();
    }

    openModal = (state: Enumerations.PlayState): void => {
        if (state === Enumerations.PlayState.Menu) {
            this._modalService.open(MenuModalComponent);
        }
        else if (state) {
            var modal = this._modalService.open(EncounterModalComponent);
            modal.componentInstance.settings = this.getStateSettings(state);
        }    
    }

    private getStateSettings = (value: Enumerations.PlayState): IModalSettings => {
        var modalSettings: IModalSettings = {
            title: '',
            closeText: this.texts.closeModal
        };

        switch (value) {
            case Enumerations.PlayState.Combat: {
                modalSettings.title = this.texts.combatTitle;
                modalSettings.canClose = false;
            } break;
            case Enumerations.PlayState.Conversation: {
                var person = this.game.person;
                modalSettings.title = person.conversation.title || this.texts.format(this.texts.talk, [person.name]);
                modalSettings.canClose = true;
            } break;
            case Enumerations.PlayState.Trade: {
                var trader = this.game.trade;
                modalSettings.title = trader.title;
                modalSettings.canClose = true;
            } break;
            case Enumerations.PlayState.Description: {
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