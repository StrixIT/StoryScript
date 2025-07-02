import {DefaultEquipment, ICharacter, IGame, IInterfaceTexts, IItem} from 'storyScript/Interfaces/storyScript';
import {SharedMethodService} from '../../Services/SharedMethodService';
import {CharacterService} from 'storyScript/Services/CharacterService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, inject, Input} from '@angular/core';
import {getTemplate} from '../../helpers';
import {ItemService} from "storyScript/Services/ItemService.ts";
import {CommonModule} from "@angular/common";
import {NgbCollapse} from "@ng-bootstrap/ng-bootstrap";

@Component({
    standalone: true,
    selector: 'equipment',
    imports: [CommonModule, NgbCollapse],
    template: getTemplate('equipment', await import('./equipment.component.html?raw'))
})
export class EquipmentComponent {
    @Input() character!: ICharacter;
    private readonly _characterService: CharacterService;
    private readonly _itemService: ItemService;
    private readonly _sharedMethodService: SharedMethodService;

    constructor() {
        this._characterService = inject(CharacterService);
        this._itemService = inject(ItemService);
        this._sharedMethodService = inject(SharedMethodService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this._sharedMethodService.useEquipment = true;
    }

    game: IGame;
    texts: IInterfaceTexts;

    showEquipment = (): boolean => this._sharedMethodService.showEquipment(this.character);

    getItemName = (item: IItem): string => this._itemService.getItemName(item);

    unequipItem = (item: IItem): boolean => this._itemService.unequipItem(this.character, item);

    isSlotUsed = (slot: string | string[]): boolean => {
        const slots = Array.isArray(slot) ? slot : [slot];
        return slots.find(s => this._characterService.isSlotUsed(this.character, s)) !== undefined;
    }

    customSlots = () => {
        const defaultSlots = Object.keys(new DefaultEquipment());
        return Object.keys(this.character.equipment).filter(e => defaultSlots.indexOf(e) === -1)
    }
}