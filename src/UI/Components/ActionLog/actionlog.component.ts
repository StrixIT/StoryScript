import { IGame, IInterfaceTexts } from 'storyScript/Interfaces/storyScript';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, inject } from '@angular/core';
import { getTemplate } from '../../helpers';
import {CommonModule} from "@angular/common";

@Component({
    standalone: true,
    selector: 'action-log',
    imports: [CommonModule],
    template: getTemplate('actionlog', await import('./actionlog.component.html?raw'))
})
export class ActionLogComponent {
    constructor() {
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;
}