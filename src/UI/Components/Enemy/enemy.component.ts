import {IEnemy, IGame, IInterfaceTexts, IItem} from 'storyScript/Interfaces/storyScript';
import {SharedMethodService} from '../../Services/SharedMethodService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, computed, inject} from '@angular/core';
import {getTemplate} from '../../helpers';
import {SharedModule} from "ui/Modules/sharedModule.ts";

@Component({
    standalone: true,
    selector: 'enemy',
    imports: [SharedModule],
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

    enemiesPresent = computed((): boolean => this._sharedMethodService.enemiesPresent());
    
    getCombineClass = (item: IItem): string => this.game.combinations.getCombineClass(item);

    tryCombine = (enemy: IEnemy): boolean => this._sharedMethodService.tryCombine(enemy);

    hasDescription = (enemy: IEnemy): boolean => this._sharedMethodService.hasDescription(enemy);

    showDescription = (enemy: IEnemy, title: string): void => this._sharedMethodService.showDescription('enemy', enemy, title);

    startCombat = (): void => this._sharedMethodService.startCombat();
}