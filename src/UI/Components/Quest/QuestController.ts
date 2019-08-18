
namespace StoryScript {
    export class QuestController {
        constructor(private _scope: ng.IScope, private _characterService: ICharacterService, private _sharedMethodService: ISharedMethodService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = self._game;
            self.texts = self._texts;
            self._sharedMethodService.useQuests = true;
        }

        game: IGame;
        texts: IInterfaceTexts;

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

    QuestController.$inject = ['$scope', 'characterService', 'sharedMethodService', 'game', 'customTexts'];
}