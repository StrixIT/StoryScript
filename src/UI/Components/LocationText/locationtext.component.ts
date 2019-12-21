import { IGame, IInterfaceTexts, IFeature } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import template from './locationtext.component.html';
import { Component } from '@angular/core';

@Component({
    selector: 'location-text',
    template: template,
})
export class LocationTextComponent {
    constructor(private _sharedMethodService: SharedMethodService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.worldProperties = [];

        this.initWorldProperties();
    }

    game: IGame;
    texts: IInterfaceTexts;
    worldProperties: { name: string, value: string }[];

    tryCombine = (feature: IFeature): boolean => this._sharedMethodService.tryCombine(this.game, feature);

    private initWorldProperties = (): void => {
        for (var n in this.game.worldProperties) {
            if (this.game.worldProperties.hasOwnProperty(n) && this.texts.worldProperties && this.texts.worldProperties.hasOwnProperty(n)) {
                var value = this.texts.worldProperties[n];
                this.worldProperties.push({ name: n, value: value});
            }
        }
    }
}