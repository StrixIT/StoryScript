import { IInterfaceTexts, IGame, IAction, IEnemy, IItem } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { GameService } from 'storyScript/Services/gameService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'combat',
    template: getTemplate('combat', await import('./combat.component.html'))
})
export class CombatComponent {
    constructor(private _gameService: GameService, private _sharedMethodService: SharedMethodService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;
    actionsEnabled: boolean = true;

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

    getButtonClass = (action: IAction): string => this._sharedMethodService.getButtonClass(action);

    executeAction = (action: IAction): void => this._sharedMethodService.executeAction(action, this); 

    fight = (enemy: IEnemy): void => { 
        this.actionsEnabled = false;

        Promise.resolve(this._sharedMethodService.fight(enemy)).then(() => {
            this.actionsEnabled = true;
        }); 
    }
    
    useItem = (item: IItem, target?: IEnemy): void => {
        this.actionsEnabled = false;

        Promise.resolve(this._gameService.useItem(item, target)).then(() => {
            this.actionsEnabled = true;
        }); 
    }

    canUseItem = (item: IItem): boolean => this._sharedMethodService.canUseItem(item);
}