import { IGame, IInterfaceTexts, Enumerations } from '../../../../../Engine/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { GameService } from '../../../../../Engine/Services/gameService';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import template from './encountermodal.component.html';

export interface IModalSettings {
    title: string;
    closeText?: string;
    canClose?: boolean;
    closeAction?: (game: IGame) => void;
    description: string;
}

@Component({
    selector: 'encounter-modal',
    template: template,
})
export class EncounterModalComponent implements OnDestroy {
    constructor(private _sharedMethodService: SharedMethodService, private _gameService: GameService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();

        this.modalSettings = <IModalSettings>{
            title: '',
            canClose: false,
            closeText: this.texts.closeModal
        }

        this._playStateSubscription = this._sharedMethodService.playStateChange$.subscribe(p =>this.watchPlayState(p));
        this._enemiesPresentSubscription = this._sharedMethodService.enemiesPresentChange$.subscribe(p => this.initCombat(p));
        this._descriptionSubscription = this._sharedMethodService.descriptionChange$.subscribe(p => this.showDescription(p));
    }

    private _playStateSubscription: Subscription;
    private _enemiesPresentSubscription: Subscription;
    private _descriptionSubscription: Subscription;

    modalSettings: IModalSettings;
    game: IGame;
    texts: IInterfaceTexts;

    ngOnDestroy(): void {
        this._playStateSubscription.unsubscribe();
        this._enemiesPresentSubscription.unsubscribe();
        this._descriptionSubscription.unsubscribe();
    }

    openModal = (modalSettings: any): void => {
        this.modalSettings = modalSettings;
        $('#encounters').modal('show');
    }

    closeModal = (): void => {
        if (this.modalSettings.closeAction) {
            this.modalSettings.closeAction(this.game);
        }

        this._gameService.saveGame();
        this._sharedMethodService.setPlayState(this.game, null);
    }

    private showDescription = (newValue: string): void => {
        if (newValue) {
            this.game.playState = Enumerations.PlayState.Description;
            this.modalSettings.title = this.game.currentDescription.title;
            this.modalSettings.description = this.game.currentDescription.item.description;
            this._sharedMethodService.setPlayState(this.game, Enumerations.PlayState.Description);
        }
    }

    private watchPlayState = (newValue: Enumerations.PlayState): void => {
        if (newValue !== Enumerations.PlayState.Menu) {          
            this.getStateSettings(newValue);
            this.switchState(newValue);
        }
    }

    private getStateSettings = (newValue: Enumerations.PlayState): void => {
        switch (newValue) {
            case Enumerations.PlayState.Combat: {
                this.modalSettings.title = this.texts.combatTitle;
                this.modalSettings.canClose = false;
            } break;
            case Enumerations.PlayState.Conversation: {
                var person = this.game.person;
                this.modalSettings.title = person.conversation.title || this.texts.format(this.texts.talk, [person.name]);
                this.modalSettings.canClose = true;
            } break;
            case Enumerations.PlayState.Trade: {
                var trader = this.game.trade;
                this.modalSettings.title = trader.title;
                this.modalSettings.canClose = true;
            } break;
            case Enumerations.PlayState.Description: {
                this.modalSettings.canClose = true;
            } break;
            default: {
            } break;
        }
    }

    private switchState = (newValue: Enumerations.PlayState): void => {
        if (newValue === null || newValue === undefined) {
            $('#encounters').modal('hide');
        }        
        else {
            $('#encounters').modal('show');
        }
    }

    private initCombat = (newValue: boolean): void => {
        if (newValue) {
            this._gameService.initCombat();
        }
        else {
            this.modalSettings.canClose = true;
        }
    }
}