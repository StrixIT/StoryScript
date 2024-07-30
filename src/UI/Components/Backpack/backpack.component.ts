import { ICharacter, IGame, IInterfaceTexts, IItem } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { GameService } from 'storyScript/Services/gameService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, Input, inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'backpack',
    template: getTemplate('backpack', await import('./backpack.component.html'))
})
export class BackpackComponent {
    @Input() character!: ICharacter;
    private _characterService: CharacterService;
    private _sharedMethodService: SharedMethodService;
    private _gameService: GameService;

    constructor() {
        this._characterService = inject(CharacterService);
        this._sharedMethodService = inject(SharedMethodService);
        this._gameService = inject(GameService);
        const objectFactory = inject(ServiceFactory);
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

    showEquipment = (): boolean => this._sharedMethodService.showEquipment(this.character);

    canEquip = (item: IItem): boolean => this._characterService.isEquippable(item);

    canDrop = (item: IItem): boolean => this._characterService.canDrop(item);
    
    equipItem = (item: IItem): boolean => this._characterService.equipItem(this.character, item);

    canUseItem = (item: IItem): boolean => this._sharedMethodService.canUseItem(this.character, item);

    useItem = (item: IItem): Promise<void> | void => this._gameService.useItem(this.character, item);

    canDropItems = (): boolean => this._sharedMethodService.useGround;

    dropItem = (item: IItem): void => this._characterService.dropItem(this.character, item);
}