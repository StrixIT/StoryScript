import { IGame, IInterfaceTexts, IItem, IEnemy } from '../../../../../Engine/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { Component } from '@angular/core';
import template from './enemy.component.html';

@Component({
    selector: 'enemy',
    template: template,
})
export class EnemyComponent {
    constructor(private _sharedMethodService: SharedMethodService, private _objectFacory: ObjectFactory) {
        this.game = _objectFacory.GetGame();
        this.texts = _objectFacory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    getCombineClass = (item: IItem): string => this.game.combinations.getCombineClass(item);

    tryCombine = (enemy: IEnemy): boolean => this._sharedMethodService.tryCombine(this.game, enemy);

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent(this.game);

    showDescription = (item: any, title: string): void => this._sharedMethodService.showDescription('enemies', item, title);  

    startCombat = (): void => this._sharedMethodService.startCombat(this.game);
}