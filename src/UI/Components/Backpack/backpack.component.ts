import { IGame, IInterfaceTexts, IItem } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { GameService } from 'storyScript/Services/gameService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'backpack',
    template: getTemplate('backpack', await import('./backpack.component.html'))
})
export class BackpackComponent {
    constructor(private _sharedMethodService: SharedMethodService, private _gameService: GameService, private _characterService: CharacterService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this._sharedMethodService.useBackpack = true;
    }

    game: IGame;
    texts: IInterfaceTexts;

    hasDescription = (item: IItem): boolean => this._sharedMethodService.hasDescription(item);

    showDescription = (item: IItem, title: string): void => this._sharedMethodService.showDescription('item', item, title);

    getCombineClass = (item: IItem): string => this.game.combinations.getCombineClass(item);

    tryCombine = (item: IItem): boolean => this._sharedMethodService.tryCombine(item);

    showEquipment = (): boolean => this._sharedMethodService.showEquipment();

    canEquip = (item: IItem): boolean => this._characterService.canEquip(item);
    
    equipItem = (item: IItem): boolean => this._characterService.equipItem(item);

    canUseItem = (item: IItem): boolean => this._sharedMethodService.canUseItem(item);

    useItem = (item: IItem): Promise<void> | void => this._gameService.useItem(item);

    canDropItems = (): boolean => this._sharedMethodService.useGround;

    dropItem = (item: IItem): void => this._characterService.dropItem(item);
}