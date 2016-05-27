module StoryScript {
    export interface IRuleService {
        getGame(): IGame;
        getCharacterForm(): any;
        createCharacter(characterData: any): ICharacter;
        startGame(): void;
        addEnemyToLocation(location: ICompiledLocation, enemy: IEnemy): void;
        enterLocation(location: ICompiledLocation): void;
        initCombat(location: ICompiledLocation): void;
    }
}