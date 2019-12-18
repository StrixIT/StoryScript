
import { IGame, IInterfaceTexts } from '../../../../Engine/Interfaces/storyScript';
import { GameService } from '../../../../Engine/Services/gameService';
import { ObjectFactory } from '../../../../Engine/ObjectFactory';
import { getUserTemplate } from '../../helpers';
import { Component } from '@angular/core';

var template = require('./intro.component.html').default;
var userTemplate = getUserTemplate('intro');

@Component({
    selector: 'intro',
    template: userTemplate || template
})
export class IntroComponent {
    constructor(private _gameService: GameService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    endIntro = (): void => this._gameService.restart(true);
}