import { IInterfaceTexts, IGame } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component, Inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'character-sheet',
    template: getTemplate('charactersheet', await import('./charactersheet.component.html'))
})
export class CharacterSheetComponent {
    constructor(
        @Inject (SharedMethodService) sharedMethodService: SharedMethodService, 
        @Inject (CharacterService) characterService: CharacterService, 
        @Inject (ObjectFactory) objectFactory: ObjectFactory
    ) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.displayCharacterAttributes = characterService.getSheetAttributes();
        sharedMethodService.useCharacterSheet = true;
    }

    game: IGame;
    texts: IInterfaceTexts;
    displayCharacterAttributes: string[];
}