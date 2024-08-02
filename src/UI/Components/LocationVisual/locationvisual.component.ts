import { IGame, IInterfaceTexts, IFeature } from 'storyScript/Interfaces/storyScript';
import { compareString } from 'storyScript/globalFunctions';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'location-visual',
    template: getTemplate('locationvisual', await import('./locationvisual.component.html'))
})
export class LocationVisualComponent {
    private _sharedMethodService: SharedMethodService;
    
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
        var coords = feature.coords.split(',');
        var top = null, left = null;

        if (compareString(feature.shape, 'poly')) {
            var x = [], y = [];

            for (var i = 0; i < coords.length; i++) {
                var value = coords[i];
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