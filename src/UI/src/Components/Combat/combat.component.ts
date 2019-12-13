import { IInterfaceTexts, IGame, IAction, IEnemy, IItem } from '../../../../Engine/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { GameService } from '../../../../Engine/Services/gameService';
import { ObjectFactory } from '../../../../Engine/ObjectFactory';
import template from './combat.component.html';
import { Component } from '@angular/core';

@Component({
    selector: 'combat',
    template: template,
})
export class CombatComponent {
    constructor(private _gameService: GameService, private _sharedMethodService: SharedMethodService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent(this.game);

    getButtonClass = (action: IAction): string => this._sharedMethodService.getButtonClass(action);

    executeAction = (action: IAction): void => this._sharedMethodService.executeAction(this.game, action, this); 

    fight = (enemy: IEnemy): void => this._sharedMethodService.fight(this.game, enemy);
    
    useItem = (item: IItem): void => this._gameService.useItem(item);
}