module StoryScript {
    export interface IGame {
        character: ICharacter;
        locations: ICollection<ICompiledLocation>;
        currentLocation: ICompiledLocation;
        previousLocation: ICompiledLocation;

        highScores: string[];
        actionLog: string[];
        state: string;

        changeLocation(location: any): void;
        rollDice(dice: string): number;
        logToLocationLog(message: string): void;
        logToActionLog(message: string): void;
    }
}