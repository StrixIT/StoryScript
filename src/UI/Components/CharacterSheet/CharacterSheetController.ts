namespace StoryScript {
    export class CharacterSheetController {
        constructor(private _scope: ng.IScope, private _sharedMethodService: ISharedMethodService, private _gameService: IGameService, private _characterService: ICharacterService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = self._game;
            self.texts = self._texts;
            self.displayCharacterAttributes = self._characterService.getSheetAttributes();
        }

        game: IGame;
        texts: IInterfaceTexts;
        displayCharacterAttributes: string[];

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

    CharacterSheetController.$inject = ['$scope', 'sharedMethodService', 'gameService', 'characterService', 'game', 'customTexts'];
}