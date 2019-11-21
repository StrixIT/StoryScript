import { IGame, IInterfaceTexts, IQuest, ICollection } from '../../../../../Engine/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { isEmpty } from '../../../../../Engine/utilities';
import { CharacterService } from '../../../../../Engine/Services/characterService';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';

import { Component } from '@angular/core';
import template from './quest.component.html';

@Component({
    selector: 'quests',
    template: template,
})
export class QuestComponent {
    constructor(private _characterService: CharacterService, private _sharedMethodService: SharedMethodService, _objectFactory: ObjectFactory) {
        this.game = _objectFactory.GetGame();
        this.texts = _objectFactory.GetTexts();
        this._sharedMethodService.useQuests = true;
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