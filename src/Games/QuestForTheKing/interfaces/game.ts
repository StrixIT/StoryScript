module QuestForTheKing {
    export interface IGame extends StoryScript.IGame {
        character: Character;
        locations: StoryScript.ICollection<ICompiledLocation>;
        currentLocation: ICompiledLocation;
        previousLocation: ICompiledLocation;
        helpers: IHelperService;
        worldProperties: IWorldProperties
    }

    export interface IHelperService extends StoryScript.IHelperService {
        randomEnemy: (selector?: (enemy: IEnemy) => boolean) => IEnemy;
        randomItem: (selector?: (enemy: IItem) => boolean) => IItem;
        getEnemy: (selector: string) => IEnemy;
        getItem: (selector: string) => IItem;
    }
}