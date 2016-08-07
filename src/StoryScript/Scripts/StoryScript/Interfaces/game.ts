module StoryScript {
    export class ScoreEntry {
        name: string;
        score: number;
    }

    export interface IGame {
        nameSpace: string;
        definitions: {
            locations: [() => StoryScript.ILocation],
            actions: [() => StoryScript.IAction],
            enemies: [() => StoryScript.IEnemy],
            items: [() => StoryScript.IItem]
        };
        createCharacterSheet?: ICreateCharacter;
        character: ICharacter;
        locations: ICollection<ICompiledLocation>;
        currentLocation: ICompiledLocation;
        previousLocation: ICompiledLocation;

        highScores: ScoreEntry[];
        actionLog: string[];
        state: string;

        changeLocation(location?: any): void;
        rollDice(dice: string): number;
        calculateBonus(person: IActor, type: string): number;
        logToLocationLog(message: string): void;
        logToActionLog(message: string): void;
    }
}