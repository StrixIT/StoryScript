import {ICharacter, IGame, IInterfaceTexts, IItem} from 'storyScript/Interfaces/storyScript';
import {SharedMethodService} from '../../Services/SharedMethodService';
import {CharacterService} from 'storyScript/Services/CharacterService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, inject, Input} from '@angular/core';
import {getTemplate} from '../../helpers';

@Component({
    selector: 'backpack',
    template: getTemplate('backpack', await import('./backpack.component.html?raw'))
})
export class BackpackComponent {
    @Input() character!: ICharacter;
    private _characterService: CharacterService;
    private _sharedMethodService: SharedMethodService;

    constructor() {
        this._characterService = inject(CharacterService);
        this._sharedMethodService = inject(SharedMethodService);
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

    useItem = (item: IItem): Promise<void> | void => this._characterService.useItem(this.character, item);

    canDropItems = (): boolean => this._sharedMethodService.useGround;

    dropItem = (item: IItem): void => this._characterService.dropItem(this.character, item);
}