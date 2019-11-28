import { IGame, IInterfaceTexts } from '../../../../../Engine/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { Component } from '@angular/core';

// For some reason, I can't insert the name of the game in the require.context directory string.
var template = require('./main.component.html').default;
var userTemplate = null;
var r = require.context('../../../../../Games/_TestGame/ui/components', false, /main.component.html$/);

if (r.keys().length) {
    userTemplate = r(r.keys()[0]).default;
}

@Component({
    selector: 'main',
    template: userTemplate || template,
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