
namespace StoryScript {
    export class QuestController {
        constructor(private _characterService: ICharacterService, private _sharedMethodService: ISharedMethodService, private _game: IGame, _texts: IInterfaceTexts) {
            this.game = _game;
            this.texts = _texts;
            this._sharedMethodService.useQuests = true;
        }

        game: IGame;
        texts: IInterfaceTexts;

        showQuests = (): boolean => this._game.character && !isEmpty(this._game.character.quests);

        showActiveQuests = (): boolean => this._game.character.quests.filter(q => !q.completed).length > 0;

        showCompletedQuests = (): boolean => this._game.character.quests.filter(q => q.completed).length > 0;

        questStatus = (quest: IQuest): string => this._characterService.questStatus(quest);
    }

    QuestController.$inject = ['characterService', 'sharedMethodService', 'game', 'customTexts'];
}