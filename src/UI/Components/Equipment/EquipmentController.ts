namespace StoryScript {
    export class EquipmentController {
        constructor(private _sharedMethodService: ISharedMethodService, private _characterService: ICharacterService, _game: IGame, _texts: IInterfaceTexts) {
            this.game = _game;
            this.texts = _texts;
            this._sharedMethodService.useEquipment = true;
        }

        game: IGame;
        texts: IInterfaceTexts;

        showEquipment = (): boolean => this._sharedMethodService.showEquipment();

        unequipItem = (item: IItem): boolean => this._characterService.unequipItem(item);

        isSlotUsed = (slot: string): boolean => this._characterService.isSlotUsed(slot);
    }

    EquipmentController.$inject = ['sharedMethodService', 'characterService', 'game', 'customTexts'];
}