namespace StoryScript {
    export class BackpackController {
        constructor(private _sharedMethodService: ISharedMethodService, private _gameService: IGameService, private _characterService: ICharacterService, private _game: IGame, _texts: IInterfaceTexts) {
            this.game = this._game;
            this.texts = _texts;
            this._sharedMethodService.useBackpack = true;
        }

        game: IGame;
        texts: IInterfaceTexts;

        hasDescription = (type: string, item: { id?: string, description?: string }): boolean => this._gameService.hasDescription(type, item);

        showDescription = (item: any, title: string): void => this._sharedMethodService.showDescription('items', item, title);

        getCombineClass = (item: IItem): string => this._game.combinations.getCombineClass(item);

        tryCombine = (item: IItem): boolean => this._game.combinations.tryCombine(item);

        showEquipment = (): boolean => this._sharedMethodService.showEquipment();

        canEquip = (item: IItem): boolean => this._characterService.canEquip(item);
        
        equipItem = (item: IItem): boolean => this._characterService.equipItem(item);

        useItem = (item: IItem): void => this._gameService.useItem(item);

        canDropItems = (): boolean => this._sharedMethodService.useGround;

        dropItem = (item: IItem): void => this._characterService.dropItem(item);
    }

    BackpackController.$inject = ['sharedMethodService', 'gameService', 'characterService', 'game', 'customTexts'];
}