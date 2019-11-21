import { IGame, IInterfaceTexts } from '../../../../../Engine/Interfaces/storyScript';
import { GameService } from '../../../../../Engine/Services/gameService';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { Component } from '@angular/core';
import template from './main.component.html';
import * as angular from 'angular';

@Component({
    selector: 'main',
    template: template,
})
export class MainComponent {
    constructor(private _gameService: GameService, private _sharedMethodService: SharedMethodService, _objectFactory: ObjectFactory) {
        this.game = _objectFactory.GetGame();
        this.texts = _objectFactory.GetTexts();

        // TODO: fix this.
        // Watch for dynamic styling.
        this.game.dynamicStyles = this.game.dynamicStyles || [];
        //this._scope.$watchCollection('game.dynamicStyles', () => this.applyDynamicStyling());

        this._gameService.init();
    }
    
    game: IGame;
    texts: IInterfaceTexts;

    showCharacterPane = (): boolean => this._sharedMethodService.useCharacterSheet || this._sharedMethodService.useEquipment || this._sharedMethodService.useBackpack || this._sharedMethodService.useQuests;

    private applyDynamicStyling = (): void => {
        setTimeout(() => {
            this.game.dynamicStyles.forEach(s => {
                var element = angular.element(s.elementSelector);

                if (element.length) {
                    var styleText = '';
                    s.styles.forEach(e => styleText += e[0] + ': ' + e[1] + ';' );
                    element.attr('style', styleText);
                }

            });
        }, 0, false);
    }
}