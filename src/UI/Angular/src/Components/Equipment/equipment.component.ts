import { IGame, IInterfaceTexts, IItem } from '../../../../../Engine/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { CharacterService } from '../../../../../Engine/Services/characterService';
import { Component } from '@angular/core';
import template from './equipment.component.html';

@Component({
    selector: 'equipment',
    template: template,
})
export class EquipmentComponent {
    constructor(private _sharedMethodService: SharedMethodService, private _characterService: CharacterService, private _objectFactory: ObjectFactory) {
        this.game = _objectFactory.GetGame();
        this.texts = _objectFactory.GetTexts();
        this._sharedMethodService.useEquipment = true;
    }

    game: IGame;
    texts: IInterfaceTexts;

    showEquipment = (): boolean => this._sharedMethodService.showEquipment(this.game);

    unequipItem = (item: IItem): boolean => this._characterService.unequipItem(item);

    isSlotUsed = (slot: string): boolean => {
        return this._characterService.isSlotUsed(slot);
    }
}