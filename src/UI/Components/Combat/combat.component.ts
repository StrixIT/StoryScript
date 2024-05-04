import { IInterfaceTexts, IGame, IAction, IEnemy, IItem, ICharacter, ICollection } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { GameService } from 'storyScript/Services/gameService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component, inject } from '@angular/core';
import { getTemplate } from '../../helpers';
import { ICombatSetup } from '../../../Engine/Interfaces/combatSetup';

@Component({
    selector: 'combat',
    template: getTemplate('combat', await import('./combat.component.html'))
})
export class CombatComponent {
    private _gameService: GameService;
    private _sharedMethodService: SharedMethodService;
    
    constructor() {
        this._gameService = inject(GameService);
        this._sharedMethodService = inject(SharedMethodService);
        const objectFactory = inject(ObjectFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.multiCharacter = this.game.party.characters.length > 1;
    }

    game: IGame;
    texts: IInterfaceTexts;
    actionsEnabled: boolean = true;
    multiCharacter: boolean;

    enemies = (): ICollection<IEnemy> => this.game.currentLocation.activeEnemies;

    getCombatItems = (character: ICharacter): IItem[] => {
        const index = this.game.party.characters.indexOf(character);
        const items = [...character.combatItems];

        if (character.equipment.leftHand) {
            items.splice(0, 0, character.equipment.leftHand);
        }
        if (character.equipment.rightHand) {
            items.splice(0, 0, character.equipment.rightHand);
        }

        this.game.combat[index].item = items[0];
        return items;
    }

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

    getButtonClass = (action: IAction): string => this._sharedMethodService.getButtonClass(action);

    executeAction = (action: IAction): void => this._sharedMethodService.executeAction(action, this); 

    fight = (): void => { 
        this.actionsEnabled = false;

        Promise.resolve(this._gameService.fight(this.game.combat)).then(() => {
            this.actionsEnabled = true;
        }); 
    }
    
    useItem = (character: ICharacter, item: IItem, target?: IEnemy): void => {
        this.actionsEnabled = false;

        Promise.resolve(this._gameService.useItem(character, item, target)).then(() => {
            this.actionsEnabled = true;
        }); 
    }

    canUseItem = (character: ICharacter, item: IItem): boolean => item.use ? this._sharedMethodService.canUseItem(character, item) : true;
}