import { IGame, IInterfaceTexts, IItem, IEnemy } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, inject } from '@angular/core';
import { getTemplate } from '../../helpers';
import {CommonModule} from "@angular/common";

@Component({
    standalone: true,
    selector: 'enemy',
    imports: [CommonModule],
    template: getTemplate('enemy', await import('./enemy.component.html?raw'))
})
export class EnemyComponent {
    private readonly _sharedMethodService: SharedMethodService;

    constructor() {
        this._sharedMethodService = inject(SharedMethodService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
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