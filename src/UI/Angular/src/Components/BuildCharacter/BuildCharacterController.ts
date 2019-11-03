export class BuildCharacterController implements ng.IComponentController {
    constructor(private _characterService: StoryScript.ICharacterService, _texts: StoryScript.IInterfaceTexts) {
        this.texts = _texts;
    }

    sheet: StoryScript.ICreateCharacter;
    texts: StoryScript.IInterfaceTexts;

    limitInput = (event: ng.IAngularEvent, attribute: StoryScript.ICreateCharacterAttribute, entry: StoryScript.ICreateCharacterAttributeEntry): void => {
        var value = parseInt((<any>event).target.value);
        this._characterService.limitSheetInput(value, attribute, entry);
    }

    distributionDone = (step: StoryScript.ICreateCharacterStep): boolean => this._characterService.distributionDone(this.sheet, step);
}

BuildCharacterController.$inject = ['characterService', 'customTexts'];