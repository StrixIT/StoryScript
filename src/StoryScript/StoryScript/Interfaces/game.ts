module StoryScript {
    export class ScoreEntry {
        name: string;
        score: number;
    }

    export interface IGame {
        nameSpace: string;
        definitions: IDefinitions;
        createCharacterSheet?: ICreateCharacter;
        character: ICharacter;
        locations: ICompiledCollection<ICompiledLocation>;
        currentLocation: ICompiledLocation;
        previousLocation: ICompiledLocation;

        highScores: ScoreEntry[];
        actionLog: string[];
        combatLog: string[];
        state: StoryScript.GameState;

        changeLocation(location?: string | (() => ILocation)): void;
        rollDice(dice: string): number;
        calculateBonus(person: { items: ICollection<IItem>, equipment?: {} }, type: string): number;
        logToLocationLog(message: string): void;
        logToActionLog(message: string): void;
        logToCombatLog(message: string): void;

        randomEnemy: (selector?: (enemy: IEnemy) => boolean) => IEnemy;
        randomItem: (selector?: (enemy: IItem) => boolean) => IItem;
        getEnemy: (selector: string | (() => IEnemy)) => IEnemy;
        getItem: (selector: string | (() => IItem)) => IItem;

        equals<T>(entity: T, definition: () => T): boolean;

        fight: (enemy: IEnemy) => void;
    }
}