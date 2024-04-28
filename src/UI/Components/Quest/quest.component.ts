import { IGame, IInterfaceTexts, IQuest, ICollection } from 'storyScript/Interfaces/storyScript';
import { isEmpty } from 'storyScript/utilities';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component, inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'quests',
    template: getTemplate('quest', await import('./quest.component.html'))
})
export class QuestComponent {
    private _characterService: CharacterService;

    constructor() {
        this._characterService = inject(CharacterService);
        const sharedMethodService = inject(SharedMethodService);
        const objectFactory = inject(ObjectFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        sharedMethodService.useQuests = true;
    }

    game: IGame;
    texts: IInterfaceTexts;

    showQuests = (): boolean => this.game.party && !isEmpty(this.game.party.quests);

    showActiveQuests = (): boolean => this.game.party.quests.filter(q => !q.completed).length > 0;

    showCompletedQuests = (): boolean => this.game.party.quests.filter(q => q.completed).length > 0;

    currentQuests = (): ICollection<IQuest> => this.game.party.quests.filter(q => q.completed === false);

    completedQuests = (): ICollection<IQuest> => this.game.party.quests.filter(q => q.completed === true);

    questStatus = (quest: IQuest): string => this._characterService.questStatus(quest);
}