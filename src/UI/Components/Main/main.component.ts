import { IGame, IInterfaceTexts, PlayState } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component, ElementRef } from '@angular/core';
import { getTemplate, watchPlayState } from '../../helpers';

@Component({
    selector: 'main',
    template: getTemplate('main', require('./main.component.html'))
})
export class MainComponent {
    constructor(private hostElement: ElementRef, private _sharedMethodService: SharedMethodService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.watchDynamicStyles();
        this.applyDynamicStyling();
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

    private watchDynamicStyles = () => {
        var dynamicStyles = this.game.dynamicStyles || [];

        Object.defineProperty(this.game, 'dynamicStyles', {
            enumerable: true,
            get: () => {
                return dynamicStyles;
            },
            set: value => {
                dynamicStyles = value;
                this.applyDynamicStyling();
            }
        });
    }

    private applyDynamicStyling = (): void => {
        setTimeout(() => {
            this.game.dynamicStyles.forEach(s => {
                var elements = this.hostElement.nativeElement.querySelectorAll(s.elementSelector);

                elements.forEach((e: HTMLElement) => {
                    var styleText = '';
                    s.styles.forEach(e => styleText += e[0] + ': ' + e[1] + ';' );
                    e.style.cssText = styleText;
                });

            });
        }, 0, false);
    }

    private stopAutoplay = (newPlayState: PlayState, oldPlayState: PlayState) => {
        // When opening the modal, stop autoplaying elements. When the modal closes, the elements in it are removed
        // and autoplay of the modal stops automatically.
        if (newPlayState !== null) {
            var mediaElements = this.hostElement.nativeElement.querySelectorAll('audio:not(.storyscript-player), video:not(.storyscript-player)');
            mediaElements.forEach((m: HTMLAudioElement) => m.pause());
        }
    }
}