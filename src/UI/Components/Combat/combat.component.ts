import { IInterfaceTexts, IGame, IAction, IEnemy, IItem } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { GameService } from 'storyScript/Services/gameService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'combat',
    template: getTemplate('combat', require('./combat.component.html'))
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