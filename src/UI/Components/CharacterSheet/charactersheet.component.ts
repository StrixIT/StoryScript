import { IInterfaceTexts, IGame, ICharacter } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, Input, inject } from '@angular/core';
import { getTemplate } from '../../helpers';
import { IParty } from '../../../Games/MyAdventureGame/types';

@Component({
    selector: 'character-sheet',
    template: getTemplate('charactersheet', await import('./charactersheet.component.html'))
})
export class CharacterSheetComponent { 
    @Input() character!: ICharacter;

    constructor() {
        const characterService = inject(CharacterService);
        const sharedMethodService = inject(SharedMethodService);
        const objectFactory = inject(ServiceFactory);
        this.party = objectFactory.GetGame().party;
        this.texts = objectFactory.GetTexts();
        this.displayCharacterAttributes = characterService.getSheetAttributes();
        sharedMethodService.useCharacterSheet = true;
    }

    party: IParty;
    texts: IInterfaceTexts;
    displayCharacterAttributes: string[];
}