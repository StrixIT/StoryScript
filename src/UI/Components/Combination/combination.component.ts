import { IInterfaceTexts, IGame, ICombinable, ICombinationAction, ICombineResult } from 'storyScript/Interfaces/storyScript';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { CombinationService } from 'storyScript/Services/CombinationService';
import { Component } from '@angular/core';
import template from './combination.component.html';

@Component({
    selector: 'combination',
    template: template,
})
export class CombinationComponent {
    constructor(private _combinationService: CombinationService, objectFactory: ObjectFactory) {
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