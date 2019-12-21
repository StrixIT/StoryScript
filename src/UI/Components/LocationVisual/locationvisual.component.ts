import { IGame, IInterfaceTexts, IFeature } from 'storyScript/Interfaces/storyScript';
import { compareString } from 'storyScript/globals';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import template from './locationvisual.component.html';
import { Component } from '@angular/core';

@Component({
    selector: 'location-visual',
    template: template,
})
export class LocationVisualComponent {
    constructor(private _sharedMethodService: SharedMethodService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    tryCombine = (feature: IFeature): boolean => this._sharedMethodService.tryCombine(this.game, feature);

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