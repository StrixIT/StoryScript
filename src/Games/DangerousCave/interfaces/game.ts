﻿namespace DangerousCave {
    export interface IGame extends StoryScript.IGame {
        character: Character;
        locations: StoryScript.ICollection<ICompiledLocation>;
        currentLocation: ICompiledLocation;
        previousLocation: ICompiledLocation;
        helpers: IHelperService;
    }

    export interface IHelperService extends StoryScript.IHelperService {
        randomEnemy(selector?: (enemy: IEnemy) => boolean): IEnemy;
    }
}