import {IBarrier, IGame, IInterfaceTexts, IItem} from 'storyScript/Interfaces/storyScript';
import {SharedMethodService} from '../../Services/SharedMethodService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, inject} from '@angular/core';
import {getTemplate} from '../../helpers';
import {ItemService} from "storyScript/Services/ItemService.ts";
import {SharedModule} from "ui/Modules/sharedModule.ts";

@Component({
    standalone: true,
    selector: 'ground',
    imports: [SharedModule],
    template: getTemplate('ground', await import('./ground.component.html?raw'))
})
export class GroundComponent {
    private readonly _sharedMethodService: SharedMethodService;
    private readonly _itemService: ItemService;

    constructor() {
        this._sharedMethodService = inject(SharedMethodService);
        this._itemService = inject(ItemService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this._sharedMethodService.useGround = true;
    }

    game: IGame;
    texts: IInterfaceTexts;

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

    getCombineClass = (barrier: IBarrier): string => this.game.combinations.getCombineClass(barrier);

    getItemName = (item: IItem): string => this._itemService.getItemName(item);

    pickupItem = (item: IItem): boolean => this._itemService.pickupItem(this.game.activeCharacter, item);
}