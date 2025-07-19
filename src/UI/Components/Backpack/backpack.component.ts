import {ICharacter, IGame, IGroupableItem, IInterfaceTexts, IItem} from 'storyScript/Interfaces/storyScript';
import {SharedMethodService} from '../../Services/SharedMethodService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, computed, inject, Input} from '@angular/core';
import {getTemplate} from '../../helpers';
import {ItemService} from "storyScript/Services/ItemService.ts";
import {NgbCollapse} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "ui/Modules/sharedModule.ts";

@Component({
    standalone: true,
    selector: 'backpack',
    imports: [SharedModule, NgbCollapse],
    template: getTemplate('backpack', await import('./backpack.component.html?raw'))
})
export class BackpackComponent {
    @Input() character!: ICharacter;
    private readonly _itemService: ItemService;
    private readonly _sharedMethodService: SharedMethodService;

    constructor() {
        this._itemService = inject(ItemService);
        this._sharedMethodService = inject(SharedMethodService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this._sharedMethodService.useBackpack = true;
    }

    game: IGame;
    texts: IInterfaceTexts;
    joinItem: IGroupableItem<IItem>;

    showEquipment = computed((): boolean => this._sharedMethodService.showEquipment(this.character));

    canDropItems = computed((): boolean => this._sharedMethodService.useGround);

    hasDescription = (item: IItem): boolean => this._sharedMethodService.hasDescription(item);

    showDescription = (item: IItem, title: string): void => this._sharedMethodService.showDescription('item', item, title);

    getCombineClass = (item: IItem): string => this.game.combinations.getCombineClass(item);

    tryCombine = (item: IItem): boolean => this._sharedMethodService.tryCombine(item);

    getItemName = (item: IItem): string => this._itemService.getItemName(item);

    canEquip = (item: IItem): boolean => this._itemService.isEquippable(item, this.character);

    canDrop = (item: IItem): boolean => this._itemService.canDrop(item);

    equipItem = (item: IItem): boolean => this._itemService.equipItem(this.character, item);

    canUseItem = (item: IItem): boolean => this._sharedMethodService.canUseItem(this.character, item);

    useItem = (item: IItem): Promise<void> | void => this._itemService.useItem(this.character, item);

    dropItem = (item: IItem): void => this._itemService.dropItem(this.character, item);

    canGroupItem = (item: IGroupableItem<IItem>): boolean => this._itemService.canGroupItem(this.character, this.joinItem, item)

    groupItem = (item: IGroupableItem<IItem>): void => {
        if (this.joinItem && this._itemService.groupItem(this.character, this.joinItem, item)) {
            this.joinItem = null;
        } else {
            this.joinItem = item;
        }
    }

    splitItemGroup = (item: IGroupableItem<IItem>): void => this._itemService.splitItemGroup(this.character, item);
}