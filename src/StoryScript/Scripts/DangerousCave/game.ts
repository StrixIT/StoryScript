module DangerousCave {
    export class Game implements StoryScript.IGame {
        character: Character;
        locations: StoryScript.ICollection<StoryScript.ICompiledLocation>;
        currentLocation: StoryScript.ICompiledLocation;
        previousLocation: StoryScript.ICompiledLocation;
        highScores: string[];
        actionLog: string[];
        state: string;

        // Todo: only to overwrite. Use interface? Better typing?
        changeLocation(location: any) { }
        rollDice(dice: string): number { return 0; }
        logToLocationLog = (message: string) => { }
        logToActionLog = (message: string) => { }
    }
}