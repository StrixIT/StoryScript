import { DefaultEquipment, ICharacter, IGame, IInterfaceTexts, IItem } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, Input, inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'equipment',
    template: getTemplate('equipment', await import('./equipment.component.html'))
})
export class EquipmentComponent {
    @Input() character!: ICharacter;
    private _characterService: CharacterService;
    private _sharedMethodService: SharedMethodService;
    
    constructor() {
        this._characterService = inject(CharacterService);
        this._sharedMethodService = inject(SharedMethodService);
        const objectFactory = inject(ServiceFactory);
        this.texts = objectFactory.GetTexts();
        this._sharedMethodService.useEquipment = true;
    }

    texts: IInterfaceTexts;

    showEquipment = (): boolean => this._sharedMethodService.showEquipment(this.character);

    unequipItem = (item: IItem): boolean => this._characterService.unequipItem(this.character, item);

    isSlotUsed = (slot: string): boolean => {
        return this._characterService.isSlotUsed(this.character, slot);
    }

    customSlots = () => {
        var defaultSlots = Object.keys(new DefaultEquipment());
        var customSlots = Object.keys(this.character.equipment).filter(e => defaultSlots.indexOf(e) === -1)
        return customSlots;
    }
}