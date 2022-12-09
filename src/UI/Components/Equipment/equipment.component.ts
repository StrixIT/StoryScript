import { DefaultEquipment, IGame, IInterfaceTexts, IItem } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'equipment',
    template: getTemplate('equipment', require('./equipment.component.html'))
})
export class EquipmentComponent {
    constructor(private _sharedMethodService: SharedMethodService, private _characterService: CharacterService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this._sharedMethodService.useEquipment = true;
    }

    game: IGame;
    texts: IInterfaceTexts;

    showEquipment = (): boolean => this._sharedMethodService.showEquipment();

    unequipItem = (item: IItem): boolean => this._characterService.unequipItem(item);

    isSlotUsed = (slot: string): boolean => {
        return this._characterService.isSlotUsed(slot);
    }

    customSlots = () => {
        var defaultSlots = Object.keys(new DefaultEquipment());
        var customSlots = Object.keys(this.game.character.equipment).filter(e => defaultSlots.indexOf(e) === -1)
        return customSlots;
    }
}