import { IInterfaceTexts, ICreateCharacterStep, ICreateCharacterAttribute, ICreateCharacterAttributeEntry } from 'storyScript/Interfaces/storyScript';
import type { ICreateCharacter } from 'storyScript/Interfaces/storyScript';
import { CharacterService } from 'storyScript/Services/characterService';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, Input, inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'build-character',
    template: getTemplate('buildcharacter', await import('./buildcharacter.component.html?raw'))
})
export class BuildCharacterComponent {
    @Input() sheet: ICreateCharacter;
    
    private _characterService: CharacterService;

    constructor() {
        this._characterService = inject(CharacterService);
        const objectFactory = inject(ServiceFactory);
        this.texts = objectFactory.GetTexts();
    }

    texts: IInterfaceTexts;

    limitInput = (event: any, attribute: ICreateCharacterAttribute, entry: ICreateCharacterAttributeEntry): void => {
        var value = parseInt((<any>event).target.value);
        this._characterService.limitSheetInput(value, attribute, entry);
    }

    distributionDone = (step: ICreateCharacterStep): boolean => this._characterService.distributionDone(this.sheet, step);
}