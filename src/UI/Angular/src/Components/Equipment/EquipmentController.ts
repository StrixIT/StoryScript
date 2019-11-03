import { ISharedMethodService } from '../../Services/SharedMethodService';

export class EquipmentController {
    constructor(private _sharedMethodService: ISharedMethodService, private _characterService: StoryScript.ICharacterService, _game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
        this._sharedMethodService.useEquipment = true;
    }

    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;

    showEquipment = (): boolean => this._sharedMethodService.showEquipment();

    unequipItem = (item: StoryScript.IItem): boolean => this._characterService.unequipItem(item);

    isSlotUsed = (slot: string): boolean => this._characterService.isSlotUsed(slot);
}

EquipmentController.$inject = ['sharedMethodService', 'characterService', 'game', 'customTexts'];