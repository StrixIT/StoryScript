namespace _LanternofWorlds {
    // Your game-specific game interface.
    export interface IGame extends StoryScript.IGame {
        character: Character;
        locations: StoryScript.ICollection<ICompiledLocation>;
        currentLocation: ICompiledLocation;
        previousLocation: ICompiledLocation;
        helpers: IHelperService;
    }

    export interface IHelperService extends StoryScript.IHelperService {
        randomEnemy: (selector?: (enemy: IEnemy) => boolean) => IEnemy;
        randomItem: (selector?: (enemy: IItem) => boolean) => IItem;
        getEnemy: (selector: string) => IEnemy;
        getItem: (selector: string) => IItem;
    }
}