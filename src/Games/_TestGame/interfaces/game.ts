import * as StoryScript from '../../../Engine/Interfaces/storyScript';
import { IPerson, IEnemy, IItem, ICompiledLocation, Character } from './types';

// Your game-specific game interface.
export class Game implements StoryScript.IGame {
    definitions: StoryScript.IDefinitions;
    createCharacterSheet?: StoryScript.CreateCharacters.ICreateCharacter;
    highScores: StoryScript.ScoreEntry[];
    actionLog: string[];
    combatLog: string[];
    state: StoryScript.Enumerations.GameState;
    playState: StoryScript.Enumerations.PlayState;
    trade: StoryScript.ITrade;
    currentDescription: { title: string; type: string; item: StoryScript.IFeature; };
    loading: boolean;
    combinations: { activeCombination: StoryScript.Combinations.IActiveCombination; combinationResult: { done: boolean; text: string; featuresToRemove: string[]; reset(): void; }; getCombineClass(tool: StoryScript.Combinations.ICombinable): string; tryCombine(target: StoryScript.Combinations.ICombinable): boolean; };
    worldProperties: any;
    dynamicStyles: StoryScript.IDynamicStyle[];
    statistics: StoryScript.IStatistics;
    sounds: { startMusic(): void; stopMusic(): void; };
    changeLocation(location?: string | (() => StoryScript.ILocation), travel?: boolean): void {
        throw new Error('Method not implemented.');
    }
    logToLocationLog(message: string): void {
        throw new Error('Method not implemented.');
    }
    logToActionLog(message: string): void {
        throw new Error('Method not implemented.');
    }
    logToCombatLog(message: string): void {
        throw new Error('Method not implemented.');
    }
    fight(enemy: StoryScript.IEnemy, retaliate?: boolean): void {
        throw new Error('Method not implemented.');
    }
    character: Character;
    person: IPerson;
    locations: StoryScript.ICollection<ICompiledLocation>;
    currentLocation: ICompiledLocation;
    previousLocation: ICompiledLocation;
    helpers: IHelpers;
}

export interface IHelpers extends StoryScript.IHelpers {
    randomEnemy: (selector?: (enemy: IEnemy) => boolean) => IEnemy;
    randomItem: (selector?: (enemy: IItem) => boolean) => IItem;
    getEnemy: (selector: string) => IEnemy;
    getItem: (selector: string) => IItem;
}