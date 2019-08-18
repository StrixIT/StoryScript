namespace StoryScript {
    export class EquipmentController {
        constructor(private _scope: ng.IScope, private _sharedMethodService: ISharedMethodService, private _characterService: ICharacterService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = self._game;
            self.texts = self._texts;
            self._sharedMethodService.useEquipment = true;
        }

        game: IGame;
        texts: IInterfaceTexts;

        showEquipment = (): boolean => {
            var self = this;
            return self._sharedMethodService.showEquipment();
        }

        unequipItem = (item: IItem): void => {
            var self = this;
            self._characterService.unequipItem(item);
        }

        isSlotUsed = (slot: string): boolean => {
            var self = this;
            return self._characterService.isSlotUsed(slot);
        }
    }

    EquipmentController.$inject = ['$scope', 'sharedMethodService', 'characterService', 'game', 'customTexts'];
}