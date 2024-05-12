import { IInterfaceTexts, IGame, IAction, IEnemy, IItem, ICharacter, ICollection, TargetType, ICombatTurn } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { GameService } from 'storyScript/Services/gameService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component, inject } from '@angular/core';
import { getTemplate } from '../../helpers';

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
        this.enemyRows = this.split(this.game.currentLocation.activeEnemies, 3);
        this.characterRows = this.split(this.game.combat, 3);
    }

    game: IGame;
    texts: IInterfaceTexts;
    actionsEnabled: boolean = true;
    multiCharacter: boolean;
    enemyRows: ICollection<IEnemy>[];
    characterRows: ICollection<ICharacter>[];

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

    getButtonClass = (action: IAction): string => this._sharedMethodService.getButtonClass(action);

    executeAction = (action: IAction): void => this._sharedMethodService.executeAction(action, this);

    getTargetName = (target: IEnemy | ICharacter): string => {
        var type = (<any>target).type === 'enemy' ? TargetType.Enemy : TargetType.Ally;
        return type === TargetType.Enemy ? this.texts.format(this.texts.enemyCombatName, [target.name, (this.game.currentLocation.activeEnemies.filter(e => e.name === target.name).indexOf(target) + 1).toString()]) : target.name;
    }

    itemChange = (item: IItem, turn: ICombatTurn) => {
        const targets = turn.targetsAvailable.filter(t => {
            var type = (<any>t).type === 'enemy' ? TargetType.Enemy : TargetType.Ally;
            return item.targetType === type;
        });

        turn.target = targets[0];
    }

    filteredTargets = (turn: ICombatTurn): IEnemy[] | ICharacter[] => turn.targetsAvailable.filter(t => {
        var type = (<any>t).type === 'enemy' ? TargetType.Enemy : TargetType.Ally;
        return turn.item.targetType === type;
    });

    fight = (): void => { 
        this.actionsEnabled = false;

        Promise.resolve(this._gameService.fight(this.game.combat)).then(() => {
            this.actionsEnabled = true;
            this.characterRows = this.split(this.game.combat, 3);
        }); 
    }
    
    useItem = (character: ICharacter, item: IItem, target?: IEnemy): void => {
        this.actionsEnabled = false;

        Promise.resolve(this._gameService.useItem(character, item, target)).then(() => {
            this.actionsEnabled = true;
        }); 
    }

    canUseItem = (character: ICharacter, item: IItem): boolean => item.use ? this._sharedMethodService.canUseItem(character, item) : true;

    private split = (array, size) => {
        let result = [];

        for (let i = 0; i < array.length; i += size) {
            let chunk = array.slice(i, i + size);
            result.push(chunk);
        }

        return result;
    }
}