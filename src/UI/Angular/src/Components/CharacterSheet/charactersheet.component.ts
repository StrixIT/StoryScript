import { IInterfaceTexts, IGame } from '../../../../../Engine/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { CharacterService } from '../../../../../Engine/Services/characterService';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { Component } from '@angular/core';
import template from './charactersheet.component.html';

@Component({
    selector: 'character-sheet',
    template: template,
})
export class CharacterSheetComponent {
    constructor(sharedMethodService: SharedMethodService, characterService: CharacterService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.displayCharacterAttributes = characterService.getSheetAttributes();
        sharedMethodService.useCharacterSheet = true;
    }

    game: IGame;
    texts: IInterfaceTexts;
    displayCharacterAttributes: string[];
}