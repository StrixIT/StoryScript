import { IInterfaceTexts, IGame, Combinations } from '../../../../../Engine/Interfaces/storyScript';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { CombinationService } from '../../../../../Engine/Services/CombinationService';
import { Component } from '@angular/core';
import template from './combination.component.html';

@Component({
    selector: 'combination',
    template: template,
})
export class CombinationComponent {
    constructor(private _combinationService: CombinationService, private _objectFactory: ObjectFactory) {
        this.game = _objectFactory.GetGame();
        this.texts = _objectFactory.GetTexts();
        this.combineActions = this._combinationService.getCombinationActions();
    }

    game: IGame;
    texts: IInterfaceTexts;
    combineActions: Combinations.ICombinationAction[];

    selectCombinationAction = (combination: Combinations.ICombinationAction) => this._combinationService.setActiveCombination(combination);

    getCombineClass = (action: Combinations.ICombinationAction): string => this.game.combinations.activeCombination && this.game.combinations.activeCombination.selectedCombinationAction === action ? 'btn-outline-dark' : 'btn-dark';
    
    tryCombination = (source: Combinations.ICombinable): Combinations.ICombineResult => this._combinationService.tryCombination(source);   
}