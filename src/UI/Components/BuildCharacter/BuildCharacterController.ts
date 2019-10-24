namespace StoryScript {
    export class BuildCharacterController implements ng.IComponentController {
        constructor(private _characterService: ICharacterService, _texts: IInterfaceTexts) {
            this.texts = _texts;
        }

        sheet: ICreateCharacter;
        texts: IInterfaceTexts;

        limitInput = (event: ng.IAngularEvent, attribute: ICreateCharacterAttribute, entry: ICreateCharacterAttributeEntry): void => {
            var value = parseInt((<any>event).target.value);
            this._characterService.limitSheetInput(value, attribute, entry);
        }

        distributionDone = (step: ICreateCharacterStep): boolean => this._characterService.distributionDone(this.sheet, step);
    }

    BuildCharacterController.$inject = ['characterService', 'customTexts'];
}