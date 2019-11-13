import { IInterfaceTexts, IGame, IAction, IEnemy, IItem } from '../../../../../Engine/Interfaces/storyScript';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { GameService } from '../../../../../Engine/Services/gameService';
import template from './combat.component.html';
import { Component } from '@angular/core';
import { SharedMethodService } from '../../Services/SharedMethodService';

@Component({
    selector: 'combat',
    template: template,
})
export class CombatComponent {
    constructor(private _gameService: GameService, private _sharedMethodService: SharedMethodService, _objectFactory: ObjectFactory) {
        this.game = _objectFactory.GetGame();
        this.texts = _objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent(this.game);

    getButtonClass = (action: IAction): string => this._sharedMethodService.getButtonClass(action);

    executeAction = (action: IAction): void => this._sharedMethodService.executeAction(this.game, action, this); 

    fight = (enemy: IEnemy): void => this._gameService.fight(enemy);
    
    useItem = (item: IItem): void => this._gameService.useItem(item);
}