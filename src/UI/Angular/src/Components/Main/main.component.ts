import { IGame, IInterfaceTexts } from '../../../../../Engine/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { Component } from '@angular/core';
import template from './main.component.html';

@Component({
    selector: 'main',
    template: template,
})
export class MainComponent {
    constructor(private _sharedMethodService: SharedMethodService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();

        // TODO: fix this.
        // Watch for dynamic styling.
        this.game.dynamicStyles = this.game.dynamicStyles || [];
        //this._scope.$watchCollection('game.dynamicStyles', () => this.applyDynamicStyling());
    }
    
    game: IGame;
    texts: IInterfaceTexts;

    showCharacterPane = (): boolean => this._sharedMethodService.useCharacterSheet || this._sharedMethodService.useEquipment || this._sharedMethodService.useBackpack || this._sharedMethodService.useQuests;

    private applyDynamicStyling = (): void => {
        setTimeout(() => {
            this.game.dynamicStyles.forEach(s => {
                var element = null;//;angular.element(s.elementSelector);

                if (element.length) {
                    var styleText = '';
                    s.styles.forEach(e => styleText += e[0] + ': ' + e[1] + ';' );
                    element.attr('style', styleText);
                }

            });
        }, 0, false);
    }
}