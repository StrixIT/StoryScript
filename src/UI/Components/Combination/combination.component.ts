import { IInterfaceTexts, IGame, ICombinable, ICombinationAction, ICombineResult } from 'storyScript/Interfaces/storyScript';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { CombinationService } from 'storyScript/Services/CombinationService';
import { Component, inject } from '@angular/core';
import { getTemplate } from '../../helpers';
import {CommonModule} from "@angular/common";

@Component({
    standalone: true,
    selector: 'combination',
    imports: [CommonModule],
    template: getTemplate('combination', await import('./combination.component.html?raw'))
})
export class CombinationComponent {
    private readonly _combinationService: CombinationService

    constructor() {
        this._combinationService = inject(CombinationService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.combineActions = this._combinationService.getCombinationActions();
    }

    game: IGame;
    texts: IInterfaceTexts;
    combineActions: ICombinationAction[];

    selectCombinationAction = (combination: ICombinationAction) => this._combinationService.setActiveCombination(combination);

    getCombineClass = (action: ICombinationAction): string => this.game.combinations.activeCombination && this.game.combinations.activeCombination.selectedCombinationAction === action ? 'btn-outline-dark' : 'btn-dark';
    
    tryCombination = (source: ICombinable): ICombineResult => this.game.combinations.tryCombine(source);   
}