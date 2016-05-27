module StoryScript {
    export class Game {
        character: Interfaces.ICharacter;
        locations: Interfaces.ICollection<Interfaces.ICompiledLocation>;
        currentLocation: Interfaces.ICompiledLocation;
        previousLocation: Interfaces.ICompiledLocation;

        highScores: string[];
        actionLog: string[];

        state: string;

        // Todo: only to overwrite. Use interface? Better typing?
        changeLocation(location: any) { }
        rollDice(dice: string): number { return 0; }

        constructor() {
            var self = this;
            self.actionLog = [];
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