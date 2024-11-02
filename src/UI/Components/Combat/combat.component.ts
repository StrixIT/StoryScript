import {
    IAction,
    ICharacter,
    ICombatTurn,
    IEnemy,
    IGame,
    IInterfaceTexts,
    IItem
} from 'storyScript/Interfaces/storyScript';
import {SharedMethodService} from '../../Services/SharedMethodService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, inject} from '@angular/core';
import {getTemplate} from '../../helpers';
import {CombatService} from "storyScript/Services/CombatService.ts";
import {ItemService} from "storyScript/Services/ItemService.ts";
import {CombatParticipantComponent} from "../CombatParticipant/combatparticipant.component.ts";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    standalone: true,
    selector: 'combat',
    imports: [CommonModule, FormsModule, CombatParticipantComponent],
    template: getTemplate('combat', await import('./combat.component.html?raw'))
})
export class CombatComponent {
    private readonly _itemService: ItemService;
    private readonly _combatService: CombatService;
    private readonly _sharedMethodService: SharedMethodService;

    constructor() {
        this._itemService = inject(ItemService);
        this._combatService = inject(CombatService);
        this._sharedMethodService = inject(SharedMethodService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.enemyRows = this.split(this.game.combat?.enemies, 3);
        this.characterRows = this.split(this.game.combat, 3);
    }

    game: IGame;
    texts: IInterfaceTexts;
    actionsEnabled: boolean = true;
    enemyRows: IEnemy[];
    characterRows: ICharacter[];

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

    getButtonClass = (action: [string, IAction]): string => this._sharedMethodService.getButtonClass(action);

    executeAction = (action: [string, IAction]): void => this._sharedMethodService.executeAction(action, this);

    getItemName = (item: IItem): string => this._itemService.getItemName(item);

    itemChange = (item: IItem, turn: ICombatTurn) => {
        const targets = turn.targetsAvailable.concat(turn.character).filter(t => this._combatService.canTarget(item, t, turn.character));
        turn.target = targets[0];
    }

    filteredTargets = (turn: ICombatTurn): IEnemy[] | ICharacter[] => turn.targetsAvailable.concat(turn.character).filter(t => this._combatService.canTarget(turn.item, t, turn.character));

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