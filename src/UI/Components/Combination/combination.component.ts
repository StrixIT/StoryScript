import { IInterfaceTexts, IGame, ICombinable, ICombinationAction, ICombineResult } from 'storyScript/Interfaces/storyScript';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { CombinationService } from 'storyScript/Services/CombinationService';
import { Component, inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'combination',
    template: getTemplate('combination', await import('./combination.component.html'))
})
export class CombinationComponent {
    private _combinationService: CombinationService

    constructor() {
        this._combinationService = inject(CombinationService);
        const objectFactory = inject(ObjectFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.combineActions = this._combinationService.getCombinationActions();
    }

    game: IGame;
    texts: IInterfaceTexts;
    combineActions: ICombinationAction[];

    selectCombinationAction = (combination: ICombinationAction) => this._combinationService.setActiveCombination(combination);

    getCombineClass = (action: ICombinationAction): string => this.game.combinations.activeCombination && this.game.combinations.activeCombination.selectedCombinationAction === action ? 'btn-outline-dark' : 'btn-dark';
    
    tryCombination = (source: ICombinable): ICombineResult => this._combinationService.tryCombination(source);   
}