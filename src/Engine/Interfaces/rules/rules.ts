import {
    ICharacterRules,
    ICombatRules,
    ICombinationRules,
    IEncounterRules,
    IExplorationRules,
    IGeneralRules,
    ISetupRules
} from 'storyScript';

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
     * Rules for encounters.
     */
    encounters?: IEncounterRules,

    /**
     * Rules for combat.
     */
    combat?: ICombatRules,

    /**
     * Rule for combat.
     */
    combinations?: ICombinationRules
}