import { IGame, IInterfaceTexts } from '../../../../Engine/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from '../../../../Engine/ObjectFactory';
import { Component, ElementRef } from '@angular/core';
import { getUserTemplate } from '../../helpers';

// For some reason, I can't insert the name of the game in the require.context directory string.
var template = require('./main.component.html').default;
var userTemplate = getUserTemplate('main');

@Component({
    selector: 'main',
    template: userTemplate || template
})
export class MainComponent {
    constructor(private hostElement: ElementRef, private _sharedMethodService: SharedMethodService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.watchDynamicStyles();
    }
    
    game: IGame;
    texts: IInterfaceTexts;

    watchDynamicStyles = () => {
        var dynamicStyles = this.game.dynamicStyles || [];

        Object.defineProperty(this.game, 'dynamicStyles', {
            enumerable: true,
            get: () => {
                return dynamicStyles;
            },
            set: value => {
                dynamicStyles = value;
                this.applyDynamicStyling()
            }
        });
    }

    showCharacterPane = (): boolean => this._sharedMethodService.useCharacterSheet || this._sharedMethodService.useEquipment || this._sharedMethodService.useBackpack || this._sharedMethodService.useQuests;

    private applyDynamicStyling = (): void => {
        setTimeout(() => {
            this.game.dynamicStyles.forEach(s => {
                var element = this.hostElement.nativeElement.querySelector(s.elementSelector);

                if (element) {
                    var styleText = '';
                    s.styles.forEach(e => styleText += e[0] + ': ' + e[1] + ';' );
                    element.style.cssText = styleText;
                }

            });
        }, 0, false);
    }
}