import { IInterfaceTexts, IGame } from '../../../../../Engine/Interfaces/storyScript';
import { Component } from '@angular/core';
import template from './charactersheet.component.html';
import { CharacterService } from '../../../../../Engine/Services/characterService';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { SharedMethodService } from '../../Services/SharedMethodService';

@Component({
    selector: 'charactersheet',
    template: template,
})
export class CharacterSheetComponent {
    constructor(private _characterService: CharacterService, private _sharedMethodService: SharedMethodService, _objectFactory: ObjectFactory) {
        this.game = _objectFactory.GetGame();
        this.texts = _objectFactory.GetTexts();
        this.displayCharacterAttributes = this._characterService.getSheetAttributes();
        this._sharedMethodService.useCharacterSheet = true;
    }

    game: IGame;
    texts: IInterfaceTexts;
    displayCharacterAttributes: string[];
}