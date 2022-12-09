import { IGame, IInterfaceTexts, IItem, IEnemy } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'enemy',
    template: getTemplate('enemy', require('./enemy.component.html'))
})
export class EnemyComponent {
    constructor(private _sharedMethodService: SharedMethodService, objectFacory: ObjectFactory) {
        this.game = objectFacory.GetGame();
        this.texts = objectFacory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    getCombineClass = (item: IItem): string => this.game.combinations.getCombineClass(item);

    tryCombine = (enemy: IEnemy): boolean => this._sharedMethodService.tryCombine(enemy);

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

    hasDescription = (enemy: IEnemy): boolean => this._sharedMethodService.hasDescription(enemy);

    showDescription = (enemy: IEnemy, title: string): void => this._sharedMethodService.showDescription('enemy', enemy, title);  

    startCombat = (): void => this._sharedMethodService.startCombat();
}