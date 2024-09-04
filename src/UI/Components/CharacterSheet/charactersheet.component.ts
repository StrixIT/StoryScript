import {
    IInterfaceTexts,
    IGame,
    ICharacter,
    ICreateCharacterAttribute,
    ICreateCharacterAttributeEntry
} from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, Input, inject } from '@angular/core';
import { getTemplate } from '../../helpers';
import { IParty } from '../../../Games/MyAdventureGame/types';

@Component({
    selector: 'character-sheet',
    template: getTemplate('charactersheet', await import('./charactersheet.component.html?raw'))
})
export class CharacterSheetComponent { 
    @Input() character!: ICharacter;

    constructor() {
        const characterService = inject(CharacterService);
        const sharedMethodService = inject(SharedMethodService);
        const objectFactory = inject(ServiceFactory);
        this.isDevelopment = process.env.NODE_ENV !== 'production';
        this.party = objectFactory.GetGame().party;
        this.texts = objectFactory.GetTexts();
        this.displayCharacterAttributes = characterService.getSheetAttributes();
        sharedMethodService.useCharacterSheet = true;
    }

    isDevelopment: boolean;
    party: IParty;
    texts: IInterfaceTexts;
    displayCharacterAttributes: string[];

    limitInput = (event: any, character: ICharacter): void => {
        if (character.currentHitpoints > character.hitpoints) {
            character.currentHitpoints = character.hitpoints;
        }
        else if (character.currentHitpoints <= 0) {
            character.currentHitpoints = 1;
        }
    }
}