import { IGame, IInterfaceTexts, IFeature } from '../../../../../Engine/Interfaces/storyScript';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import template from './location.component.html';
import { Component } from '@angular/core';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { compareString } from '../../../../../Engine/globals';

@Component({
    selector: 'location',
    template: template,
})
export class LocationComponent {
    constructor(private _sharedMethodService: SharedMethodService, _objectFactory: ObjectFactory) {
        this.game = _objectFactory.GetGame();
        this.texts = _objectFactory.GetTexts();
        this.worldProperties = [];

        this.initWorldProperties();
    }

    game: IGame;
    texts: IInterfaceTexts;
    worldProperties: { name: string, value: string }[];

    getCombineClass = (feature: IFeature): string => this.game.combinations.getCombineClass(feature);

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

    private initWorldProperties = (): void => {
        for (var n in this.game.worldProperties) {
            if (this.game.worldProperties.hasOwnProperty(n) && this.texts.worldProperties && this.texts.worldProperties.hasOwnProperty(n)) {
                var value = this.texts.worldProperties[n];
                this.worldProperties.push({ name: n, value: value});
            }
        }
    }
}