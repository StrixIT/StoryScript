import { IGame, IInterfaceTexts, IQuest, ICollection } from 'storyScript/Interfaces/storyScript';
import { isEmpty } from 'storyScript/utilities';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'quests',
    template: getTemplate('quest', require('./quest.component.html'))
})
export class QuestComponent {
    constructor(private _characterService: CharacterService, sharedMethodService: SharedMethodService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        sharedMethodService.useQuests = true;
    }

    game: IGame;
    texts: IInterfaceTexts;

    showQuests = (): boolean => this.game.character && !isEmpty(this.game.character.quests);

    showActiveQuests = (): boolean => this.game.character.quests.filter(q => !q.completed).length > 0;

    showCompletedQuests = (): boolean => this.game.character.quests.filter(q => q.completed).length > 0;

    currentQuests = (): ICollection<IQuest> => this.game.character.quests.filter(q => q.completed === false);

    completedQuests = (): ICollection<IQuest> => this.game.character.quests.filter(q => q.completed === true);

    questStatus = (quest: IQuest): string => this._characterService.questStatus(quest);
}