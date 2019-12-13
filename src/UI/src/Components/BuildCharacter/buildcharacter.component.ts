import { IInterfaceTexts, CreateCharacters } from '../../../../Engine/Interfaces/storyScript';
import { CharacterService } from '../../../../Engine/Services/characterService';
import { ObjectFactory } from '../../../../Engine/ObjectFactory';
import { Component, Input } from '@angular/core';
import template from './buildcharacter.component.html';

@Component({
    selector: 'build-character',
    template: template,
})
export class BuildCharacterComponent {
    @Input() sheet: CreateCharacters.ICreateCharacter;
    
    constructor(private _characterService: CharacterService, objectFactory: ObjectFactory) {
        this.texts = objectFactory.GetTexts();
    }

    texts: IInterfaceTexts;

    limitInput = (event: any, attribute: CreateCharacters.ICreateCharacterAttribute, entry: CreateCharacters.ICreateCharacterAttributeEntry): void => {
        var value = parseInt((<any>event).target.value);
        this._characterService.limitSheetInput(value, attribute, entry);
    }

    distributionDone = (step: CreateCharacters.ICreateCharacterStep): boolean => this._characterService.distributionDone(this.sheet, step);
}