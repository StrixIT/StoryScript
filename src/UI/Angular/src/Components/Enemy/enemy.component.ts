import { IGame, IInterfaceTexts, IItem, IEnemy } from '../../../../../Engine/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { GameService } from '../../../../../Engine/Services/gameService';
import { Component } from '@angular/core';
import template from './enemy.component.html';

@Component({
    selector: 'enemy',
    template: template,
})
export class EnemyComponent {
    constructor(private _gameService: GameService, private _sharedMethodService: SharedMethodService, private _objectFacory: ObjectFactory) {
        this.game = _objectFacory.GetGame();
        this.texts = _objectFacory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    getCombineClass = (item: IItem): string => this.game.combinations.getCombineClass(item);

    tryCombine = (enemy: IEnemy): boolean => this.game.combinations.tryCombine(enemy);

    showDescription = (item: any, title: string): void => this._sharedMethodService.showDescription('enemies', item, title);  

    startCombat = (): void => this._sharedMethodService.startCombat(this.game);
}