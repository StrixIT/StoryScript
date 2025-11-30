import {Component, ElementRef, inject, Input} from '@angular/core';
import {IGame, IInterfaceTexts} from 'storyScript/Interfaces/storyScript';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import type {IModalSettings} from '../modalSettings';
import {getTemplate} from '../../helpers';
import {CombatComponent} from "../Combat/combat.component.ts";
import {TradeComponent} from "../Trade/trade.component.ts";
import {ConversationComponent} from "../Conversation/conversation.component.ts";
import {EncounterComponent} from "ui/Components/Encounter/encounter.component.ts";
import {EnemyComponent} from "ui/Components/Enemy/enemy.component.ts";
import {SharedModule} from "ui/Modules/sharedModule.ts";

@Component({
    standalone: true,
    selector: 'encounter-modal',
    imports: [SharedModule, ConversationComponent, TradeComponent, CombatComponent, EncounterComponent, EnemyComponent],
    template: getTemplate('encountermodal', await import('./encountermodal.component.html?raw'))
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

    closeModal = (): void => this.game.playState = null;
}