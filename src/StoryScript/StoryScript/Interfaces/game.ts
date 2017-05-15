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
        locations: ICompiledCollection<ILocation, ICompiledLocation>;
        currentLocation: ICompiledLocation;
        previousLocation: ICompiledLocation;

        highScores: ScoreEntry[];
        actionLog: string[];
        combatLog: string[];
        state: StoryScript.GameState;

        worldProperties: any;

        statistics: IStatistics;

        changeLocation(location?: string | (() => ILocation), travel?: boolean): void;
        logToLocationLog(message: string): void;
        logToActionLog(message: string): void;
        logToCombatLog(message: string): void;

        randomEnemy: (selector?: (enemy: IEnemy) => boolean) => ICompiledEnemy;
        randomItem: (selector?: (enemy: IItem) => boolean) => IItem;
        getEnemy: (selector: string | (() => IEnemy)) => ICompiledEnemy;
        getItem: (selector: string | (() => IItem)) => IItem;
        getPerson: (selector: string | (() => IPerson)) => ICompiledPerson;

        fight: (enemy: ICompiledEnemy, retaliate?: boolean) => void;
    }
}