import { IInterfaceTexts, CreateCharacters } from '../../../../../Engine/Interfaces/storyScript';
import { ICharacterService } from '../../../../../Engine/Services/interfaces/services';

export class BuildCharacterController implements ng.IComponentController {
    constructor(private _characterService: ICharacterService, _texts: IInterfaceTexts) {
        this.texts = _texts;
    }

    sheet: CreateCharacters.ICreateCharacter;
    texts: IInterfaceTexts;

    limitInput = (event: ng.IAngularEvent, attribute: CreateCharacters.ICreateCharacterAttribute, entry: CreateCharacters.ICreateCharacterAttributeEntry): void => {
        var value = parseInt((<any>event).target.value);
        this._characterService.limitSheetInput(value, attribute, entry);
    }

    distributionDone = (step: CreateCharacters.ICreateCharacterStep): boolean => this._characterService.distributionDone(this.sheet, step);
}

BuildCharacterController.$inject = ['characterService', 'customTexts'];