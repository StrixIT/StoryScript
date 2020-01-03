import { IGame, IInterfaceTexts, IItem, IBarrier } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'ground',
    template: getTemplate('ground', require('./ground.component.html'))
})
export class GroundComponent {
    constructor(private _sharedMethodService: SharedMethodService, private _characterService: CharacterService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this._sharedMethodService.useGround = true;
    }

    game: IGame;
    texts: IInterfaceTexts;

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent(this.game);

    getCombineClass = (barrier: IBarrier): string => this.game.combinations.getCombineClass(barrier);

    pickupItem = (item: IItem): boolean => this._characterService.pickupItem(item);
}