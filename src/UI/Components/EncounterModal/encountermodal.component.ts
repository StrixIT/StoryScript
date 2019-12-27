import { Component, Input } from '@angular/core';
import { IGame, IInterfaceTexts } from 'storyScript/Interfaces/storyScript';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { IModalSettings } from '../modalSettings';
import template from './encountermodal.component.html';

@Component({
    selector: 'encounter-modal',
    template: template,
})
export class EncounterModalComponent {
    @Input() settings: IModalSettings;

    constructor(objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();

        this.settings = {
            title: '',
            canClose: false,
            closeText: this.texts.closeModal
        }
    }

    game: IGame;
    texts: IInterfaceTexts;

    canClose = (): boolean => this.settings.canClose = this.game.currentLocation?.activeEnemies?.length === 0 || this.settings.description !== undefined;

    closeModal = (): void => {
        this.game.playState = null;
    }
}