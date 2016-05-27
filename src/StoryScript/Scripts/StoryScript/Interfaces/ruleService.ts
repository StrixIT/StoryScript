module StoryScript.Interfaces {
    export interface IRuleService {
        getCharacterForm(): any;
        createCharacter(characterData: any): ICharacter;
        startGame(): void;
        addEnemyToLocation(location: ICompiledLocation, enemy: IEnemy): void;
        enterLocation(location: Interfaces.ICompiledLocation): void;
        initCombat(location: Interfaces.ICompiledLocation): void;
    }
}