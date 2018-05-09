namespace StoryScript {
    export class CharacterSheetController {
        constructor(private _scope: ng.IScope, private _gameService: IGameService, private _characterService: ICharacterService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = self._game;
            self.texts = self._texts;
            self.displayCharacterAttributes = self._characterService.getSheetAttributes();
        }

        game: IGame;
        texts: IInterfaceTexts;
        displayCharacterAttributes: string[];

        canEquip = (item: IItem): boolean => {
            var self = this;
            return self._characterService.canEquip(item);
        }

        equipItem = (item: IItem): void => {
            var self = this;
            self._characterService.equipItem(item);
        }

        unequipItem = (item: IItem): void => {
            var self = this;
            self._characterService.unequipItem(item);
        }

        isSlotUsed = (slot: string): boolean => {
            var self = this;
            return self._characterService.isSlotUsed(slot);
        }

        useItem = (item: IItem): void => {
            var self = this;
            self._gameService.useItem(item);
        }

        dropItem = (item: IItem): void => {
            var self = this;
            self._characterService.dropItem(item);
            self._scope.$emit('refreshCombine');
        }

        showQuests = (): boolean => {
            var self = this;
            return self._game.character && !isEmpty(self._game.character.quests);
        }

        showActiveQuests = (): boolean => {
            var self = this;
            return self._game.character.quests.filter(q => !q.completed).length > 0;
        }

        showCompletedQuests = (): boolean => {
            var self = this;
            return self._game.character.quests.filter(q => q.completed).length > 0;
        }

        questStatus = (quest: IQuest): string => {
            var self = this;
            return self._characterService.questStatus(quest);
        }
    }

    CharacterSheetController.$inject = ['$scope', 'gameService', 'characterService', 'game', 'customTexts'];
}