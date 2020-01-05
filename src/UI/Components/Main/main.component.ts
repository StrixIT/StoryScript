import { IGame, IInterfaceTexts, PlayState } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component, ElementRef } from '@angular/core';
import { getTemplate, watchPlayState, watchDynamicStyles, applyDynamicStyling } from '../../helpers';

@Component({
    selector: 'main',
    template: getTemplate('main', require('./main.component.html'))
})
export class MainComponent {
    constructor(private hostElement: ElementRef, private _sharedMethodService: SharedMethodService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        watchDynamicStyles(this.game, this.hostElement);
        applyDynamicStyling(this.game, this.hostElement);
        watchPlayState(this.game, this.stopAutoplay);
    }
    
    game: IGame;
    texts: IInterfaceTexts;

    showCharacterPane = (): boolean => this._sharedMethodService.useCharacterSheet || this._sharedMethodService.useEquipment || this._sharedMethodService.useBackpack || this._sharedMethodService.useQuests;

    applyDynamicStyle = (selector: string, setting: string, value: string): void => {
        this.game.dynamicStyles = [
            {
                elementSelector: selector,
                styles: [
                    [setting, value]
                ]
            },
        ];
    }

    private stopAutoplay = (game: IGame, newPlayState: PlayState, oldPlayState: PlayState) => {
        // When opening the modal, stop autoplaying elements. When the modal closes, the elements in it are removed
        // and autoplay of the modal stops automatically.
        if (newPlayState !== null) {
            var mediaElements = this.hostElement.nativeElement.querySelectorAll('audio:not(.storyscript-player), video:not(.storyscript-player)');
            mediaElements.forEach((m: HTMLAudioElement) => m.pause());
        }
    }
}