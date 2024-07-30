import { Component, Input, ElementRef, inject } from '@angular/core';
import { IGame, IInterfaceTexts } from 'storyScript/Interfaces/storyScript';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import type { IModalSettings } from '../modalSettings';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'encounter-modal',
    template: getTemplate('encountermodal', await import('./encountermodal.component.html'))
})
export class EncounterModalComponent {
    @Input() settings: IModalSettings;

    constructor() {
        const hostElement = inject(ElementRef);
        const objectFactory = inject(ServiceFactory);
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