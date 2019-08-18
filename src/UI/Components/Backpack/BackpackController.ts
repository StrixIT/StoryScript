namespace StoryScript {
    export class BackpackController {
        constructor(private _scope: ng.IScope, private _sharedMethodService: ISharedMethodService, private _gameService: IGameService, private _characterService: ICharacterService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = self._game;
            self.texts = self._texts;
            self._sharedMethodService.useBackpack = true;
        }

        game: IGame;
        texts: IInterfaceTexts;

        hasDescription(type: string, item: { id?: string, description?: string }) {
            var self = this;
            return self._gameService.hasDescription(type, item);
        }

        showDescription(item: any, title: string) {
            var self = this;
            self._sharedMethodService.showDescription(self._scope, 'items', item, title);
        }

        getCombineClass = (item: IItem) => {
            var self = this;
            return self._game.combinations.getCombineClass(item);
        }

        tryCombine = (item: IItem) => {
            var self = this;
            self._game.combinations.tryCombine(item);
        }

        showEquipment = (): boolean => {
            var self = this;
            return self._sharedMethodService.showEquipment();
        }

        canEquip = (item: IItem): boolean => {
            var self = this;
            return self._characterService.canEquip(item);
        }

        equipItem = (item: IItem): void => {
            var self = this;
            self._characterService.equipItem(item);
        }

        useItem = (item: IItem): void => {
            var self = this;
            self._gameService.useItem(item);
        }

        canDropItems = (): boolean => {
            var self = this;
            return self._sharedMethodService.useGround;
        }

        dropItem = (item: IItem): void => {
            var self = this;
            self._characterService.dropItem(item);
        }
    }

    BackpackController.$inject = ['$scope', 'sharedMethodService', 'gameService', 'characterService', 'game', 'customTexts'];
}