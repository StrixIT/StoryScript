import StoryScript from '../../../compiled/storyscript.js'
import { ISharedMethodService } from '../../Services/SharedMethodService';

export class QuestController {
    constructor(private _characterService: StoryScript.ICharacterService, private _sharedMethodService: ISharedMethodService, private _game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
        this._sharedMethodService.useQuests = true;
    }

    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;

    showQuests = (): boolean => this._game.character && !StoryScript.isEmpty(this._game.character.quests);

    showActiveQuests = (): boolean => this._game.character.quests.filter(q => !q.completed).length > 0;

    showCompletedQuests = (): boolean => this._game.character.quests.filter(q => q.completed).length > 0;

    questStatus = (quest: StoryScript.IQuest): string => this._characterService.questStatus(quest);
}

QuestController.$inject = ['characterService', 'sharedMethodService', 'game', 'customTexts'];