namespace StoryScript {
    export class BuildCharacterController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _characterService: ICharacterService, private _texts: IInterfaceTexts) {
            var self = this;
            self.texts = _texts;
        }

        sheet: ICreateCharacter;
        texts: IInterfaceTexts;

        limitInput = (event: ng.IAngularEvent, attribute: ICreateCharacterAttribute, entry: ICreateCharacterAttributeEntry) => {
            var self = this;
            var value = parseInt((<any>event).target.value);
            self._characterService.limitSheetInput(value, attribute, entry);
        }

        distributionDone = (step: ICreateCharacterStep) => {
            var self = this;
            return self._characterService.distributionDone(self.sheet, step);
        }
    }

    BuildCharacterController.$inject = ['$scope', 'characterService', 'customTexts'];
}