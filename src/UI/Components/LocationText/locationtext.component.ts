import {IFeature, IGame, IInterfaceTexts} from 'storyScript/Interfaces/storyScript';
import {SharedMethodService} from '../../Services/SharedMethodService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, inject} from '@angular/core';
import {getTemplate} from '../../helpers';
import {TextFeatures} from "../../Directives/TextFeatures.ts";
import {SharedModule} from "ui/Modules/sharedModule.ts";

@Component({
    standalone: true,
    selector: 'location-text',
    imports: [SharedModule, TextFeatures],
    template: getTemplate('locationtext', await import('./locationtext.component.html?raw'))
})
export class LocationTextComponent {
    private readonly _sharedMethodService: SharedMethodService;

    constructor() {
        this._sharedMethodService = inject(SharedMethodService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.worldProperties = [];

        this.initWorldProperties();
    }

    game: IGame;
    texts: IInterfaceTexts;

    // This array can be used in the template to display translations for world properties.
    worldProperties: { name: string, value: string }[];

    tryCombine = (feature: IFeature): boolean => this._sharedMethodService.tryCombine(feature);

    private readonly initWorldProperties = (): void => {
        for (const n in this.game.worldProperties) {
            if (this.game.worldProperties.hasOwnProperty(n) && this.texts.worldProperties?.hasOwnProperty(n)) {
                const value = this.texts.worldProperties[n];
                this.worldProperties.push({name: n, value: value});
            }
        }
    }
}