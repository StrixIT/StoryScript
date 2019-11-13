import { IGame, IInterfaceTexts, IItem } from '../../../../../Engine/Interfaces/storyScript';
import { ISharedMethodService, SharedMethodService } from '../../Services/SharedMethodService';
import { IGameService, ICharacterService } from '../../../../../Engine/Services/interfaces/services';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import template from './backpack.component.html';
import { Component } from '@angular/core';
import { GameService } from '../../../../../Engine/Services/gameService';
import { CharacterService } from '../../../../../Engine/Services/characterService';

@Component({
    selector: 'encounter',
    template: template,
})
export class BackpackComponent {
    constructor(private _sharedMethodService: SharedMethodService, private _gameService: GameService, private _characterService: CharacterService, private _objectFactory: ObjectFactory) {
        this.game = _objectFactory.GetGame();
        this.texts = _objectFactory.GetTexts();
        this._sharedMethodService.useBackpack = true;
    }

    game: IGame;
    texts: IInterfaceTexts;

    hasDescription = (type: string, item: { id?: string, description?: string }): boolean => this._gameService.hasDescription(type, item);

    showDescription = (item: any, title: string): void => this._sharedMethodService.showDescription('items', item, title);

    getCombineClass = (item: IItem): string => this.game.combinations.getCombineClass(item);

    tryCombine = (item: IItem): boolean => this.game.combinations.tryCombine(item);

    showEquipment = (): boolean => this._sharedMethodService.showEquipment(this.game);

    canEquip = (item: IItem): boolean => this._characterService.canEquip(item);
    
    equipItem = (item: IItem): boolean => this._characterService.equipItem(item);

    useItem = (item: IItem): void => this._gameService.useItem(item);

    canDropItems = (): boolean => this._sharedMethodService.useGround;

    dropItem = (item: IItem): void => this._characterService.dropItem(item);
}