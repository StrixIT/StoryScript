import { IGame, IInterfaceTexts, IFeature } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, inject } from '@angular/core';
import { getTemplate } from '../../helpers';
import {compareString} from "storyScript/utilityFunctions.ts";
import {CommonModule} from "@angular/common";
import {SafePipe} from "../../Pipes/sanitizationPipe.ts";

@Component({
    standalone: true,
    selector: 'location-visual',
    imports: [CommonModule, SafePipe],
    template: getTemplate('locationvisual', await import('./locationvisual.component.html?raw'))
})
export class LocationVisualComponent {
    private readonly _sharedMethodService: SharedMethodService;
    
    constructor() {
        this._sharedMethodService = inject(SharedMethodService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    tryCombine = (feature: IFeature): boolean => this._sharedMethodService.tryCombine(feature);

    getFeatureCoordinates = (feature: IFeature): { top: string, left: string} => {
        const coords = feature.coords.split(',');
        let top = null, left = null;

        if (compareString(feature.shape, 'poly')) {
            const x = [], y = [];

            for (let i = 0; i < coords.length; i++) {
                const value = coords[i];
                if (i % 2 === 0) {
                    x.push(value);
                }
                else {
                    y.push(value);
                }
            }

            left = x.reduce(function (p, v) {
                return (p < v ? p : v);
            });
            
            top = y.reduce(function (p, v) {
                return (p < v ? p : v);
            });
        }
        else {
            left = coords[0];
            top = coords[1];
        }

        return { 
            top: `${top}px`,
            left: `${left}px` 
        };
    }
}