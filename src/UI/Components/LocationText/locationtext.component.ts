import {IFeature, IGame, IInterfaceTexts} from 'storyScript/Interfaces/storyScript';
import {SharedMethodService} from '../../Services/SharedMethodService';
import {ObjectFactory} from 'storyScript/ObjectFactory';
import {Component, inject} from '@angular/core';
import {getTemplate} from '../../helpers';

@Component({
    selector: 'location-text',
    template: getTemplate('locationtext', await import('./locationtext.component.html'))
})
export class LocationTextComponent {
    private _sharedMethodService: SharedMethodService;

    constructor() {
        this._sharedMethodService = inject(SharedMethodService);
        const objectFactory = inject(ObjectFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.worldProperties = [];

        this.initWorldProperties();
    }

    game: IGame;
    texts: IInterfaceTexts;
    worldProperties: { name: string, value: string }[];

    tryCombine = (feature: IFeature): boolean => this._sharedMethodService.tryCombine(feature);

    get log() {
        return this.game.currentLocation.log
    };

    private initWorldProperties = (): void => {
        for (const n in this.game.worldProperties) {
            if (this.game.worldProperties.hasOwnProperty(n) && this.texts.worldProperties?.hasOwnProperty(n)) {
                const value = this.texts.worldProperties[n];
                this.worldProperties.push({name: n, value: value});
            }
        }
    }
}