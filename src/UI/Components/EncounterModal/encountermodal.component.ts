import { Component, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { IGame, IInterfaceTexts, PlayState } from 'storyScript/Interfaces/storyScript';
import { GameService } from 'storyScript/Services/gameService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { EventService } from '../../Services/EventService';
import { IModalSettings } from '../modalSettings';
import template from './encountermodal.component.html';

@Component({
    selector: 'encounter-modal',
    template: template,
})
export class EncounterModalComponent implements OnDestroy {
    @Input() settings: IModalSettings;

    constructor(private _activeModal: NgbActiveModal, private _eventService: EventService, private _gameService: GameService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();

        this.settings = {
            title: '',
            canClose: false,
            closeText: this.texts.closeModal
        }

        this._playStateSubscription = this._eventService.playStateChange$.subscribe((p: PlayState) => this.closeModal(p));
        this._enemiesPresentSubscription = this._eventService.enemiesPresentChange$.subscribe((p: boolean) => this.settings.canClose = !p);
    }

    private _playStateSubscription: Subscription;
    private _enemiesPresentSubscription: Subscription;

    game: IGame;
    texts: IInterfaceTexts;

    ngOnDestroy(): void {
        this,this._playStateSubscription.unsubscribe();
        this._enemiesPresentSubscription.unsubscribe();
    }

    closeModal = (playState: PlayState): void => {
        if (!playState) {
            if (this.settings.closeAction) {
                this.settings.closeAction(this.game);
            }

            this.game.playState = null;
        }

        if (!playState || playState == null) {
            this._gameService.saveGame();
            this._activeModal.close();
        }
    }
}