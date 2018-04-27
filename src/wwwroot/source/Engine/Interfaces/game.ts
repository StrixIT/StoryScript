namespace StoryScript {
    export class ScoreEntry {
        name: string;
        score: number;
    }

    export interface IGame {
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

        fight: (enemy: ICompiledEnemy, retaliate?: boolean) => void;

        helpers: IHelperService;
    }
}