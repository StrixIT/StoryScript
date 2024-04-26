import { IInterfaceTexts, IGame, ICharacter } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component, Input, inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'character-sheet',
    template: getTemplate('charactersheet', await import('./charactersheet.component.html'))
})
export class CharacterSheetComponent { 
    @Input() character!: ICharacter;

    constructor() {
        const characterService = inject(CharacterService);
        const sharedMethodService = inject(SharedMethodService);
        const objectFactory = inject(ObjectFactory);
        this.texts = objectFactory.GetTexts();
        this.displayCharacterAttributes = characterService.getSheetAttributes();
        sharedMethodService.useCharacterSheet = true;
    }

    texts: IInterfaceTexts;
    displayCharacterAttributes: string[];
}