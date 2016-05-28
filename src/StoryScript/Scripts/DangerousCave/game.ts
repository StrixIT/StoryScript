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

        constructor() {
            var self = this;
            self.highScores = [];
            self.actionLog = [];
            self.currentLocation = null;
            self.previousLocation = null;
        }

        logToLocationLog = (message: string) => {
            var self = this;
            self.currentLocation.log = self.currentLocation.log || [];
            self.currentLocation.log.push(message);
        }

        logToActionLog = (message: string) => {
            var self = this;
            self.actionLog.splice(0, 0, message);
        }
    }
}