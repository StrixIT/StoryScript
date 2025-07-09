import {IGame, IInterfaceTexts, IMap} from 'storyScript/Interfaces/storyScript';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, inject } from '@angular/core';
import { getTemplate } from '../../helpers';
import {CommonModule} from "@angular/common";
import {SafePipe} from "../../Pipes/sanitizationPipe.ts";

@Component({
    standalone: true,
    selector: 'location-map',
    imports: [CommonModule, SafePipe],
    template: getTemplate('map', await import('./locationmap.component.html?raw'))
})
export class LocationMapComponent {
    constructor() {
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }
    
    game: IGame;
    texts: IInterfaceTexts;
    map: IMap;
}