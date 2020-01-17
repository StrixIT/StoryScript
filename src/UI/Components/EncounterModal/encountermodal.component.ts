import { Component, Input, ElementRef } from '@angular/core';
import { IGame, IInterfaceTexts } from 'storyScript/Interfaces/storyScript';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { IModalSettings } from '../modalSettings';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'encounter-modal',
    template: getTemplate('encountermodal', require('./encountermodal.component.html'))
})
export class EncounterModalComponent {
    @Input() settings: IModalSettings;

    constructor(private hostElement: ElementRef, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.element = hostElement.nativeElement;

        this.settings = {
            title: '',
            canClose: false,
            closeText: this.texts.closeModal
        }
    }

    element: HTMLElement;
    game: IGame;
    texts: IInterfaceTexts;

    canClose = (): boolean => this.settings.canClose = this.game.currentLocation?.activeEnemies?.length === 0 || this.settings.description !== undefined;

    closeModal = (): void => {
        this.game.playState = null;
    }
}