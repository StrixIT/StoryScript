module StoryScript {
    export class ScoreEntry {
        name: string;
        score: number;
    }

    export interface IGame {
        character: ICharacter;
        locations: ICollection<ICompiledLocation>;
        currentLocation: ICompiledLocation;
        previousLocation: ICompiledLocation;

        highScores: ScoreEntry[];
        actionLog: string[];
        state: string;

        changeLocation(location: any): void;
        rollDice(dice: string): number;
        calculateBonus(person: ICharacter, type: string): number;
        logToLocationLog(message: string): void;
        logToActionLog(message: string): void;
    }
}