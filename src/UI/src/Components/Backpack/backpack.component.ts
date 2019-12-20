import { IGame, IInterfaceTexts, IItem } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { GameService } from 'storyScript/Services/gameService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import template from './backpack.component.html';
import { Component } from '@angular/core';

@Component({
    selector: 'backpack',
    template: template,
})
export class BackpackComponent {
    constructor(private _sharedMethodService: SharedMethodService, private _gameService: GameService, private _characterService: CharacterService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this._sharedMethodService.useBackpack = true;
    }

    game: IGame;
    texts: IInterfaceTexts;

    showDescription = (item: any, title: string): void => this._sharedMethodService.showDescription(this.game, 'items', item, title);

    getCombineClass = (item: IItem): string => this.game.combinations.getCombineClass(item);

    tryCombine = (item: IItem): boolean => this._sharedMethodService.tryCombine(this.game, item);

    showEquipment = (): boolean => this._sharedMethodService.showEquipment(this.game);

    canEquip = (item: IItem): boolean => this._characterService.canEquip(item);
    
    equipItem = (item: IItem): boolean => this._characterService.equipItem(item);

    useItem = (item: IItem): void => this._gameService.useItem(item);

    canDropItems = (): boolean => this._sharedMethodService.useGround;

    dropItem = (item: IItem): void => this._characterService.dropItem(item);
}