import { ISetupRules } from './setupRules';
import { IGeneralRules } from './generalRules';
import { ICharacterRules } from './characterRules';
import { IExplorationRules } from './explorationRules';
import { ICombatRules } from './combatRules';

export interface IRules {
    /**
     * Rules for setting up the game.
     */
    setup: ISetupRules,

    /**
     * General game rules.
     */
    general?: IGeneralRules,

    /**
     * Rules for the game character.
     */
    character: ICharacterRules,

    /**
     * Rules for exploring.
     */
    exploration?: IExplorationRules,

    /**
     * Rule for combat.
     */
    combat?: ICombatRules
}