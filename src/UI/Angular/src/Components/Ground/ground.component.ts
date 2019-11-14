import { IGame, IInterfaceTexts, IItem, IBarrier } from '../../../../../Engine/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { CharacterService } from '../../../../../Engine/Services/characterService';
import { Component } from '@angular/core';
import template from './ground.component.html';

@Component({
    selector: 'ground',
    template: template,
})
export class GroundComponent {
    constructor(private _sharedMethodService: SharedMethodService, private _characterService: CharacterService, private _objectFactory: ObjectFactory) {
        this.game = _objectFactory.GetGame();
        this.texts = _objectFactory.GetTexts();
        this._sharedMethodService.useGround = true;
    }

    game: IGame;
    texts: IInterfaceTexts;

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent(this.game);

    getCombineClass = (barrier: IBarrier): string => this.game.combinations.getCombineClass(barrier);

    pickupItem = (item: IItem): boolean => this._characterService.pickupItem(item);
}