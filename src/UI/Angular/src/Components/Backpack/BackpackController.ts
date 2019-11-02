import StoryScript from '../../../../../types/storyscript'
import { ISharedMethodService } from '../../Services/SharedMethodService';

export class BackpackController {
    constructor(private _sharedMethodService: ISharedMethodService, private _gameService: StoryScript.IGameService, private _characterService: StoryScript.ICharacterService, private _game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.game = this._game;
        this.texts = _texts;
        this._sharedMethodService.useBackpack = true;
    }

    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;

    hasDescription = (type: string, item: { id?: string, description?: string }): boolean => this._gameService.hasDescription(type, item);

    showDescription = (item: any, title: string): void => this._sharedMethodService.showDescription('items', item, title);

    getCombineClass = (item: StoryScript.IItem): string => this._game.combinations.getCombineClass(item);

    tryCombine = (item: StoryScript.IItem): boolean => this._game.combinations.tryCombine(item);

    showEquipment = (): boolean => this._sharedMethodService.showEquipment();

    canEquip = (item: StoryScript.IItem): boolean => this._characterService.canEquip(item);
    
    equipItem = (item: StoryScript.IItem): boolean => this._characterService.equipItem(item);

    useItem = (item: StoryScript.IItem): void => this._gameService.useItem(item);

    canDropItems = (): boolean => this._sharedMethodService.useGround;

    dropItem = (item: StoryScript.IItem): void => this._characterService.dropItem(item);
}

BackpackController.$inject = ['sharedMethodService', 'gameService', 'characterService', 'game', 'customTexts'];