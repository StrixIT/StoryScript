import { IInterfaceTexts, ICreateCharacterStep, ICreateCharacterAttribute, ICreateCharacterAttributeEntry } from 'storyScript/Interfaces/storyScript';
import type { ICreateCharacter } from 'storyScript/Interfaces/storyScript';
import { CharacterService } from 'storyScript/Services/characterService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component, Input } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'build-character',
    template: getTemplate('buildcharacter', await import('./buildcharacter.component.html'))
})
export class BuildCharacterComponent {
    @Input() sheet: ICreateCharacter;
    
    constructor(private _characterService: CharacterService, objectFactory: ObjectFactory) {
        this.texts = objectFactory.GetTexts();
    }

    texts: IInterfaceTexts;

    limitInput = (event: any, attribute: ICreateCharacterAttribute, entry: ICreateCharacterAttributeEntry): void => {
        var value = parseInt((<any>event).target.value);
        this._characterService.limitSheetInput(value, attribute, entry);
    }

    distributionDone = (step: ICreateCharacterStep): boolean => this._characterService.distributionDone(this.sheet, step);
}