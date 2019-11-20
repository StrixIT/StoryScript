import { IGame, IInterfaceTexts, IFeature } from '../../../../../Engine/Interfaces/storyScript';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import template from './location.component.html';
import { Component } from '@angular/core';

@Component({
    selector: 'location',
    template: template,
})
export class LocationComponent {
    constructor(private _objectFactory: ObjectFactory) {
        this.game = _objectFactory.GetGame();
        this.texts = _objectFactory.GetTexts();
        this.worldProperties = [];

        this.initWorldProperties();
    }

    game: IGame;
    texts: IInterfaceTexts;
    worldProperties: { name: string, value: string }[];

    getCombineClass = (feature: IFeature): string => this.game.combinations.getCombineClass(feature);

    tryCombine = (feature: IFeature): boolean => this.game.combinations.tryCombine(feature);

    private initWorldProperties = (): void => {
        for (var n in this.game.worldProperties) {
            if (this.game.worldProperties.hasOwnProperty(n) && this.texts.worldProperties && this.texts.worldProperties.hasOwnProperty(n)) {
                var value = this.texts.worldProperties[n];
                this.worldProperties.push({ name: n, value: value});
            }
        }
    }
}