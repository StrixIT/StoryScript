import {
    IAction,
    ICharacter,
    ICombatTurn,
    IEnemy,
    IGame,
    IInterfaceTexts,
    IItem,
    TargetType
} from 'storyScript/Interfaces/storyScript';
import {SharedMethodService} from '../../Services/SharedMethodService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, inject} from '@angular/core';
import {getTemplate} from '../../helpers';
import {CombatService} from "storyScript/Services/CombatService.ts";
import {CharacterService} from "storyScript/Services/characterService.ts";

@Component({
    selector: 'combat',
    template: getTemplate('combat', await import('./combat.component.html?raw'))
})
export class CombatComponent {
    private _characterService: CharacterService;
    private _combatService: CombatService;
    private _sharedMethodService: SharedMethodService;

    constructor() {
        this._characterService = inject(CharacterService);
        this._combatService = inject(CombatService);
        this._sharedMethodService = inject(SharedMethodService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.multiCharacter = this.game.party.characters.length > 1;
        this.enemyRows = this.split(this.game.combat.enemies, 3);
        this.characterRows = this.split(this.game.combat, 3);
    }

    game: IGame;
    texts: IInterfaceTexts;
    actionsEnabled: boolean = true;
    multiCharacter: boolean;
    enemyRows: IEnemy[];
    characterRows: ICharacter[];

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

    getButtonClass = (action: [string, IAction]): string => this._sharedMethodService.getButtonClass(action);

    executeAction = (action: [string, IAction]): void => this._sharedMethodService.executeAction(action, this);

    itemChange = (item: IItem, turn: ICombatTurn) => {
        const targets = turn.targetsAvailable.filter(t => {
            const type = (<any>t).type === 'enemy' ? TargetType.Enemy : TargetType.Ally;
            return item.targetType === type;
        });

        turn.target = targets[0];
    }

    filteredTargets = (turn: ICombatTurn): IEnemy[] | ICharacter[] => turn.targetsAvailable.filter(t => {
        const type = (<any>t).type === 'enemy' ? TargetType.Enemy : TargetType.Ally;
        return turn.item.targetType === type;
    });

    fight = (): void => {
        this.actionsEnabled = false;

        Promise.resolve(this._combatService.fight(this.game.combat)).then(() => {
            this.actionsEnabled = true;
            this.characterRows = this.split(this.game.combat, 3);
        });
    }

    itemSelectable = (item: IItem) => this._combatService.isSelectable(item);

    private split = (array, size) => {
        const result = [];

        if (!array) {
            return result;
        }

        for (let i = 0; i < array.length; i += size) {
            let chunk = array.slice(i, i + size);
            result.push(chunk);
        }

        return result;
    }
}